import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import iconv from 'iconv-lite';

// 커리어넷 v4.1 mock 서버 (OPEN_QUESTIONS #4) — 실키 부재 + 대량 호출 금지 대응.
// 실제 API의 함정을 의도적으로 재현한다:
//  - EUC-KR XML (getOpenApi 계열) — 바이트로 인코딩해 응답
//  - "null" 문자열, <br>/&lt;/br&gt;, \r\n 리터럴, count가 string, 단일 객체로 오는 "배열"
// 장애 주입: ?__fault=timeout|http500|garbled|empty (카오스 테스트/부하 시나리오용)

const PORT = Number(process.env.MOCK_CAREERNET_PORT || 4010);

const THEMES = ['콘텐츠·미디어', '공학·기술', '의료·보건', '교육', '경영·금융', '예술·디자인', '과학·연구', '서비스', '법·행정', '스포츠'];
const JOB_NAMES = [
  '미디어 콘텐츠 디자이너', '영상 편집자', 'UX 디자이너', '소프트웨어 개발자', '데이터 과학자', '간호사', '초등학교 교사',
  '회계사', '일러스트레이터', '생명과학 연구원', '호텔리어', '변호사', '운동처방사', '게임 기획자', '웹툰 작가',
  '로봇공학 기술자', '물리치료사', '중등교사', '재무 분석가', '무대 디자이너', '천문학자', '항공승무원', '검사',
  '스포츠 마케터', '음향 엔지니어', 'AI 엔지니어', '약사', '유치원 교사', '증권 중개인', '패션 디자이너',
];

// 실 API(jobs.json) 필드명 재현: job_nm, work, aptit_name, wage, top_nm, rel_job_nm (+dirty data)
function jobFixture(i: number) {
  const name = JOB_NAMES[i % JOB_NAMES.length] + (i >= JOB_NAMES.length ? ` ${Math.floor(i / JOB_NAMES.length) + 1}` : '');
  return {
    seq: i + 1,
    job_cd: i + 1,
    job_nm: name,
    work: i % 7 === 0 ? 'null' : `${name}는 관련 분야에서 전문성을 발휘하는 직업이에요.<br>창의성과 꾸준함이 중요해요.\\r\\n  실무 경험이 도움이 돼요.`,
    aptit_name: i % 5 === 0 ? null : '창의력 관련직',
    wage: i % 3 === 0 ? '4,072' : 'null',
    wage_source: i % 3 === 0 ? `${name}의 평균연봉(중앙값)은 4,072만원입니다. (자료: 워크넷, 2021)` : 'null',
    satisfi_source: '재직자가 느끼는 직업만족도는 70% 수준입니다. (자료: 워크넷, 2021)',
    rel_job_nm: i % 4 === 0 ? 'null' : '관련 직업 A, 관련 직업 B',
    top_nm: THEMES[i % THEMES.length],
    RNUM: i + 1,
    views: 1000 + i,
  };
}

const JOBS = Array.from({ length: 120 }, (_, i) => jobFixture(i));

const MAJOR_NAMES = [
  '디지털콘텐츠디자인학과', '영상디자인학과', '컴퓨터공학과', '간호학과', '경영학과', '심리학과', '기계공학과',
  '미디어커뮤니케이션학과', '생명과학과', '교육학과', '법학과', '체육학과', '시각디자인학과', '전자공학과', '국어국문학과',
];

// 실 API(MAJOR) 필드명 재현: mClass/lClass/majorSeq/facilName + totalCount가 항목 안에 string
function majorXmlItem(i: number): string {
  const name = MAJOR_NAMES[i % MAJOR_NAMES.length] + (i >= MAJOR_NAMES.length ? ` ${Math.floor(i / MAJOR_NAMES.length) + 1}` : '');
  return `<content>
    <majorSeq>${10000 + i + 1}</majorSeq>
    <mClass>${name}</mClass>
    <lClass>${i % 2 === 0 ? '공학계열' : '인문사회계열'}</lClass>
    <facilName>${name}</facilName>
    <totalCount>45</totalCount>
    <summary>${name}에서는 이론과 실습을 함께 배워요.&lt;/br&gt;  졸업 후 진로가 다양해요.</summary>
    <department>${i % 3 === 0 ? 'null' : `${name} (서울대학교), ${name} (연세대학교) ,${name} (홍익대학교)`}</department>
  </content>`;
}

