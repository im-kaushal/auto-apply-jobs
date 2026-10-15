/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { jsPDF } from 'jspdf';
import { resumeData } from '../assets/resumeData';

export function generateResumePdf(): void {
  const doc = new jsPDF({
    unit: 'pt',
    format: 'a4', // 595.28 x 841.89 pt
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  let y = 45;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 40) {
      doc.addPage();
      y = 45;
    }
  };

  // Helper for section header
  const drawSectionHeader = (title: string) => {
    checkPageBreak(30);
    y += 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(30, 41, 59); // slate-800
    doc.text(title.toUpperCase(), margin, y);
    y += 4;
    doc.setDrawColor(203, 213, 225); // slate-300
    doc.setLineWidth(0.75);
    doc.line(margin, y, pageWidth - margin, y);
    y += 12;
  };

  // --- HEADER ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(resumeData.name, pageWidth / 2, y, { align: 'center' });
  y += 16;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105); // slate-600
  const contactLine = `${resumeData.contact.location}  |  ${resumeData.contact.phone}  |  ${resumeData.contact.email}`;
  doc.text(contactLine, pageWidth / 2, y, { align: 'center' });
  y += 13;

  doc.setTextColor(37, 99, 235); // blue-600
  const linksLine = `linkedin.com/in/im-kaushal   |   github.com/im-kaushal   |   kausal.in`;
  doc.text(linksLine, pageWidth / 2, y, { align: 'center' });
  y += 10;

  // --- PROFESSIONAL SUMMARY ---
  drawSectionHeader('Professional Summary');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  const summaryLines = doc.splitTextToSize(resumeData.summary, contentWidth);
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 11 + 4;

  // --- TECHNICAL SKILLS ---
  drawSectionHeader('Technical Skills');
  const skillsList = [
    { label: 'Frontend & Mobile:', val: resumeData.technical_skills.frontend_and_mobile.join(', ') },
    { label: 'State & Data Management:', val: resumeData.technical_skills.state_and_data_management.join(', ') },
    { label: 'Testing & Tools:', val: resumeData.technical_skills.testing_and_tools.join(', ') },
    { label: 'Cloud, DevOps & Storage:', val: resumeData.technical_skills.cloud_devops_and_storage.join(', ') },
  ];

  skillsList.forEach((s) => {
    checkPageBreak(20);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(s.label, margin, y);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    const labelWidth = doc.getTextWidth(s.label) + 6;
    const valLines = doc.splitTextToSize(s.val, contentWidth - labelWidth);
    doc.text(valLines, margin + labelWidth, y);
    y += valLines.length * 11 + 2;
  });

  // --- PROFESSIONAL EXPERIENCE ---
  drawSectionHeader('Professional Experience');
  resumeData.experience.forEach((exp) => {
    checkPageBreak(40);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(exp.role, margin, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    const roleWidth = doc.getTextWidth(exp.role) + 4;
    doc.text(`–  ${exp.company}`, margin + roleWidth, y);

    doc.text(exp.period, pageWidth - margin, y, { align: 'right' });
    y += 12;

    exp.highlights.forEach((h) => {
      checkPageBreak(25);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);
      doc.text('•', margin + 6, y);
      const bulletLines = doc.splitTextToSize(h, contentWidth - 18);
      doc.text(bulletLines, margin + 16, y);
      y += bulletLines.length * 10.5 + 2;
    });
    y += 4;
  });

  // --- KEY PROJECTS ---
  drawSectionHeader('Key Projects');
  resumeData.projects.forEach((proj) => {
    checkPageBreak(40);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(proj.name, margin, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(proj.period, pageWidth - margin, y, { align: 'right' });
    y += 11;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text('Tech Stack: ', margin, y);
    const stackPrefixWidth = doc.getTextWidth('Tech Stack: ');

    doc.setFont('helvetica', 'italic');
    doc.setTextColor(71, 85, 105);
    const stackLines = doc.splitTextToSize(proj.stack, contentWidth - stackPrefixWidth);
    doc.text(stackLines, margin + stackPrefixWidth, y);
    y += stackLines.length * 10 + 3;

    proj.highlights.forEach((h) => {
      checkPageBreak(25);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);
      doc.text('•', margin + 6, y);
      const bulletLines = doc.splitTextToSize(h, contentWidth - 18);
      doc.text(bulletLines, margin + 16, y);
      y += bulletLines.length * 10.5 + 2;
    });
    y += 4;
  });

  // --- CERTIFICATIONS ---
  drawSectionHeader('Certifications');
  resumeData.certifications.forEach((c) => {
    checkPageBreak(16);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(c.name, margin, y);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const nameWidth = doc.getTextWidth(c.name) + 4;
    doc.text(`–  ${c.issuer}`, margin + nameWidth, y);

    doc.text(c.date, pageWidth - margin, y, { align: 'right' });
    y += 12;
  });

  // --- AWARDS ---
  drawSectionHeader('Awards');
  resumeData.awards.forEach((a) => {
    checkPageBreak(24);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`•  ${a.title} (${a.org}, ${a.date}):`, margin, y);

    const titleWidth = doc.getTextWidth(`•  ${a.title} (${a.org}, ${a.date}): `);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);

    const descLines = doc.splitTextToSize(a.description, contentWidth - titleWidth);
    if (titleWidth < contentWidth * 0.6) {
      doc.text(descLines, margin + titleWidth, y);
      y += descLines.length * 10.5 + 3;
    } else {
      y += 11;
      const fullDescLines = doc.splitTextToSize(a.description, contentWidth - 12);
      doc.text(fullDescLines, margin + 12, y);
      y += fullDescLines.length * 10.5 + 3;
    }
  });

  // --- EDUCATION ---
  drawSectionHeader('Education');
  checkPageBreak(24);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`${resumeData.education.degree} (CGPA: ${resumeData.education.cgpa})`, margin, y);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(resumeData.education.period, pageWidth - margin, y, { align: 'right' });
  y += 11;
  doc.text(resumeData.education.institution, margin, y);

  // Save the PDF
  doc.save('Kaushal_Kumar_Resume.pdf');
}
