import urllib.request
import json

WEBHOOK_URL = "https://script.google.com/macros/s/AKfycby7GvgtNlJoIVL6L-OR2la73FMh3u_VqxKQgDV4wGRDHd8HiKoQSxfFM9NOoEkxwmDMwA/exec"

import ssl

class PostRedirectHandler(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return urllib.request.Request(newurl, headers={'User-Agent': 'Mozilla/5.0'})

def push_to_sheet(date_str, headers, rows):
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    opener = urllib.request.build_opener(PostRedirectHandler, urllib.request.HTTPSHandler(context=ctx))
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
    with opener.open(req, timeout=45) as resp:
        result = resp.read().decode('utf-8')
        print(f"Sheet updated successfully: {result}")
        return result

if __name__ == "__main__":
    headers = [
        "Priority", "Match Score", "Company", "Job Title", "Location",
        "Experience Required", "Role Level", "Job ID", "Job Posted Date & Time ago",
        "Platform / Source", "Direct Application Link", "Skills Required",
        "Skills Matched", "Skill Gaps", "Why It Matches",
        "Referral Employees", "Notes"
    ]

    rows = [
        [
            "P0", 96, "Razorpay", "Artificial Intelligence Engineer", "Bengaluru (On-site)",
            "2-6 Years", "SDE-2/AI Engineer", "4476296640", "2026-10-10 (1h ago)",
            "LinkedIn Jobs", "https://www.linkedin.com/jobs/view/4476296640/",
            "AI Agents, MCP Tools, Full-stack system architecture, React, TS, Autonomous workflows",
            "AI Agent UX, TypeScript, MCP tooling integration, Marriott AI chat, Systems Engineering", "None",
            "CxO-level autonomous agent and product building, direct alignment with Claude Certified Architect & agentic engineering",
            "Nikita Bagla (SDE2 @ Razorpay, 1st-degree)",
            "Referral request delivered on LinkedIn (Oct 10, 17:03 IST). Cites Marriott AI chat, agentic loops & Citi workflows."
        ],
        [
            "P0", 96, "Swiggy", "Software Dev Engineer I", "Bengaluru (On-site)",
            "2-4 Years", "SDE-1/2", "4475208744", "2026-10-10 (1h ago)",
            "LinkedIn Jobs", "https://www.linkedin.com/jobs/view/4475208744/",
            "React Native, React.js, TypeScript, Mobile/Web performance, Redux",
            "React Native, React.js, TypeScript, Redux, Performance Optimization", "None",
            "High-scale food/quick commerce mobile & web applications, exact stack match",
            "Angshuman Das (Software Engineer II @ Swiggy, 1st-degree)",
            "Referral request delivered on LinkedIn (Oct 10, 16:58 IST). Cites React Native, Marriott AI & Citi workflows."
        ],
        [
            "P0", 95, "Adobe", "Computer Scientist (Adobe Express Imaging)", "Noida / Bengaluru",
            "4-7 Years", "SDE-2/Computer Scientist", "4458384355", "2026-10-10 (4h ago)",
            "LinkedIn Jobs", "https://www.linkedin.com/jobs/view/4458384355/",
            "Web App engineering, Image rendering workflows, UI interactions, AI workflows, React, TS",
            "React, TypeScript, Web performance, AI agent UI workflows, Micro-frontends", "Low-level rendering canvas/WASM (Minor)",
            "Adobe Express Web App team, AI-assisted UX, exact synergy with Marriott AI chat and Citi workflows",
            "Sharmee Biswas (Software Engineer @ Adobe, 1st-degree)",
            "Referral request delivered on LinkedIn (Oct 10, 17:01 IST). Includes portfolio."
        ],
        [
            "P0", 95, "PhonePe", "Software Engineer (3-5)", "Bengaluru (On-site)",
            "3-5 Years", "SDE-2", "4475286970", "2026-10-10 (4h ago)",
            "LinkedIn Jobs", "https://www.linkedin.com/jobs/view/4475286970/",
            "Web-based applications, Distributed Systems, React/Java, TDD, REST",
            "Web applications, React/TypeScript, Systems Architecture, TDD", "None",
            "High-scale web applications, 3-5 years lateral match, fintech domain alignment",
            "Sandeep Chandel (Software Engineer @ PhonePe, LPU Alum, 1st-degree)",
            "Referral request delivered on LinkedIn (Oct 10, 15:57 IST). Includes portfolio."
        ],
        [
            "P0", 94, "Cisco", "Software Engineer (Supply Chain IT & Enterprise UI)", "Bengaluru (On-site)",
            "3-5 Years", "SDE-2", "4477888054", "2026-10-10 (11h ago)",
            "LinkedIn Jobs", "https://www.linkedin.com/jobs/view/4477888054/",
            "React.js, Angular, Java, Spring Boot, Kafka, AI-First UI, DevSecOps",
            "React.js, Angular, TypeScript, Kafka, OpenShift CI/CD, Enterprise UI", "Java/Spring Boot (Minor)",
            "Direct mirror of Citi Bank Kafka settlement dashboard and Marriott incident management UI",
            "Srishti Dhariwal (Software Engineer @ Cisco, 1st-degree, 74 mutuals)",
            "Referral request delivered on LinkedIn (Oct 10, 16:04 IST). Includes portfolio."
        ],
        [
            "P1", 92, "Cisco", "Software Engineer (AI-Native Supply Chain Fast Fulfilment IT)", "Bengaluru (On-site)",
            "3-5 Years", "SDE-2", "4477875591", "2026-10-10 (11h ago)",
            "LinkedIn Jobs", "https://www.linkedin.com/jobs/view/4477875591/",
            "AI Agents, MCP Tools, RAG, LangChain, LangGraph, Test Automation, UX",
            "AI Agent UX, TypeScript, MCP tooling integration, Test Automation", "None",
            "Claude Certified Architect and Agentic UI workflows alignment",
            "Vikram Singla (UI Engineer @ CiscoAI, 1st-degree, 188 mutuals)",
            "Referral outreach dispatched on LinkedIn. Highlights Marriott AI chat & Citi Kafka."
        ],
        [
            "P1", 88, "Walmart Global Tech India", "(IND) Software Engineer III", "Bengaluru (On-site)",
            "3-5 Years", "SDE-2/3", "4475230097", "2026-10-10 (21h ago)",
            "LinkedIn Jobs", "https://www.linkedin.com/jobs/view/4475230097/",
            "Smart TV UI, Video domain automation, Python, CI/CD, GitHub Actions",
            "UI automation, CI/CD, Enterprise release processes", "Python/Smart TV Video stack",
            "25 connections work here; major retail engineering scale",
            "Vishal Sharma (SE-III @ Walmart Global Tech, 1st-degree, 22 mutuals)",
            "Referral request delivered on LinkedIn (Oct 10, 16:32 IST). Matches SE-III role."
        ]
    ]

    push_to_sheet("2026-10-10", headers, rows)
