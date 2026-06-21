// build-legacy.mjs — legacy/*.jsx 를 빌드 타임에 .js 로 사전컴파일하고,
// in-browser Babel(@babel/standalone) 의존을 제거한 index.html 을 생성한다.
// 구조는 그대로(분리된 classic script, 전역 스코프) 유지 → 동작 동일, 런타임 Babel만 제거.
//
// 소스(진실): public/legacy/*.jsx + public/legacy/index.src.html (babel 템플릿)
// 산출물: public/legacy/<name>.js (+ _mount.js) + public/legacy/index.html (precompiled)
//
// 실행: node build-legacy.mjs   (package.json "build"가 vite build 전에 호출)

import { transform } from 'esbuild';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const LEG = join(process.cwd(), 'public', 'legacy');
const srcHtmlPath = join(LEG, 'index.src.html');
const outHtmlPath = join(LEG, 'index.html');

if (!existsSync(srcHtmlPath)) {
  console.error('[build-legacy] index.src.html 없음 — 먼저 babel index.html을 index.src.html로 백업하세요.');
  process.exit(1);
}
const srcHtml = readFileSync(srcHtmlPath, 'utf8');

const opts = { loader: 'jsx', jsx: 'transform', target: 'es2019', format: 'iife', minify: false };
// format:'iife' 는 export 없는 코드엔 영향 없음. transform은 번들 안 함(파일 독립). 단, iife 래핑은
// 전역 함수 공유를 깨므로 사용하지 않는다 → 아래에서 format 미지정(기본 esm아님, 그대로 transform).

async function compileFile(jsxName) {
  const code = readFileSync(join(LEG, jsxName), 'utf8');
  const res = await transform(code, { loader: 'jsx', jsx: 'transform', target: 'es2019' });
  const outName = jsxName.replace(/\.jsx$/, '.js');
  writeFileSync(join(LEG, outName), res.code, 'utf8');
  return outName;
}

async function main() {
  // 1) <script type="text/babel" src="X.jsx"></script> 순서대로 추출
  const fileRe = /<script[^>]*type=["']text\/babel["'][^>]*src=["']([^"']+\.jsx)["'][^>]*>\s*<\/script>/g;
  const files = [];
  let m;
  while ((m = fileRe.exec(srcHtml))) files.push(m[1]);
  if (!files.length) { console.error('[build-legacy] babel script 태그를 못 찾음'); process.exit(1); }

  // 2) 각 파일 컴파일
  for (const f of files) await compileFile(f);

  // 3) 인라인 mount 스크립트 추출·컴파일
  const inlineRe = /<script[^>]*type=["']text\/babel["'][^>]*>([\s\S]*?)<\/script>/g; // src 없는 것
  let mountCode = null;
  let mm;
  while ((mm = inlineRe.exec(srcHtml))) {
    const tag = mm[0];
    if (!/src=/.test(tag)) { mountCode = mm[1]; break; }
  }
  if (mountCode) {
    const res = await transform(mountCode, { loader: 'jsx', jsx: 'transform', target: 'es2019' });
    writeFileSync(join(LEG, '_mount.js'), res.code, 'utf8');
  }

  // 4) index.html 생성: babel 제거 + .jsx→.js + 인라인→_mount.js
  let out = srcHtml;
  // @babel/standalone 스크립트 줄 제거
  out = out.replace(/\s*<script[^>]*@babel\/standalone[^>]*><\/script>/g, '');
  // 파일 스크립트: type=text/babel src=X.jsx → src=X.js
  out = out.replace(fileRe, (full, src) => `<script src="${src.replace(/\.jsx$/, '.js')}"></script>`);
  // 인라인 mount → _mount.js
  out = out.replace(/<script[^>]*type=["']text\/babel["'][^>]*>[\s\S]*?<\/script>/g, (tag) =>
    /src=/.test(tag) ? tag : '<script src="_mount.js"></script>');
  // 주석: 사전컴파일됨 표시
  out = out.replace('<head>', '<head>\n<!-- ⚙️ 이 파일은 build-legacy.mjs가 생성합니다. 수정은 index.src.html / *.jsx 에서. -->');

  writeFileSync(outHtmlPath, out, 'utf8');
  console.log(`[build-legacy] ✅ ${files.length}개 .jsx 컴파일 + index.html 생성 (in-browser Babel 제거)`);
}

main().catch((e) => { console.error('[build-legacy] 실패:', e); process.exit(1); });
