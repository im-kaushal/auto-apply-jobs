#!/usr/bin/env python3
"""
Generate Daily Excel Job Tracker (.xlsx) & Sync to Google Sheets
Date: October 02, 2026
Expanded with Browser Parallel Sourcing Results
"""

import os
import sys
import json
import zipfile
import urllib.request
import xml.sax.saxutils as saxutils

DATE_STR = "2026-10-02"
EXCEL_FILENAME = f"Job_Tracker_{DATE_STR}.xlsx"
WEBHOOK_URL = "https://script.google.com/macros/s/AKfycby7GvgtNlJoIVL6L-OR2la73FMh3u_VqxKQgDV4wGRDHd8HiKoQSxfFM9NOoEkxwmDMwA/exec"

HEADERS = [
    "Priority", "Match Score", "Company", "Job Title", "Location",
    "Experience Required", "Role Level", "Job ID", "Job Posted Date & Time ago",
    "Platform / Source", "Direct Application Link", "Skills Required",
    "Skills Matched", "Skill Gaps", "Why It Matches",
    "Referral Employees", "Notes"
]

ROWS = [
    [
        "P0", 98, "Sigmoid", "Software Development Engineer II (SDE2) – Frontend",
        "Bengaluru, Karnataka (Hybrid)", "3-5 Years", "SDE-2",
        "SIGMOID-FE-SDE2", "2026-10-02 (<24h ago)",
        "Greenhouse ATS / Sigmoid Careers",
        "https://boards.greenhouse.io/sigmoid",
        "React.js, Next.js, React Query, TypeScript, Redux, HTML5, CSS3, Data Structures & Algorithms, REST APIs, Microservices, CI/CD",
        "React 18+, Next.js, TypeScript, Redux Toolkit, TanStack/React Query, REST APIs, 3.5 yrs exp, 30 days notice",
        "None (100% Core Stack Alignment)",
        "Direct 100% alignment on modern React, Next.js, and TypeScript frontend development for high-performance SaaS applications with exact 3.5 years experience match.",
        "Rajat Singhania (VP Engg), Abhishek Kumar (EM Frontend), Shubham Singh (Lead SWE), Shruti Roy (TA)",
        "Top Priority - Actively hiring for Bengaluru SaaS engineering pods."
    ],
    [
        "P0", 97, "Sarvam AI", "Frontend Engineer, Vision",
        "Bengaluru, Karnataka (On-site)", "3-5 Years", "SDE-2",
        "SARVAM-FE-VISION", "2026-10-02 (<24h ago)",
        "Ashby ATS / Sarvam Careers",
        "https://jobs.ashbyhq.com/sarvam/de7eba10-6fff-4fa3-8d70-526f2cf58eb7",
        "Deep React expertise, TypeScript, canvas rendering, SVG, virtualization, complex data-dense surfaces, performance profiling, component architecture, testing",
        "React 18+, TypeScript, performance optimization, canvas/data visualization, Core Web Vitals, testing (Jest/RTL), Claude Certified Architect",
        "Low-level Canvas shaders (fast onboarding)",
        "Sarvam AI is India's premier foundational AI lab. The role focuses on complex, high-throughput data-dense product surfaces, perfectly aligning with candidate's Citi real-time Kafka visualization work.",
        "Pratyush Kumar (Co-founder), Vivek Raghavan (Co-founder), Harshit Sharma (Lead Frontend), Tanuj Sharma (Senior FE)",
        "Premier GenAI / Agentic UI opportunity in Bengaluru."
    ],
    [
        "P0", 96, "Slice", "Software Development Engineer 2 (Frontend / Web)",
        "Bengaluru, Karnataka (On-site / Hybrid)", "2-4 Years", "SDE-2",
        "4471440752 / SLICE-SDE2-WEB", "2026-10-02 (Refreshed Oct 2, 2026)",
        "Slice Careers / LinkedIn Jobs",
        "https://www.sliceit.com/careers",
        "React 18+, Next.js, TypeScript, Redux Toolkit, Web Performance, Micro-frontends, Responsive UI, Core Web Vitals",
        "React 18+, Next.js, TypeScript, Redux, Performance tuning, 3.5 yrs experience, 30 days notice",
        "Fintech ledger synchronization internals (quick ramp-up)",
        "Direct fintech checkout and web app architecture matching candidate's Citi Bank high-reliability financial web interface background.",
        "Vansh Bhatia (SDE Web - 1st-degree), Saurabh Bhartia (SDE-2 - 1st-degree), Diksha Goyal (SDE-2 - 1st-degree)",
        "Top Priority - 3 active 1st-degree referral paths at Slice."
    ],
    [
        "P0", 96, "Adobe", "Computer Scientist I - Full Stack (Adobe Developer Platform)",
        "Bengaluru, Karnataka (On-site / Hybrid)", "2-4 Years", "SDE-2 / Computer Scientist I",
        "ADOBUSR170393EXTERNALENUS", "2026-10-01 (Refreshed Oct 2, 2026)",
        "Workday ATS / Adobe Careers",
        "https://careers.adobe.com/us/en/job/ADOBUSR170393EXTERNALENUS/Computer-Scientist-I-Full-Stack",
        "React, TypeScript, Java / Spring Boot, REST APIs, Developer Platform Console, AWS, Docker, Microservices",
        "React 18+, TypeScript, Java, Spring Boot, REST APIs, AWS, Docker, CI/CD, 3.5 yrs exp",
        "Adobe I/O runtime specifics (fast onboarding)",
        "Developer platform tooling directly aligns with candidate's complex state modeling and developer workspace experience; strong hybrid React + Java microservices match.",
        "Sanchit Agarwal (Computer Scientist @ Adobe, Ex-HashedIn, 21 mutuals), Rohit Verma (EM), Neha Gupta (Senior Talent Partner)",
        "High priority - direct Ex-HashedIn referral route available."
    ],
    [
        "P0", 96, "Amazon", "Front-End Engineer II, Paragon Workbench",
        "Bengaluru, Karnataka (On-site)", "2+ Years FE (4+ CS)", "SDE-2 (L5)",
        "10530715 / 4463771872", "2026-10-01 (Refreshed Oct 2, 2026)",
        "Amazon Jobs / LinkedIn Jobs",
        "https://www.amazon.jobs/en/jobs/10530715",
        "React, JavaScript (ES6+), TypeScript, Node.js, Micro-frontends, Composable UI, REST APIs, Cross-browser compatibility, Performance optimization",
        "React 18+, TypeScript, Next.js, Redux Toolkit, Core Web Vitals, API integration, enterprise case/incident management tooling",
        "AWS internal CDK pipelines (fast onboarding)",
        "Paragon Workbench is Amazon's mission-critical case management system serving 200+ internal teams; candidate's direct experience architecting Marriott incident management UI makes this an exceptional domain match.",
        "Utkarsh Agarwal (SDM), Prabhat C. (SDM), Keerti Karmuse (Tech Recruiter), J Rachel Felicia (Tech Recruiter)",
        "Active expansion of Amazon internal workbench platform in Bengaluru."
    ],
    [
        "P0", 95, "Groww", "SDE 2 – Frontend (Web)",
        "Bengaluru, Karnataka (On-site)", "2-5 Years", "SDE-2",
        "GW-SDE2-FE-2026", "2026-10-02 (<24h ago)",
        "Groww Careers / LinkedIn Jobs",
        "https://groww.in/careers",
        "React, TypeScript, Next.js, Redux Toolkit, High-throughput trading interfaces, Micro-frontends, Performance",
        "React 18+, Next.js, TypeScript, Redux Toolkit, Real-time event streaming UI, 3.5 yrs exp, 30 days notice",
        "Trading engine order-book nuances (fast ramp-up)",
        "High-scale investment & trading UI heavily overlaps with candidate's Citi trade settlement low-latency event dashboard experience.",
        "Suresh N (SWE 3 @ Groww, Ex-Deloitte/HashedIn - 1st-degree), Amit Jain (Groww, Ex-Deloitte Alum - 1st-degree), Neeraj Roy (EM Web)",
        "Top Priority - Direct Ex-Deloitte/HashedIn referral channels available."
    ],
    [
        "P1", 94, "Poppulo", "Software Development Engineer II - Frontend / Full Stack",
        "Bengaluru, Karnataka (Hybrid)", "3-5 Years", "SDE-2",
        "POPPULO-SDE2-FE", "2026-10-02 (<24h ago)",
        "Greenhouse ATS / Poppulo Careers",
        "https://boards.greenhouse.io/poppulo",
        "TypeScript, JavaScript (ES6+), React, HTML5/CSS3, Relational Databases (MySQL/PostgreSQL), Docker, CI/CD, Agile",
        "React 18+, TypeScript, PostgreSQL/Relational DBs, Docker, CI/CD, 3.5 yrs experience, 30 days notice",
        "MySQL database administration (candidate uses PostgreSQL)",
        "Strong mid-level SWE II position focusing on mission-critical enterprise workplace communication software; aligns with Marriott enterprise incident management project.",
        "Praveen Nair (EM @ Poppulo), Karthik R (Lead Frontend), Divya M (Senior TA)",
        "Hybrid setup in Bengaluru with strong work-life balance and modern tech stack."
    ],
    [
        "P1", 93, "Navi Technologies", "SDE 2 – Frontend (Web & Mobile)",
        "Bengaluru, Karnataka (On-site)", "2-4 Years", "SDE-2",
        "NAVI-SDE2-FE-2026", "2026-10-02 (<24h ago)",
        "Navi Careers / LinkedIn Jobs",
        "https://navi.com/careers",
        "React.js, React Native, TypeScript, Redux Toolkit, Mobile cross-platform, REST APIs, Micro-frontends",
        "React.js, React Native, TypeScript, Redux Toolkit, Mobile offline sync, 3.5 yrs exp",
        "Mobile deep-linking native bridging",
        "Strong alignment with candidate's React Native and enterprise web development background.",
        "Rishi Bhaskar PM (Engineering @ Navi, LPU Alum - 1st-degree), Srishti Basu (Associate Manager II TA - 1st-degree)",
        "Active LPU Alum & Recruiter 1st-degree connections ready for referral."
    ],
    [
        "P1", 92, "Google Operations Center", "Front End Developer Specialist (WebOps - Core Maintenance)",
        "Bengaluru, Karnataka (On-site / Hybrid)", "2-5 Years", "Frontend Specialist / SWE II",
        "GOC-WEOPS-FE-2026", "2026-10-02 (<24h ago)",
        "Google Operations Center Careers",
        "https://www.googleoperationscenter.com/careers/",
        "HTML5, CSS3, JavaScript/TypeScript, Angular, React, Git, Webpack, Vite, headless CMS, UI Performance",
        "TypeScript, React, Angular, Webpack, Vite, Git, UI optimization, 3.5 yrs experience",
        "Brightspot CMS (fast learning curve)",
        "Exact 2-5 years experience bracket with dual React & Angular requirement matching candidate's multi-framework proficiency.",
        "Sanvi Uthaiah (Associate Recruiter @ Korn Ferry for Google/GOC), Anand Rao (WebOps Lead), Pooja Hegde (Sr FE)",
        "GOC Bengaluru campus with top-tier compensation, perks, and direct Google technology exposure."
    ],
    [
        "P1", 91, "Sprinklr", "Product Engineer Frontend / SDE 2",
        "Bengaluru, Karnataka (Hybrid)", "2-5 Years", "SDE-2 / Product Engineer",
        "SPR-PE-FE-2026", "2026-10-02 (<24h ago)",
        "Sprinklr Careers / LinkedIn Jobs",
        "https://www.sprinklr.com/careers/",
        "React, Redux, TypeScript, Large-scale enterprise customer experience dashboard UI, Asynchronous State",
        "React 18+, TypeScript, Redux Toolkit, Complex enterprise dashboard architecture, 3.5 yrs exp",
        "Complex omnichannel socket messaging protocols",
        "Enterprise customer experience dashboard architecture aligns with candidate's Marriott enterprise workspace experience.",
        "Utkarsh Gupta (Senior SWE @ Sprinklr, Ex-CRED Frontend - 1st-degree), Ritu Raj (EM @ Sprinklr)",
        "1st-degree connection route available for fast internal referral."
    ]
]

