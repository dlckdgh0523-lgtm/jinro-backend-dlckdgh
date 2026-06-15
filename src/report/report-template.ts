// AI 진로 리포트 PDF용 HTML 템플릿.
// - 한글 폰트: vendor Pretendard를 base64 @font-face로 임베드 (시스템 폰트 의존 금지)
// - 차트: 외부 JS 없는 인라인 SVG 바 차트
// - 렌더 완료 시그널: document.fonts.ready 후 window.__chartReady = true

export interface ReportContent {
  student?: string;
  generated?: string;
  turns?: number;
  headline?: string;
  summary?: string;
  careers?: { title: string; score: number; why: string }[];
  majors?: string[];
  signals?: { tag: string; text: string }[];
  strengths?: string[];
  risks?: string[];
  nextActions?: string[];
  disclaimer?: string;
}

function esc(s: unknown): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function chartSvg(careers: { title: string; score: number }[]): string {
  const rows = careers.slice(0, 5);
  if (!rows.length) return '';
  const barH = 28;
  const gap = 14;
  const width = 640;
  const labelW = 200;
  const height = rows.length * (barH + gap);
  const bars = rows
    .map((c, i) => {
      const y = i * (barH + gap);
      const w = Math.max(4, Math.min(100, c.score)) * ((width - labelW - 60) / 100);
      return `
      <text x="0" y="${y + barH / 2 + 5}" font-size="14" fill="#191F28">${esc(c.title).slice(0, 18)}</text>
      <rect x="${labelW}" y="${y}" width="${width - labelW - 60}" height="${barH}" rx="8" fill="#F2F4F6"/>
      <rect x="${labelW}" y="${y}" width="${w}" height="${barH}" rx="8" fill="#3182F6"/>
      <text x="${labelW + w + 8}" y="${y + barH / 2 + 5}" font-size="13" font-weight="700" fill="#3182F6">${Math.round(c.score)}</text>`;
    })
    .join('');
  return `<svg id="careers-chart" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">${bars}</svg>`;
}

function list(items: string[] | undefined, cls: string): string {
  if (!items?.length) return '<p class="muted">아직 단서가 부족해요.</p>';
  return `<ul class="${cls}">${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
}

export function renderReportHtml(content: ReportContent, fontBase64: string): string {
  const careers = content.careers ?? [];
  const signals = content.signals ?? [];
  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8"/>
<style>
  @font-face {
    font-family: 'Pretendard';
    src: url(data:font/woff2;base64,${fontBase64}) format('woff2');
    font-weight: 45 920;
    font-display: block;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Pretendard', sans-serif; color: #191F28; padding: 40px 48px; font-size: 14px; line-height: 1.6; }
  .brand { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
  .brand-badge { width: 26px; height: 26px; border-radius: 7px; background: #3182F6; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px; }
  .brand-name { font-weight: 800; font-size: 15px; }
  h1 { font-size: 24px; letter-spacing: -0.5px; margin: 14px 0 4px; }
  .meta { color: #6B7684; font-size: 12px; margin-bottom: 24px; }
  .card { border: 1px solid #E5E8EB; border-radius: 14px; padding: 18px 20px; margin-bottom: 16px; page-break-inside: avoid; }
  .card h2 { font-size: 15px; margin-bottom: 10px; color: #3182F6; }
  .summary { font-size: 15px; }
  .signals { display: flex; flex-wrap: wrap; gap: 8px; }
  .chip { background: #F2F4F6; border-radius: 999px; padding: 4px 12px; font-size: 12px; font-weight: 600; }
  .chip b { color: #3182F6; margin-right: 4px; }
  ul { padding-left: 18px; }
  li { margin-bottom: 4px; }
  .why { color: #6B7684; font-size: 12px; }
  .muted { color: #8B95A1; font-size: 13px; }
  .disclaimer { background: #FFF7E6; border: 1px solid #FFE0A3; border-radius: 12px; padding: 14px 16px; font-size: 12px; color: #8B6914; margin-top: 8px; }
</style>
</head>
<body>
  <div class="brand"><div class="brand-badge">진</div><div class="brand-name">진로나침반 · AI 진로 리포트</div></div>
  <h1>${esc(content.headline ?? '진로 탐색 리포트')}</h1>
  <div class="meta">${esc(content.student ?? '')} · 생성 ${esc(content.generated ?? '')} · 대화 ${content.turns ?? 0}회 · 잠정 가설</div>

  <div class="card"><h2>요약</h2><p class="summary">${esc(content.summary ?? '')}</p></div>

  <div class="card"><h2>추천 직업 적합도</h2>
    ${chartSvg(careers)}
    <ul style="margin-top:12px">
      ${careers.map((c) => `<li><b>${esc(c.title)}</b> <span class="why">— ${esc(c.why)}</span></li>`).join('')}
    </ul>
  </div>

  <div class="card"><h2>발견한 단서</h2>
    <div class="signals">${signals.map((s) => `<span class="chip"><b>${esc(s.tag)}</b>${esc(s.text).slice(0, 40)}</span>`).join('')}</div>
  </div>

  <div class="card"><h2>추천 학과</h2>${list(content.majors, 'majors')}</div>
  <div class="card"><h2>강점</h2>${list(content.strengths, 'strengths')}</div>
  <div class="card"><h2>유의할 점</h2>${list(content.risks, 'risks')}</div>
  <div class="card"><h2>다음에 해볼 것</h2>${list(content.nextActions, 'next')}</div>

  <div class="disclaimer">${esc(content.disclaimer ?? '')}</div>

  <script>
    // 차트(SVG)는 동기 렌더 — 폰트 로딩 완료가 렌더 완료 시그널
    document.fonts.ready.then(function () { window.__chartReady = true; });
    setTimeout(function () { window.__chartReady = true; }, 5000); // 폰트 이벤트 유실 대비 안전망
  </script>
</body>
</html>`;
}
