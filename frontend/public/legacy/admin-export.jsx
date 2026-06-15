// admin-export.jsx — real report export (print-to-PDF) + shared admin action helpers.
// No external libs: builds a styled HTML report into a hidden iframe and calls
// print(), so the user's browser "Save as PDF" produces a real PDF. Korean text
// renders via system fonts. Falls back to an HTML file download if printing is blocked.

function exportReportPDF(title, headers, rows, meta = {}) {
  // Build an offscreen styled report node, rasterize with html2canvas, save a real
  // .pdf via jsPDF (Korean renders via system fonts). Falls back to print, then HTML.
  const now = new Date();
  const stamp = `${now.getFullYear()}. ${String(now.getMonth()+1).padStart(2,'0')}. ${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  const esc = (s) => String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');
  const metaRows = Object.entries(meta).map(([k,v]) => `<span style="margin-right:14px"><b style="color:#333D4B">${esc(k)}</b> ${esc(v)}</span>`).join('') + `<span><b style="color:#333D4B">행 수</b> ${rows.length}건</span>`;
  const thead = headers.map(h => `<th style="text-align:left;background:#F2F4F6;color:#6B7684;font-weight:700;padding:9px 10px;border-bottom:1px solid #E5E8EB;font-size:11px">${esc(h)}</th>`).join('');
  const tbody = rows.map((r, ri) => `<tr style="background:${ri%2?'#FAFBFC':'#fff'}">${r.map(c => `<td style="padding:9px 10px;border-bottom:1px solid #EEF0F2;color:#333D4B;font-size:12px;vertical-align:top">${esc(c)}</td>`).join('')}</tr>`).join('');
  const reportHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:2px solid #3182F6;padding-bottom:14px;margin-bottom:8px">
      <div style="display:flex;align-items:center;gap:8px;font-size:18px;font-weight:800;color:#191F28"><span style="width:26px;height:26px;border-radius:7px;background:#3182F6;color:#fff;display:flex;align-items:center;justify-content:center;font-size:15px">진</span> 진로나침반 · 리포트</div>
      <div style="font-size:12px;color:#6B7684">생성: ${stamp}</div>
    </div>
    <h1 style="font-size:20px;margin:18px 0 6px;color:#191F28">${esc(title)}</h1>
    <div style="display:flex;flex-wrap:wrap;gap:6px;font-size:12px;color:#6B7684;margin-bottom:18px">${metaRows}</div>
    <table style="width:100%;border-collapse:collapse"><thead><tr>${thead}</tr></thead><tbody>${tbody}</tbody></table>
    <div style="margin-top:22px;font-size:11px;color:#8B95A1;border-top:1px solid #E5E8EB;padding-top:12px">본 문서는 진로나침반에서 생성된 리포트입니다. 개인정보가 포함될 수 있으니 취급에 유의하세요.</div>`;
  const fileName = `${title.replace(/[^\w가-힣]+/g, '_')}.pdf`;

  const jsPDFCtor = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
  if (window.html2canvas && jsPDFCtor) {
    if (window.showToast) showToast('PDF를 만들고 있어요...', 'info');
    const holder = document.createElement('div');
    holder.style.cssText = 'position:fixed;left:-9999px;top:0;width:794px;background:#fff;padding:40px;font-family:Pretendard,-apple-system,"Apple SD Gothic Neo","Malgun Gothic",sans-serif;';
    holder.innerHTML = reportHTML;
    document.body.appendChild(holder);
    window.html2canvas(holder, { scale: 2, backgroundColor: '#ffffff', useCORS: true }).then(canvas => {
      try {
        const pdf = new jsPDFCtor({ orientation: 'p', unit: 'pt', format: 'a4' });
        const pw = pdf.internal.pageSize.getWidth();
        const ph = pdf.internal.pageSize.getHeight();
        const imgW = pw - 48;
        const imgH = canvas.height * (imgW / canvas.width);
        const img = canvas.toDataURL('image/png');
        let remaining = imgH, pos = 24;
        if (imgH <= ph - 48) {
          pdf.addImage(img, 'PNG', 24, pos, imgW, imgH);
        } else {
          // paginate
          let sY = 0;
          const pageImgH = ph - 48;
          const ratio = canvas.width / imgW;
          while (sY < canvas.height) {
            const sliceH = Math.min(canvas.height - sY, pageImgH * ratio);
            const pageCanvas = document.createElement('canvas');
            pageCanvas.width = canvas.width; pageCanvas.height = sliceH;
            pageCanvas.getContext('2d').drawImage(canvas, 0, sY, canvas.width, sliceH, 0, 0, canvas.width, sliceH);
            pdf.addImage(pageCanvas.toDataURL('image/png'), 'PNG', 24, 24, imgW, sliceH / ratio);
            sY += sliceH;
            if (sY < canvas.height) pdf.addPage();
          }
        }
        pdf.save(fileName);
        if (window.showToast) showToast('PDF를 저장했어요', 'success');
      } catch (e) { printFallback(title, reportHTML); }
      finally { holder.remove(); }
    }).catch(() => { holder.remove(); printFallback(title, reportHTML); });
    return;
  }
  printFallback(title, reportHTML);
}

function printFallback(title, reportHTML) {
  const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>${title}</title>
<style>body{font-family:'Pretendard',-apple-system,'Malgun Gothic',sans-serif;margin:40px}@media print{body{margin:16mm}@page{size:A4}}</style></head><body>${reportHTML}</body></html>`;
  try {
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;opacity:0;';
    document.body.appendChild(iframe);
    const doc = iframe.contentWindow.document;
    doc.open(); doc.write(html); doc.close();
    setTimeout(() => {
      try { iframe.contentWindow.focus(); iframe.contentWindow.print(); if (window.showToast) showToast('인쇄 창에서 "PDF로 저장"을 선택하세요', 'info'); }
      catch (e) { downloadHTMLReport(title, html); }
      setTimeout(() => { try { iframe.remove(); } catch (e) {} }, 2000);
    }, 350);
  } catch (e) { downloadHTMLReport(title, html); }
}

function downloadHTMLReport(title, html) {
  try {
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${title.replace(/[^\w가-힣]+/g, '_')}.html`;
    document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    if (window.showToast) showToast('리포트를 내려받았어요 (열어서 PDF로 인쇄 가능)', 'success');
  } catch (e) {
    if (window.showToast) showToast('내보내기에 실패했어요', 'danger');
  }
}

function downloadCSV(filename, headers, rows) {
  try {
    const esc = (c) => { const s = String(c == null ? '' : c); return /[",\n]/.test(s) ? `"${s.replace(/"/g,'""')}"` : s; };
    const csv = '\uFEFF' + [headers.map(esc).join(','), ...rows.map(r => r.map(esc).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${filename.replace(/[^\w가-힣]+/g, '_')}.csv`;
    document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    if (window.showToast) showToast('CSV 파일을 내려받았어요', 'success');
  } catch (e) { if (window.showToast) showToast('내보내기에 실패했어요', 'danger'); }
}

Object.assign(window, { exportReportPDF, printFallback, downloadHTMLReport, downloadCSV });