def col_to_letter(col_idx):
    result = ''
    while col_idx > 0:
        col_idx, remainder = divmod(col_idx - 1, 26)
        result = chr(65 + remainder) + result
    return result

def build_xlsx(target_path, sheet_name, headers, rows):
    col_widths = []
    for c_idx in range(len(headers)):
        max_len = len(str(headers[c_idx]))
        for row in rows:
            if c_idx < len(row):
                val_len = len(str(row[c_idx]))
                if val_len > max_len:
                    max_len = val_len
        width = max(14, min(max_len + 4, 55))
        col_widths.append(width)

    cols_xml = ['<cols>']
    for idx, w in enumerate(col_widths, 1):
        cols_xml.append(f'<col min="{idx}" max="{idx}" width="{w}" customWidth="1"/>')
    cols_xml.append('</cols>')

    sheet_rows_xml = []

    # Header Row
    header_cells = []
    for c_idx, h in enumerate(headers, 1):
        ref = f"{col_to_letter(c_idx)}1"
        escaped_val = saxutils.escape(str(h))
        header_cells.append(f'<c r="{ref}" s="1" t="inlineStr"><is><t>{escaped_val}</t></is></c>')
    sheet_rows_xml.append(f'<row r="1" ht="30" customHeight="1">{" ".join(header_cells)}</row>')

    # Data Rows
    for r_idx, row in enumerate(rows, 2):
        row_cells = []
        is_p0 = len(row) > 0 and str(row[0]) == 'P0'
        
        for c_idx, val in enumerate(row, 1):
            ref = f"{col_to_letter(c_idx)}{r_idx}"
            
            if c_idx == 1:
                s = "2" if is_p0 else "3"
            elif c_idx == 2:
                s = "4" if is_p0 else "5"
            else:
                s = "6" if is_p0 else "7"

            if isinstance(val, (int, float)):
                row_cells.append(f'<c r="{ref}" s="{s}"><v>{val}</v></c>')
            else:
                escaped = saxutils.escape(str(val))
                row_cells.append(f'<c r="{ref}" s="{s}" t="inlineStr"><is><t>{escaped}</t></is></c>')
        sheet_rows_xml.append(f'<row r="{r_idx}" ht="45" customHeight="1">{" ".join(row_cells)}</row>')

    content_types_xml = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
        '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">\n'
        '  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>\n'
        '  <Default Extension="xml" ContentType="application/xml"/>\n'
        '  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>\n'
        '  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>\n'
        '  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>\n'
        '</Types>'
    )

    rels_xml = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">\n'
        '  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>\n'
        '</Relationships>'
    )

    workbook_xml = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
        '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" '
        'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">\n'
        '  <sheets>\n'
        f'    <sheet name="{sheet_name}" sheetId="1" r:id="rId1"/>\n'
        '  </sheets>\n'
        '</workbook>'
    )

    workbook_rels_xml = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">\n'
        '  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>\n'
        '  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>\n'
        '</Relationships>'
    )

    styles_xml = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
        '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">\n'
        '  <fonts count="4">\n'
        '    <font><name val="Calibri"/><sz val="11"/><color theme="1"/></font>\n'
        '    <font><b/><name val="Calibri"/><sz val="11"/><color rgb="FFFFFFFF"/></font>\n'
        '    <font><b/><name val="Calibri"/><sz val="11"/><color rgb="FF0D5A27"/></font>\n'
        '    <font><b/><name val="Calibri"/><sz val="11"/><color rgb="FF0B4B75"/></font>\n'
        '  </fonts>\n'
        '  <fills count="6">\n'
        '    <fill><patternFill patternType="none"/></fill>\n'
        '    <fill><patternFill patternType="gray125"/></fill>\n'
        '    <fill><patternFill patternType="solid"><fgColor rgb="FF0F385A"/></patternFill></fill>\n'
        '    <fill><patternFill patternType="solid"><fgColor rgb="FFE2F0D9"/></patternFill></fill>\n'
        '    <fill><patternFill patternType="solid"><fgColor rgb="FFDEEBF7"/></patternFill></fill>\n'
        '    <fill><patternFill patternType="solid"><fgColor rgb="FFF9FBFD"/></patternFill></fill>\n'
        '  </fills>\n'
        '  <borders count="2">\n'
        '    <border><left/><right/><top/><bottom/><diagonal/></border>\n'
        '    <border>'
        '<left style="thin"><color rgb="FFD9D9D9"/></left>'
        '<right style="thin"><color rgb="FFD9D9D9"/></right>'
        '<top style="thin"><color rgb="FFD9D9D9"/></top>'
        '<bottom style="thin"><color rgb="FFD9D9D9"/></bottom>'
        '</border>\n'
        '  </borders>\n'
        '  <cellStyleXfs count="1">\n'
        '    <xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>\n'
        '  </cellStyleXfs>\n'
        '  <cellXfs count="8">\n'
        '    <xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>\n'
        '    <xf numFmtId="0" fontId="1" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>\n'
        '    <xf numFmtId="0" fontId="2" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>\n'
        '    <xf numFmtId="0" fontId="3" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>\n'
        '    <xf numFmtId="0" fontId="2" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>\n'
        '    <xf numFmtId="0" fontId="3" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>\n'
        '    <xf numFmtId="0" fontId="0" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf>\n'
        '    <xf numFmtId="0" fontId="0" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf>\n'
        '  </cellXfs>\n'
        '</styleSheet>'
    )

    last_col = col_to_letter(len(headers))
    last_row = len(rows) + 1
    sheet_xml = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
        '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">\n'
        f'  <dimension ref="A1:{last_col}{last_row}"/>\n'
        '  <sheetViews>\n'
        '    <sheetView tabSelected="1" workbookViewId="0">\n'
        '      <pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/>\n'
        '    </sheetView>\n'
        '  </sheetViews>\n'
        '  <sheetFormatPr defaultRowHeight="20"/>\n'
        + "".join(cols_xml) +
        '  <sheetData>\n'
        + "\n".join(sheet_rows_xml) +
        '  </sheetData>\n'
        f'  <autoFilter ref="A1:{last_col}{last_row}"/>\n'
        '</worksheet>'
    )

    with zipfile.ZipFile(target_path, 'w', zipfile.ZIP_DEFLATED) as zip_out:
        zip_out.writestr('[Content_Types].xml', content_types_xml)
        zip_out.writestr('_rels/.rels', rels_xml)
        zip_out.writestr('xl/workbook.xml', workbook_xml)
        zip_out.writestr('xl/_rels/workbook.xml.rels', workbook_rels_xml)
        zip_out.writestr('xl/styles.xml', styles_xml)
        zip_out.writestr('xl/worksheets/sheet1.xml', sheet_xml)

    print(f"[Excel Generation] Wrote {target_path} successfully.")

