/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export async function exportDomToPdf(
  element: HTMLElement,
  filename: string = 'Kaushal_Kumar_Resume.pdf',
  isDarkTheme: boolean = true
): Promise<void> {
  const bgColor = isDarkTheme ? '#0f172a' : '#ffffff';

  const canvas = await html2canvas(element, {
    scale: 2, // 2x high resolution rendering
    useCORS: true,
    logging: false,
    backgroundColor: bgColor,
    windowWidth: 1024,
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.98);
  const pdf = new jsPDF({
    unit: 'pt',
    format: 'a4',
    orientation: 'portrait',
  });

  const pageWidth = pdf.internal.pageSize.getWidth(); // 595.28 pt
  const pageHeight = pdf.internal.pageSize.getHeight(); // 841.89 pt
  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  // First page
  pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
  heightLeft -= pageHeight;

  // Subsequent pages if content overflows A4 height
  while (heightLeft > 5) {
    position = position - pageHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;
  }

  pdf.save(filename);
}

export function downloadStandaloneHtml(element: HTMLElement, filename: string = 'Kaushal_Kumar_Resume.html'): void {
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kaushal Kumar - Resume</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; }
    @media print {
      body { background: white !important; color: black !important; padding: 0 !important; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen p-4 sm:p-8 flex flex-col items-center">
  <div class="max-w-4xl w-full">
    ${element.outerHTML}
  </div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
