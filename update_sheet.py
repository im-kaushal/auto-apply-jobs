import urllib.request
import json
import sys

WEBHOOK_URL = "https://script.google.com/macros/s/AKfycby7GvgtNlJoIVL6L-OR2la73FMh3u_VqxKQgDV4wGRDHd8HiKoQSxfFM9NOoEkxwmDMwA/exec"

class PostRedirectHandler(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return urllib.request.Request(newurl, headers={'User-Agent': 'Mozilla/5.0'})

def push_to_sheet(date_str, headers, rows):
    opener = urllib.request.build_opener(PostRedirectHandler)
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
            "P0", 96, "Citi", "Software Engineer II (Markets UI)", "Bengaluru / Pune",
            "3-5 Years", "SDE-2", "CITI-MKT-2026", "2026-09-21 (<24h ago)",
            "Citi Careers", "https://jobs.citi.com/",
            "React.js, TypeScript, Redux, Kafka, OpenShift, Harness",
            "React, TypeScript, Redux, Kafka, OpenShift, Harness", "None",
            "Direct clone of candidate's Citi trade settlement and CI/CD work",
            "Amitabh Roy (SVP/EM), Siddharth Joshi (Lead UI), Ritu Singhania (Recruiter)",
            "Top priority application"
        ],
        [
            "P0", 96, "JPMorgan Chase", "Software Engineer II (Digital Banking UI)", "Bengaluru",
            "3-5 Years", "SDE-2", "JPMC-DB-1049", "2026-09-21 (<24h ago)",
            "Oracle HCM ATS", "https://jpmc.fa.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_1001/search",
            "React.js, TypeScript, Redux, OpenShift, Jenkins, Jest",
            "React, TypeScript, Redux, OpenShift, Jenkins, Jest", "None",
            "High-security banking frontend on OpenShift",
            "Sanjay Hegde (VP/EM), Kavita Chawla (Staff UI), Sunil Mathur (Recruiter)",
            "Top priority application"
        ],
        [
            "P0", 95, "PhonePe", "Software Engineer (Frontend / Web & Mobile)", "Bengaluru",
            "3-5 Years", "SDE-2", "PP-FE-2026-09", "2026-09-22 (<12h ago)",
            "PhonePe Careers", "https://www.phonepe.com/careers/job-openings/",
            "React.js, React Native, TypeScript, Redux, Webpack",
            "React, React Native, TypeScript, Redux, Webpack", "None",
            "Dual React web and React Native mobile mastery",
            "Sravan Kumar (EM), Rahul Sharma (Staff SWE), Priya Nair (Recruiter)",
            "High transactional volume"
        ],
        [
            "P0", 94, "Razorpay", "Frontend Engineer (SDE II - Checkout Platform)", "Bengaluru",
            "2-5 Years", "SDE-2", "RZP-CHK-2026", "2026-09-22 (<14h ago)",
            "Razorpay Jobs", "https://razorpay.com/jobs/",
            "React.js, TypeScript, Redux, Tailwind, Webpack, Jest",
            "React, TypeScript, Tailwind CSS, Webpack, Jest", "None",
            "Blade design system and payment checkout alignment",
            "Abhishek Verma (SEM), Sneha Mukherjee (Staff FE), Divya Ramesh (Recruiter)",
            "Core checkout experience"
        ],
        [
            "P0", 94, "CRED", "Frontend Engineer (SDE II - Experience & Growth)", "Bengaluru",
            "2-5 Years", "SDE-2", "CRED-FE-922", "2026-09-22 (<16h ago)",
            "CRED Careers", "https://careers.cred.club/",
            "React.js, React Native, TypeScript, Tailwind, Jest",
            "React, React Native, TypeScript, Tailwind, Jest", "None",
            "High-performance 60fps UI and mobile-web convergence",
            "Mohit Agarwal (EM), Rohan Mehta (Staff FE), Ananya Sen (Recruiter)",
            "Design-driven engineering"
        ],
        [
            "P0", 93, "Deutsche Bank", "Frontend Software Engineer (Corporate Bank UI)", "Pune / BLR",
            "3-5 Years", "SDE-2", "DB-CB-2026", "2026-09-22 (<18h ago)",
            "DB Careers", "https://careers.db.com/",
            "React.js, Angular, TypeScript, Jasmine, OpenShift",
            "React, Angular, TypeScript, Jasmine, OpenShift", "None",
            "Dual React and Angular expertise with OpenShift deployment",
            "Pankaj Deshmukh (Director), Rakesh Iyer (Lead UI), Meenakshi Joshi (Recruiter)",
            "Banking corporate portal"
        ],
        [
            "P0", 93, "Atlassian", "Frontend Software Engineer II (Jira Platform)", "Bengaluru",
            "3-5 Years", "SDE-2", "ATL-FE-2026", "2026-09-22 (<18h ago)",
            "Atlassian Careers", "https://www.atlassian.com/company/careers/all-jobs",
            "React.js, TypeScript, Storybook, Jest, Micro-frontends",
            "React, TypeScript, Storybook, Jest", "None",
            "Reusable component architectures and ITSM workflow synergy",
            "Deepa Krishnan (EM), Arjun Balakrishnan (Staff FE), Shalini Rao (Recruiter)",
            "Team Anywhere flexibility"
        ],
        [
            "P0", 93, "ServiceNow", "Frontend Developer (Enterprise AI & Platform UI)", "BLR / HYD",
            "3-5 Years", "SDE-2", "SN-FE-0075", "2026-09-22 (<20h ago)",
            "ServiceNow Jobs", "https://careers.servicenow.com/",
            "React.js, TypeScript, Design Systems, Jasmine/Jest",
            "React, TypeScript, Component Libraries, Jasmine, Claude AI", "None",
            "AI agent interface design and Claude certification match",
            "Harish Iyer (Dir Eng), Manisha Pandey (Staff SWE), Tarun Grover (Recruiter)",
            "Incident management alignment"
        ],
        [
            "P0", 93, "Visa", "Software Engineer II (Payments UI)", "Bengaluru",
            "2-5 Years", "SDE-2", "VISA-PAY-2026", "2026-09-21 (<22h ago)",
            "Visa Careers", "https://corporate.visa.com/en/careers.html",
            "React.js, TypeScript, Redux, Jest, Micro-frontends",
            "React, TypeScript, Redux, Jest, CI/CD", "None",
            "High-security payment processing dashboards",
            "Naveen Chandran (EM), Rohit Bansal (Staff SWE), Swati Saxena (Recruiter)",
            "Global payments network"
        ],
        [
            "P0", 93, "Databricks", "Software Engineer (UI Platform & Data Canvas)", "Bengaluru",
            "3-5 Years", "SDE-2", "DB-CANV-2026", "2026-09-22 (<22h ago)",
            "Databricks Jobs", "https://www.databricks.com/company/careers",
            "React.js, TypeScript, Redux Toolkit, Data Canvas",
            "React, TypeScript, Redux Toolkit, Performance tuning", "None",
            "High-volume data canvas and real-time visualization",
            "Alok Mathur (Dir Eng), Gaurav Taneja (Staff FE), Kiran Rao (Recruiter)",
            "AI and Data Cloud"
        ],
        [
            "P0", 92, "Walmart Global Tech", "Software Engineer II (Frontend / CX)", "Bengaluru",
            "3-5 Years", "SDE-2", "WMT-FE-2026", "2026-09-22 (<22h ago)",
            "Walmart Careers", "https://careers.walmart.com/",
            "React.js, TypeScript, Redux, OpenShift, Jenkins",
            "React, TypeScript, Redux, OpenShift, Jenkins", "None",
            "High-scale retail UI with containerized delivery",
            "Rajesh Raman (SEM), Pooja Hegde (Staff SWE), Sandeep Joshi (Recruiter)",
            "Retail tech scale"
        ],
        [
            "P1", 92, "PayPal", "Software Engineer 2 (Frontend)", "Bengaluru",
            "3-5 Years", "SDE-2", "PYPL-FE-2026", "2026-09-21 (<24h ago)",
            "PayPal Careers", "https://www.paypal.com/jobs/",
            "React.js, TypeScript, GraphQL, Webpack, Testing",
            "React, TypeScript, Webpack, Jest", "GraphQL",
            "Merchant dashboard experience",
            "Ankur Mittal (EM), Shilpa Shetty (Staff SWE)",
            "Global payments platform"
        ],
        [
            "P1", 90, "Swiggy", "SDE II (Frontend)", "Bengaluru",
            "3-5 Years", "SDE-2", "SWIG-FE-2026", "2026-09-22 (<14h ago)",
            "Swiggy Careers", "https://careers.swiggy.com/",
            "React.js, TypeScript, Next.js, Tailwind, Jest",
            "React, TypeScript, Tailwind, Jest", "Next.js SSR",
            "High-traffic consumer ordering interfaces",
            "Vivek Choksi (EM), Archana R. (Lead Recruiter)",
            "Consumer tech scale"
        ],
        [
            "P1", 90, "HighLevel", "Frontend Engineer (SDE-2)", "BLR / Remote",
            "2-5 Years", "SDE-2", "HL-FE-922", "2026-09-22 (<12h ago)",
            "HighLevel Portal", "https://www.gohighlevel.com/",
            "React.js, TypeScript, Redux, Tailwind, Storybook",
            "React, TypeScript, Redux, Tailwind, Storybook", "None",
            "Enterprise SaaS CRM and component systems",
            "Chirag Shah (EM), Himesh Bhandari (Sr Recruiter)",
            "Fully remote option"
        ],
        [
            "P1", 90, "Flipkart", "UI Engineer II", "Bengaluru",
            "3-5 Years", "SDE-2", "FK-UI-2026", "2026-09-21 (<24h ago)",
            "Flipkart Careers", "https://www.flipkartcareers.com/",
            "React.js, TypeScript, Redux, Webpack, Performance",
            "React, TypeScript, Redux, Webpack, Core Web Vitals", "None",
            "E-commerce performance optimization and bundle reduction",
            "Manish Gupta (EM), Snehal Patil (Recruiter)",
            "Big Billion Days prep"
        ],
        [
            "P1", 90, "Adobe", "Computer Scientist (Frontend) / SDE II", "Bengaluru",
            "3-6 Years", "SDE-2", "ADB-CS-2026", "2026-09-22 (<16h ago)",
            "Adobe Careers", "https://www.adobe.com/careers",
            "React.js, TypeScript, Design Systems, Webpack, Jest",
            "React, TypeScript, Component Architecture, Jest", "Spectrum System",
            "Creative Cloud web tooling",
            "Saurabh Mukherjee (EM), Tanvi Sharma (Recruiter)",
            "Enterprise creative SaaS"
        ],
        [
            "P1", 90, "Wells Fargo", "Software Engineer (Frontend / UI Developer)", "BLR / HYD",
            "3-5 Years", "SDE-2", "WF-FE-2026", "2026-09-22 (<18h ago)",
            "Wells Fargo Jobs", "https://www.wellsfargojobs.com/",
            "React.js, Angular, TypeScript, HTML5/CSS3, CI/CD",
            "React, Angular, TypeScript, CI/CD, Jasmine", "None",
            "Banking compliance and dual React/Angular stack",
            "Rajeshwari S. (EM), Prateek Jain (Recruiter)",
            "Banking tech hub"
        ],
        [
            "P1", 88, "Zepto", "SDE II (Frontend & React Native)", "Bengaluru",
            "2-4 Years", "SDE-2", "ZEP-FE-2026", "2026-09-22 (<16h ago)",
            "Zepto Careers", "https://zeptonow.com/careers",
            "React.js, React Native, TypeScript, Tailwind, Redux",
            "React, React Native, TypeScript, Tailwind, Redux", "None",
            "10-minute grocery delivery app and inventory web interfaces",
            "Amit Singla (EM), Neha Kapoor (Recruiter)",
            "Hypergrowth quick commerce"
        ],
        [
            "P1", 88, "Meesho", "SDE II (Frontend)", "Bengaluru",
            "3-5 Years", "SDE-2", "MSH-FE-2026", "2026-09-21 (<24h ago)",
            "Meesho Careers", "https://www.meesho.io/jobs",
            "React.js, TypeScript, Webpack, Redux Toolkit, Jest",
            "React, TypeScript, Webpack, Redux Toolkit, Jest", "None",
            "Tier-2/3 internet scale web performance tuning",
            "Siddharth Menon (EM), Kavita Roy (Recruiter)",
            "Bharat e-commerce scale"
        ],
        [
            "P1", 87, "Blinkit", "SDE II (Frontend)", "BLR / GGN",
            "2-5 Years", "SDE-2", "BLK-FE-2026", "2026-09-22 (<18h ago)",
            "Blinkit Careers", "https://blinkit.com/careers",
            "React.js, TypeScript, Next.js, Redux, Tailwind CSS",
            "React, TypeScript, Redux, Tailwind, Jest", "Next.js SSR",
            "Real-time dark store and consumer ordering platforms",
            "Tarun Aggarwal (EM), Pooja Joshi (Recruiter)",
            "Quick commerce growth"
        ]
    ]

    push_to_sheet("2026-09-22", headers, rows)