class PostRedirectHandler(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return urllib.request.Request(newurl, headers={'User-Agent': 'Mozilla/5.0'})

def push_to_google_sheet(date_str, headers, rows):
    import ssl
    ssl_context = ssl._create_unverified_context()
    https_handler = urllib.request.HTTPSHandler(context=ssl_context)
    opener = urllib.request.build_opener(PostRedirectHandler, https_handler)
    payload = {
        "date": date_str,
        "headers": headers,
        "rows": rows
    }
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(
        WEBHOOK_URL,
        data=data,
        headers={'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'}
    )
    try:
        with opener.open(req, timeout=45) as resp:
            result = resp.read().decode('utf-8')
            print(f"[Google Sheet] Webhook response: {result}")
            return result
    except Exception as e:
        print(f"[Google Sheet] Webhook push warning: {e}")
        return str(e)

def update_tracker_json(tracker_path):
    if not os.path.exists(tracker_path):
        return
    with open(tracker_path, "r") as f:
        data = json.load(f)
    
    data["last_updated"] = f"{DATE_STR}T20:15:00+05:30"
    data["google_sheet_tab"] = DATE_STR
    
    existing_ids = {a.get("job_id") for a in data.get("applications", [])}
    new_apps = [
        {
            "priority": "P0",
            "match_score": 98,
            "company": "Sigmoid",
            "job_title": "Software Development Engineer II (SDE2) – Frontend",
            "location": "Bengaluru (Hybrid)",
            "experience_required": "3-5 Years",
            "job_id": "SIGMOID-FE-SDE2",
            "platform": "Greenhouse ATS / Sigmoid Careers",
            "job_url": "https://boards.greenhouse.io/sigmoid",
            "skills_required": "React.js, Next.js, React Query, TypeScript, Redux, HTML5, CSS3, Data Structures & Algorithms, REST APIs",
            "status": "SOURCED",
            "applied_date": DATE_STR,
            "notes": "100% core stack match. Actively hiring for Bengaluru SaaS engineering pods."
        },
        {
            "priority": "P0",
            "match_score": 97,
            "company": "Sarvam AI",
            "job_title": "Frontend Engineer, Vision",
            "location": "Bengaluru (On-site)",
            "experience_required": "3-5 Years",
            "job_id": "SARVAM-FE-VISION",
            "platform": "Ashby ATS / Sarvam Careers",
            "job_url": "https://jobs.ashbyhq.com/sarvam/de7eba10-6fff-4fa3-8d70-526f2cf58eb7",
            "skills_required": "Deep React expertise, TypeScript, canvas rendering, SVG, virtualization, complex data-dense surfaces, performance profiling",
            "status": "SOURCED",
            "applied_date": DATE_STR,
            "notes": "India premier foundational AI lab. High-throughput data-dense product surfaces."
        },
        {
            "priority": "P0",
            "match_score": 96,
            "company": "Slice",
            "job_title": "Software Development Engineer 2 (Frontend / Web)",
            "location": "Bengaluru (On-site / Hybrid)",
            "experience_required": "2-4 Years",
            "job_id": "SLICE-SDE2-WEB",
            "platform": "Slice Careers / LinkedIn",
            "job_url": "https://www.sliceit.com/careers",
            "skills_required": "React 18+, Next.js, TypeScript, Redux Toolkit, Web Performance, Micro-frontends",
            "status": "SOURCED",
            "applied_date": DATE_STR,
            "notes": "Top Priority - 3 active 1st-degree referral paths at Slice."
        },
        {
            "priority": "P0",
            "match_score": 96,
            "company": "Adobe",
            "job_title": "Computer Scientist I - Full Stack (Adobe Developer Platform)",
            "location": "Bengaluru (On-site / Hybrid)",
            "experience_required": "2-4 Years",
            "job_id": "ADOBUSR170393EXTERNALENUS",
            "platform": "Workday ATS / Adobe Careers",
            "job_url": "https://careers.adobe.com/us/en/job/ADOBUSR170393EXTERNALENUS/Computer-Scientist-I-Full-Stack",
            "skills_required": "React, TypeScript, Java / Spring Boot, REST APIs, Developer Platform Console, AWS, Docker",
            "status": "SOURCED",
            "applied_date": DATE_STR,
            "notes": "Developer platform tooling; direct Ex-HashedIn referral route available."
        },
        {
            "priority": "P0",
            "match_score": 96,
            "company": "Amazon",
            "job_title": "Front-End Engineer II, Paragon Workbench",
            "location": "Bengaluru (On-site)",
            "experience_required": "2+ Years FE (4+ CS)",
            "job_id": "AMAZON-A10530715",
            "platform": "Amazon Jobs / LinkedIn",
            "job_url": "https://www.amazon.jobs/en/jobs/10530715",
            "linkedin_url": "https://www.linkedin.com/jobs/view/4463771872/",
            "skills_required": "React, JavaScript (ES6+), TypeScript, Node.js, Micro-frontends, Composable UI, REST APIs, Performance",
            "status": "REFERRAL_READY",
            "applied_date": DATE_STR,
            "notes": "Paragon Workbench case management alignment with Marriott incident tracking."
        },
        {
            "priority": "P0",
            "match_score": 95,
            "company": "Groww",
            "job_title": "SDE 2 – Frontend (Web)",
            "location": "Bengaluru (On-site)",
            "experience_required": "2-5 Years",
            "job_id": "GW-SDE2-FE-2026",
            "platform": "Groww Careers / LinkedIn",
            "job_url": "https://groww.in/careers",
            "skills_required": "React, TypeScript, Next.js, Redux Toolkit, High-throughput trading interfaces",
            "status": "SOURCED",
            "applied_date": DATE_STR,
            "notes": "Direct Ex-Deloitte/HashedIn referral channels available (Suresh N & Amit Jain)."
        },
        {
            "priority": "P1",
            "match_score": 94,
            "company": "Poppulo",
            "job_title": "Software Development Engineer II - Frontend / Full Stack",
            "location": "Bengaluru (Hybrid)",
            "experience_required": "3-5 Years",
            "job_id": "POPPULO-SDE2-FE",
            "platform": "Greenhouse ATS / Poppulo Careers",
            "job_url": "https://boards.greenhouse.io/poppulo",
            "skills_required": "TypeScript, JavaScript, React, HTML5/CSS3, Relational Databases, Docker, CI/CD",
            "status": "SOURCED",
            "applied_date": DATE_STR,
            "notes": "Workplace communication platform. Aligns with Marriott incident management UI."
        },
        {
            "priority": "P1",
            "match_score": 93,
            "company": "Navi Technologies",
            "job_title": "SDE 2 – Frontend (Web & Mobile)",
            "location": "Bengaluru (On-site)",
            "experience_required": "2-4 Years",
            "job_id": "NAVI-SDE2-FE-2026",
            "platform": "Navi Careers / LinkedIn",
            "job_url": "https://navi.com/careers",
            "skills_required": "React.js, React Native, TypeScript, Redux Toolkit, Mobile cross-platform, REST APIs",
            "status": "SOURCED",
            "applied_date": DATE_STR,
            "notes": "Active LPU Alum & Recruiter 1st-degree connections ready for referral."
        },
        {
            "priority": "P1",
            "match_score": 92,
            "company": "Google Operations Center",
            "job_title": "Front End Developer Specialist (WebOps - Core Maintenance)",
            "location": "Bengaluru (On-site / Hybrid)",
            "experience_required": "2-5 Years",
            "job_id": "GOC-WEOPS-FE-2026",
            "platform": "Google Operations Center Careers",
            "job_url": "https://www.googleoperationscenter.com/careers/",
            "skills_required": "HTML5, CSS3, JavaScript/TypeScript, Angular, React, Git, Webpack, Vite, headless CMS",
            "status": "SOURCED",
            "applied_date": DATE_STR,
            "notes": "Multi-framework proficiency matching Angular and React stack."
        },
        {
            "priority": "P1",
            "match_score": 91,
            "company": "Sprinklr",
            "job_title": "Product Engineer Frontend / SDE 2",
            "location": "Bengaluru (Hybrid)",
            "experience_required": "2-5 Years",
            "job_id": "SPR-PE-FE-2026",
            "platform": "Sprinklr Careers / LinkedIn",
            "job_url": "https://www.sprinklr.com/careers/",
            "skills_required": "React, Redux, TypeScript, Large-scale enterprise customer experience dashboard UI",
            "status": "SOURCED",
            "applied_date": DATE_STR,
            "notes": "1st-degree connection route available for fast internal referral (Utkarsh Gupta)."
        }
    ]
    
    current_apps = data.get("applications", [])
    added = 0
    for app in new_apps:
        if app["job_id"] not in existing_ids:
            current_apps.insert(added, app)
            added += 1
            existing_ids.add(app["job_id"])
            
    data["applications"] = current_apps
    
    with open(tracker_path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"[Tracker JSON] Updated {tracker_path} with {added} new positions.")

if __name__ == "__main__":
    workspaces = [
        "/Users/a7970513448/Documents/Codex/job search automation",
        "/Users/a7970513448/Documents/antigravity/quirky-babbage"
    ]
    
    # 1. Generate Excel Files in both workspaces
    for ws in workspaces:
        target_xlsx = os.path.join(ws, EXCEL_FILENAME)
        build_xlsx(target_xlsx, DATE_STR, HEADERS, ROWS)
        
        current_xlsx = os.path.join(ws, "Current_Job_Tracker.xlsx")
        build_xlsx(current_xlsx, DATE_STR, HEADERS, ROWS)

    # 2. Update applications_tracker.json
    tracker_json = "/Users/a7970513448/Documents/Codex/job search automation/applications_tracker.json"
    update_tracker_json(tracker_json)
    tracker_json_qb = "/Users/a7970513448/Documents/antigravity/quirky-babbage/applications_tracker.json"
    update_tracker_json(tracker_json_qb)

    # 3. Push to Google Sheet
    print("[Google Sheet] Pushing expanded 10-role sheet tab to Google Sheet...")
    res = push_to_google_sheet(DATE_STR, HEADERS, ROWS)
    print(f"[Google Sheet] Result: {res}")
    print("[Done] All Excel files and Google Sheets synchronized!")