const SCHOOL_NAMES = [
  ['서울대학교', '서울 관악구', '국립'], ['연세대학교', '서울 서대문구', '사립'], ['고려대학교', '서울 성북구', '사립'],
  ['한국예술종합학교', '서울 성북구', '국립(특수)'], ['홍익대학교', '서울 마포구', '사립'], ['부산대학교', '부산 금정구', '국립'],
  ['서울시립대학교', '서울 동대문구', '시립'], ['카이스트', '대전 유성구', '국립(특수)'], ['경북대학교', '대구 북구', '국립'],
  ['이화여자대학교', '서울 서대문구', '사립'], ['중앙대학교', '서울 동작구', '사립'], ['한양대학교', '서울 성동구', '사립'],
] as const;

function schoolXmlItem(i: number): string {
  const [name, region, est] = SCHOOL_NAMES[i % SCHOOL_NAMES.length]!;
  const suffix = i >= SCHOOL_NAMES.length ? ` 제${Math.floor(i / SCHOOL_NAMES.length) + 1}캠퍼스` : '';
  return `<content>
    <seq>SCH${String(i + 1).padStart(4, '0')}</seq>
    <schoolName>${name}${suffix}</schoolName>
    <region>${region}</region>
    <schoolGubun>univ_list</schoolGubun>
    <estType>${est}</estType>
    <link>https://www.example.ac.kr/${i + 1}</link>
  </content>`;
}

// 실 API(COUNSEL) 재현: 목록 = 질문 코드표 {code, memo, gubun}, 본문은 COUNSEL_VIEW?con_cd=
const COUNSEL_MEMOS = [
  '좋아하는것과 잘하는것이 전혀 없어요', '영상 쪽이 좋은데 성적이 걱정돼요', '부모님과 진로 의견이 달라요',
  '문과인데 개발자가 되고 싶어요', '예체능으로 가도 괜찮을까요', '편입을 생각하고 있어요',
];

function counselListXml(perPage: number): string[] {
  return Array.from({ length: Math.min(40, perPage) }, (_, i) => {
    const letter = 'CD'[i % 2]!;
    return `<content>
    <code>${letter}${i + 1}</code>
    <memo>${COUNSEL_MEMOS[i % COUNSEL_MEMOS.length]} ${i + 1}</memo>
    <totalCount>40</totalCount>
    <gubun>A0${(i % 5) + 1}</gubun>
  </content>`;
  });
}

function counselViewXml(conCd: string): string {
  return `<content>
    <code>${conCd}</code>
    <question>영상 편집을 좋아하는데  부모님은 안정적인 직업을 원하세요.\r\n어떻게 해야 할까요?</question>
    <answer>흥미를 존중하면서 현실 조건을 함께 보는 게 좋아요.&lt;/br&gt;관련 학과의 취업 통계를 찾아보고,&lt;/br&gt;부모님과 데이터로 대화해보세요.</answer>
  </content>`;
}

// 실 API(COSE) 재현: dataTitle/activityType/author/attFile(쉼표 다중)
function coseXmlItem(i: number): string {
  return `<content>
    <seq>${6407416 + i}</seq>
    <dataTitle>진로교육자료 ${i + 1} — 직업 탐색 워크북</dataTitle>
    <activityType>진로수업 및 창의적 체험활동 운영&lt;br&gt;부록 포함</activityType>
    <author>교육부, 한국청소년정책연구원</author>
    <attFile>https://files.example.kr/ws${i + 1}.pdf,https://files.example.kr/guide${i + 1}.pdf</attFile>
  </content>`;
}

function xmlEnvelope(items: string[], total: number): Buffer {
  // count를 의도적으로 string으로 — 실제 API 함정 재현. 인코딩은 EUC-KR.
  const xml = `<?xml version="1.0" encoding="euc-kr"?>
<dataSearch>
  <totalCount>${String(total)}</totalCount>
  ${items.join('\n')}
</dataSearch>`;
  return iconv.encode(xml, 'euc-kr');
}

function send(res: ServerResponse, status: number, body: Buffer | string, contentType: string): void {
  res.writeHead(status, { 'Content-Type': contentType });
  res.end(body);
}

