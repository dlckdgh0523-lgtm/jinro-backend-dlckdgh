import { describe, expect, it } from 'vitest';
import {
  counselCodeToSeq,
  normalizeCounselCases,
  normalizeCounselDetail,
  normalizeEduMaterials,
  normalizeJobDetail,
  normalizeJobsList,
  normalizeJuniorJobsList,
  normalizeMajors,
  normalizeSchools,
  normalizeTests,
} from '../../src/career/normalize';

describe('normalize — XML/JSON → 단일 내부 타입', () => {
  it('직업백과: count string·"null" salary·쉼표 학과 처리', () => {
    const raw = {
      count: '2',
      jobs: [
        { seq: 1, job: '가수', summary: '노래<br>부르기', salary: 'null', relatedMajors: '실용음악과, 성악과' },
        { seq: '2', job: '  배우 ', summary: null, salary: '3,000만원', relatedMajors: null },
      ],
    };
    const page = normalizeJobsList(raw);
    expect(page.total).toBe(2);
    expect(page.items).toHaveLength(2);
    expect(page.items[0]).toMatchObject({ seq: 1, name: '가수', summary: '노래 부르기', salary: null, relatedMajors: ['실용음악과', '성악과'] });
    expect(page.items[1]).toMatchObject({ seq: 2, name: '배우', relatedMajors: [] });
  });

  it('직업백과: seq/name 누락 레코드는 skip (전체 실패 아님)', () => {
    const page = normalizeJobsList({ jobs: [{ job: '이름만' }, { seq: 3, job: '정상' }] });
    expect(page.items).toHaveLength(1);
    expect(page.items[0]!.name).toBe('정상');
  });

  it('직업백과: jobs가 단일 객체로 와도 배열 정규화', () => {
    const page = normalizeJobsList({ jobs: { seq: 9, job: '단일' } });
    expect(page.items).toHaveLength(1);
  });

  it('학과 XML: content 단일 객체 + department 쉼표 나열 + "null"', () => {
    const single = { dataSearch: { totalCount: '1', content: { majorSeq: '5', major: '영상디자인학과', department: 'A대학, B대학 ,C대학' } } };
    const page = normalizeMajors(single);
    expect(page.total).toBe(1);
    expect(page.items[0]).toMatchObject({ majorSeq: 5, name: '영상디자인학과', departments: ['A대학', 'B대학', 'C대학'] });

    const nullDept = normalizeMajors({ dataSearch: { content: [{ majorSeq: 1, major: 'X학과', department: 'null' }] } });
    expect(nullDept.items[0]!.departments).toEqual([]);
  });

  it('상담사례 XML: &lt;/br&gt; 잔재 제거', () => {
    const raw = { dataSearch: { content: [{ seq: '1', title: '고민', answer: '첫째&lt;/br&gt;둘째&lt;/br&gt;셋째' }] } };
    const page = normalizeCounselCases(raw);
    expect(page.items[0]!.answer).toBe('첫째 둘째 셋째');
  });

  it('학교 XML: 필드 누락 허용', () => {
    const page = normalizeSchools({ dataSearch: { content: [{ seq: 'S1', schoolName: '서울대학교' }] } });
    expect(page.items[0]).toMatchObject({ seq: 'S1', name: '서울대학교', region: null, link: null });
  });

  it('교육자료 XML: attFile 쉼표 다중 URL', () => {
    const page = normalizeEduMaterials({ dataSearch: { content: [{ seq: 1, title: '워크북', attFile: 'http://a.pdf,http://b.pdf' }] } });
    expect(page.items[0]!.attFiles).toEqual(['http://a.pdf', 'http://b.pdf']);
  });

  it('완전 비정형 입력은 빈 결과 (크래시 없음)', () => {
    expect(normalizeJobsList(null).items).toEqual([]);
    expect(normalizeJobsList('garbage').items).toEqual([]);
    expect(normalizeMajors(12345).items).toEqual([]);
    expect(normalizeSchools(undefined).items).toEqual([]);
    expect(normalizeTests([])).toEqual([]);
  });

  it('실 API 형태(2026-06 검증) — jobs.json 필드 매핑', () => {
    const real = {
      count: '552',
      jobs: [
        {
          seq: 5, job_cd: 5, job_nm: '일기예보관', work: '일기예보와 기상 전망을 발표합니다.',
          aptit_name: '이학 전문직', wage: '4,662',
          wage_source: '평균연봉(중앙값)은 4,662만원입니다. (자료: 워크넷, 2021)',
          satisfi_source: '직업만족도는 70.9%입니다. (자료: 워크넷, 2021)',
          rel_job_nm: '기상관측요원', top_nm: '연구직',
        },
      ],
    };
    const page = normalizeJobsList(real);
    expect(page.total).toBe(552);
    const job = page.items[0]!;
    expect(job).toMatchObject({ seq: 5, name: '일기예보관', aptitude: '이학 전문직', theme: '연구직' });
    expect(job.salary).toContain('워크넷'); // 출처·시점 포함 문장 우선 (prompt.md 근거 인용 요구)
    expect(job.relatedMajors).toEqual([]); // rel_job_nm(유사직업)은 학과로 오인하지 않는다
  });

  it('실 API 형태 — job.json 상세 departList → relatedMajors', () => {
    const detail = normalizeJobDetail({
      baseInfo: { seq: 5, job_nm: '일기예보관', wage_source: '4,662만원 (워크넷 2021)' },
      departList: [{ depart_id: 111, depart_name: '대기과학과' }, { depart_id: 541, depart_name: ' 천문학과 ' }],
    });
    expect(detail!.relatedMajors).toEqual(['대기과학과', '천문학과']);
  });

  it('실 API 형태 — juniorjobsinfo.json (top key jobs, junior_seq/job_nm)', () => {
    const page = normalizeJuniorJobsList({
      count: 300, jobs: [{ junior_seq: 10742, job_nm: '국회의원', job_summary: '새로운 법을 만들거나 고쳐요.', job_thema_cd: '112598' }],
    });
    expect(page.items[0]).toMatchObject({ seq: 10742, name: '국회의원', summary: '새로운 법을 만들거나 고쳐요.' });
  });

  it('실 API 형태 — MAJOR(mClass/lClass) + COUNSEL 코드표/상세', () => {
    const majors = normalizeMajors({ dataSearch: { content: [{ lClass: '교육계열', facilName: '가정교육과', majorSeq: '10006', mClass: '가정교육과', totalCount: '501' }] } });
    expect(majors.items[0]).toMatchObject({ majorSeq: 10006, name: '가정교육과', field: '교육계열' });

    const list = normalizeCounselCases({ dataSearch: { content: [{ code: 'C82', memo: '편입을 생각하고 있어요.', totalCount: '188', gubun: 'E0405' }] } });
    expect(list.items[0]).toMatchObject({ seq: counselCodeToSeq('C82'), title: '편입을 생각하고 있어요.' });
    expect(counselCodeToSeq('C82')).not.toBe(counselCodeToSeq('D82')); // 문자 접두 충돌 없음

    const detail = normalizeCounselDetail({ dataSearch: { content: { code: 'C82', question: '편입 어떻게 하나요?', answer: '첫째&lt;/br&gt;둘째' } } });
    expect(detail).toEqual({ question: '편입 어떻게 하나요?', answer: '첫째 둘째' });
  });

  it('실 API 형태 — COSE(dataTitle) / tests(qno)', () => {
    const cose = normalizeEduMaterials({ dataSearch: { content: [{ seq: '6407416', dataTitle: '우수사례집', activityType: '진로수업', attFile: 'http://a.pdf,http://b.pdf' }] } });
    expect(cose.items[0]).toMatchObject({ seq: 6407416, title: '우수사례집', attFiles: ['http://a.pdf', 'http://b.pdf'] });

    const tests = normalizeTests({ result: [{ qno: 33, name: '직업흥미검사(H)', description: 'x', exectime: 20, qcount: 145 }] });
    expect(tests[0]).toMatchObject({ no: 33, name: '직업흥미검사(H)' });
  });

  it('심리검사 v2 목록', () => {
    const tests = normalizeTests({ result: [{ q: '33', name: '직업흥미검사(H)', trgetNm: '중·고등학생' }] });
    expect(tests[0]).toEqual({ no: 33, name: '직업흥미검사(H)', target: '중·고등학생' });
  });
});