export function createMockCareernet() {
  let requestCount = 0;
  let globalFault = process.env.MOCK_FAULT || '';

  const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    const url = new URL(req.url ?? '/', 'http://localhost');
    // 제어 라우트 (카오스 테스트용 — 카운트 제외)
    if (url.pathname === '/__fault') {
      globalFault = url.searchParams.get('mode') ?? '';
      return send(res, 200, JSON.stringify({ fault: globalFault }), 'application/json');
    }
    if (url.pathname === '/__stats') {
      return send(res, 200, JSON.stringify({ requestCount }), 'application/json');
    }
    requestCount += 1;
    const fault = url.searchParams.get('__fault') || globalFault;

    if (fault === 'timeout') return; // 응답하지 않음 — 클라 타임아웃 유도
    if (fault === 'http500') return send(res, 500, 'internal error', 'text/plain');
    if (fault === 'empty') return send(res, 200, '', 'text/xml;charset=euc-kr');
    if (fault === 'garbled') {
      // XML 선언 없는 비정형 바이트 — 파싱 방어 검증용
      return send(res, 200, Buffer.from([0xff, 0xfe, 0x00, 0x12, 0x34]), 'text/xml');
    }

    const path = url.pathname;

  if (path === '/cnet/front/openapi/jobs.json') {
    const q = url.searchParams.get('searchJobNm') ?? '';
    const filtered = q ? JOBS.filter((j) => j.job_nm.includes(q)) : JOBS;
    return send(res, 200, JSON.stringify({ count: String(filtered.length), pageSize: 20, pageIndex: 1, jobs: filtered }), 'application/json;charset=utf-8');
  }
  if (path === '/cnet/front/openapi/job.json') {
    const seq = Number(url.searchParams.get('seq'));
    const job = JOBS.find((j) => j.seq === seq);
    if (!job) return send(res, 404, JSON.stringify({ error: 'not found' }), 'application/json');
    // 실 API 구조: baseInfo + departList [{depart_id, depart_name}]
    return send(
      res,
      200,
      JSON.stringify({
        baseInfo: job,
        departList: [
          { depart_id: 111, depart_name: '미디어학과' },
          { depart_id: 112, depart_name: ' 디자인학과 ' },
        ],
        forecastList: [],
        workList: [],
      }),
      'application/json;charset=utf-8',
    );
  }
  if (path === '/cnet/front/openapi/juniorjobsinfo.json') {
    // 실 API: top key가 jobs, 필드 junior_seq/job_nm/job_summary/job_thema_cd
    const juniors = JOBS.slice(0, 30).map((j, i) => ({ junior_seq: 10742 + i, job_nm: j.job_nm, job_summary: j.work, job_thema_cd: '112598' }));
    return send(res, 200, JSON.stringify({ count: juniors.length, pageSize: 30, pageIndex: 1, jobs: juniors }), 'application/json;charset=utf-8');
  }
  if (path === '/cnet/front/openapi/juniorjobinfo.json') {
    const seq = Number(url.searchParams.get('seq'));
    const i = seq - 10742;
    const j = JOBS[i];
    if (!j) return send(res, 404, JSON.stringify({ error: 'not found' }), 'application/json');
    return send(res, 200, JSON.stringify({ juniorJobInfo: { junior_seq: seq, job_nm: j.job_nm, job_summary: j.work, job_thema_cd: '112598' } }), 'application/json;charset=utf-8');
  }
  if (path === '/inspct/openapi/v2/tests') {
    // 실 API: apikey(소문자) 요구, 필드 qno/name/description
    if (!url.searchParams.get('apikey') && !url.searchParams.get('apiKey')) {
      return send(res, 500, 'missing apikey', 'text/plain');
    }
    return send(
      res,
      200,
      JSON.stringify({
        result: [
          { qno: 6, name: '직업가치관검사', description: '중·고등학생 대상', exectime: 20, qcount: 145 },
          { qno: 33, name: '직업흥미검사(H)', description: '직업과 관련하여 어떤 흥미가 있는지<br/>알아볼 수 있습니다.', exectime: 20, qcount: 145 },
          { qno: 21, name: '직업적성검사', description: '고등학생 대상', exectime: 30, qcount: 88 },
        ],
      }),
      'application/json;charset=utf-8',
    );
  }
  if (path === '/cnet/openapi/getOpenApi') {
    const svc = url.searchParams.get('svcCode');
    const perPage = Math.min(Number(url.searchParams.get('perPage') || 100), 1000);
    if (svc === 'SCHOOL') {
      const q = url.searchParams.get('searchSchulNm') ?? '';
      const all = Array.from({ length: 60 }, (_, i) => i).filter((i) => !q || SCHOOL_NAMES[i % SCHOOL_NAMES.length]![0].includes(q));
      return send(res, 200, xmlEnvelope(all.slice(0, perPage).map(schoolXmlItem), all.length), 'text/xml;charset=euc-kr');
    }
    if (svc === 'MAJOR') {
      // 실 API: gubun 없으면 빈 dataSearch
      if (!url.searchParams.get('gubun')) {
        return send(res, 200, iconv.encode('<?xml version="1.0" encoding="euc-kr"?><dataSearch></dataSearch>', 'euc-kr'), 'text/xml;charset=euc-kr');
      }
      const q = url.searchParams.get('searchTitle') ?? '';
      const all = Array.from({ length: 45 }, (_, i) => i).filter((i) => !q || (MAJOR_NAMES[i % MAJOR_NAMES.length] ?? '').includes(q));
      return send(res, 200, xmlEnvelope(all.slice(0, perPage).map(majorXmlItem), all.length), 'text/xml;charset=euc-kr');
    }
    if (svc === 'MAJOR_VIEW') {
      const seq = Number(url.searchParams.get('majorSeq') || 10001);
      return send(res, 200, xmlEnvelope([majorXmlItem(seq - 10001)], 1), 'text/xml;charset=euc-kr');
    }
    if (svc === 'COUNSEL') {
      return send(res, 200, xmlEnvelope(counselListXml(perPage), 40), 'text/xml;charset=euc-kr');
    }
    if (svc === 'COUNSEL_VIEW') {
      // 실 API: gubun 없으면 에러 코드 응답
      if (!url.searchParams.get('gubun')) {
        return send(res, 200, iconv.encode('<?xml version="1.0" encoding="euc-kr"?><result><content><code>-5</code><message>gubun이 없습니다.</message></content></result>', 'euc-kr'), 'text/xml;charset=euc-kr');
      }
      const conCd = url.searchParams.get('con_cd') ?? 'C1';
      return send(res, 200, xmlEnvelope([counselViewXml(conCd)], 1), 'text/xml;charset=euc-kr');
    }
    if (svc === 'COSE') {
      // 단일 항목 케이스 — "배열이어야 할 게 단일 객체" 함정 재현
      return send(res, 200, xmlEnvelope([coseXmlItem(0)], 1), 'text/xml;charset=euc-kr');
    }
    return send(res, 400, 'unknown svcCode', 'text/plain');
  }
  // ─── 대학알리미(data.go.kr) mock — ALIMI_BASE_URL을 이 서버로 돌려 테스트 (UTF-8 XML) ───
  if (path === '/getComparisonPubYear') {
    return send(res, 200, '<?xml version="1.0" encoding="UTF-8"?><response><header><resultCode>00</resultCode><resultMsg>NORMAL SERVICE.</resultMsg></header><body><items><item><yearVal>2025</yearVal></item></items><totalCount>1</totalCount></body></response>', 'application/xml;charset=UTF-8');
  }
  if (path === '/getComparisonUniversitySearchList') {
    if (!url.searchParams.get('svyYr')) {
      return send(res, 200, '<?xml version="1.0" encoding="UTF-8"?><response><header><resultCode>00</resultCode><resultMsg>NORMAL SERVICE.</resultMsg></header><body><items/><totalCount>0</totalCount></body></response>', 'application/xml;charset=UTF-8');
    }
    const items = SCHOOL_NAMES.map(([name, , est], i) => `<item><clgcpDivCd></clgcpDivCd><clgcpDivNm>본교</clgcpDivNm><estbDivCd>3</estbDivCd><estbDivNm>${est.replace(/\(.+\)/, '')}</estbDivNm><schlDivCd>02</schlDivCd><schlDivNm>대학</schlDivNm><schlFullNm>${name} _ 본교</schlFullNm><schlId>${String(i + 1).padStart(7, '0')}</schlId><schlKndCd>03</schlKndCd><schlKndNm>대학교</schlKndNm><schlKrnNm>${name}</schlKrnNm><svyYr>2025</svyYr><znCd>11</znCd><znNm>서울</znNm></item>`).join('');
    return send(res, 200, `<?xml version="1.0" encoding="UTF-8"?><response><header><resultCode>00</resultCode><resultMsg>NORMAL SERVICE.</resultMsg></header><body><items>${items}</items><numOfRows>1000</numOfRows><pageNo>1</pageNo><totalCount>${SCHOOL_NAMES.length}</totalCount></body></response>`, 'application/xml;charset=UTF-8');
  }

  send(res, 404, 'not found', 'text/plain');
  });

  return {
    server,
    setFault(mode: string) {
      globalFault = mode;
    },
    get requestCount() {
      return requestCount;
    },
    listen(port: number): Promise<number> {
      return new Promise((resolve) => {
        server.listen(port, () => {
          const addr = server.address();
          resolve(typeof addr === 'object' && addr ? addr.port : port);
        });
      });
    },
    close(): Promise<void> {
      return new Promise((resolve) => server.close(() => resolve()));
    },
  };
}

if (require.main === module) {
  void createMockCareernet().listen(PORT).then((p) => console.log(`mock-careernet listening on :${p}`));
}
