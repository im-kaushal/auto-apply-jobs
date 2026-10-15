"""
Test fixtures, synthetic record generators, and data builders for Recruiter Outreach.
"""

from typing import List, Dict, Any, Optional
import copy

AGENCIES = [
    "TeamLease Digital",
    "Randstad India",
    "Adecco India",
    "Michael Page India",
    "Allegis Group / TEKsystems India"
]

RECRUITER_SEEDS = {
    "TeamLease Digital": [
        ("Ritu Singhania", "ritusinghania", "Senior Technical Recruiter - Digital & Cloud"),
        ("Abhishek Sharma", "abhisheksharma-tl", "Lead IT Talent Acquisition Partner"),
        ("Snehal Kulkarni", "snehalkulkarni-tl", "Technical Recruiter - Frontend & Full Stack"),
        ("Gaurav Deshmukh", "gauravdeshmukh-tl", "Senior IT Staffing Consultant"),
        ("Megha Verma", "meghaverma-tl", "Technical Talent Partner - Product Engineering"),
        ("Vikram Nair", "vikramnair-tl", "Lead Sourcing Specialist - Software Engineering"),
        ("Pooja Hegde", "poojahegde-tl", "Senior Recruiter - GCC Tech Practice"),
        ("Naveen Reddy", "naveenreddy-tl", "IT Recruitment Specialist - Digital Apps"),
        ("Shweta Joshi", "shwetajoshi-tl", "Talent Acquisition Consultant - Web & Mobile"),
        ("Rahul Sengupta", "rahulsengupta-tl", "Lead Technical Recruiter - UI/Frontend")
    ],
    "Randstad India": [
        ("Amitabh Roy", "amitabhroy-randstad", "Senior Consultant - Randstad Technologies"),
        ("Divya Ramesh", "divyaramesh-randstad", "Lead Technical Recruiter - Banking GCCs"),
        ("Siddharth Joshi", "siddharthjoshi-randstad", "Principal IT Talent Consultant"),
        ("Kavita Chawla", "kavitachawla-randstad", "Talent Acquisition Partner - Enterprise Tech"),
        ("Tarun Aggarwal", "tarunaggarwal-randstad", "Senior Technical Recruiter - Cloud & Frontend"),
        ("Ananya Sen", "ananyasen-randstad", "Lead Staffing Consultant - Digital Engineering"),
        ("Harish Iyer", "harishiyer-randstad", "Senior Recruitment Consultant - Software"),
        ("Priya Nair", "priyanair-randstad", "Talent Specialist - Web & Modern Frontend"),
        ("Deepak Mittal", "deepakmittal-randstad", "Lead Technical Recruiter - GCC Hubs"),
        ("Rohini Patil", "rohinipatil-randstad", "Senior IT Recruiter - React & Mobile")
    ],
    "Adecco India": [
        ("Sanjay Hegde", "sanjayhegde-adecco", "Lead Tech Recruitment Consultant - Akkodis"),
        ("Neha Kapoor", "nehakapoor-adecco", "Senior Technical Talent Partner"),
        ("Rakesh Iyer", "rakeshiyer-adecco", "Practice Consultant - Enterprise Software"),
        ("Tanvi Sharma", "tanvisharma-adecco", "Senior IT Recruiter - Frontend Practice"),
        ("Manish Gupta", "manishgupta-adecco", "Lead Talent Acquisition Specialist - Digital"),
        ("Archana Rao", "archanarao-adecco", "Senior Consultant - Product Engineering Staffing"),
        ("Sravan Kumar", "sravankumar-adecco", "Technical Recruiter - Web & Frontend Tech"),
        ("Swati Saxena", "swatisaxena-adecco", "Talent Acquisition Partner - Fintech"),
        ("Chirag Shah", "chiragshah-adecco", "Senior IT Staffing Specialist"),
        ("Nisha Menon", "nishamenon-adecco", "Lead Technical Recruiter - Software Engineering")
    ],
    "Michael Page India": [
        ("Alok Mathur", "alokmathur-mp", "Managing Consultant - Technology & Digital"),
        ("Shalini Rao", "shalinirao-mp", "Senior Consultant - Software Engineering & Product"),
        ("Deepa Krishnan", "deepakrishnan-mp", "Consultant - Technology Practice"),
        ("Arjun Balakrishnan", "arjunb-mp", "Senior Consultant - High Growth Tech & SaaS"),
        ("Kiran Rao", "kiranrao-mp", "Managing Consultant - Enterprise Tech & GCCs"),
        ("Rohit Bansal", "rohitbansal-mp", "Senior Consultant - Frontend & Mobile Practice"),
        ("Sunil Mathur", "sunilmathur-mp", "Consultant - Digital Banking & Fintech"),
        ("Pankaj Deshmukh", "pankajd-mp", "Senior Consultant - UI/UX & Web Engineering"),
        ("Meenakshi Joshi", "meenakshij-mp", "Lead Talent Consultant - Software Systems"),
        ("Saurabh Mukherjee", "saurabhm-mp", "Senior Consultant - Product Engineering & Cloud")
    ],
    "Allegis Group / TEKsystems India": [
        ("Rajesh Raman", "rajeshraman-tek", "Senior Technical Recruiter - Enterprise GCCs"),
        ("Ankur Mittal", "ankurmittal-tek", "Principal IT Staffing Lead - Banking Tech"),
        ("Sneha Mukherjee", "snehamukherjee-tek", "Senior Talent Partner - Frontend & Cloud"),
        ("Himesh Bhandari", "himeshbhandari-tek", "Lead Technical Recruiter - Digital Solutions"),
        ("Vivek Choksi", "vivekchoksi-tek", "Senior IT Recruiter - Core Engineering"),
        ("Pooja Joshi", "poojajoshi-tek", "Talent Acquisition Consultant - Modern Web"),
        ("Siddharth Menon", "siddharthmenon-tek", "Lead Technical Sourcing Specialist"),
        ("Kavita Roy", "kavitaroy-tek", "Senior Recruiter - FinTech & GCC Engineering"),
        ("Naveen Chandran", "naveenchandran-tek", "Principal Technical Recruiter"),
        ("Tarun Grover", "tarungrover-tek", "Senior IT Talent Partner - React & Full Stack")
    ]
}


def generate_connection_request_note(first_name: str, agency: str) -> str:
    """
    Generate an authentic, high-relevance connection note under 300 characters.
    Must contain: 'kausal.in', 'Kaushal Kumar', '3.5', 'React'
    """
    note = (
        f"Hi {first_name}, noticed your tech hiring at {agency}. "
        f"I'm Kaushal Kumar, a Frontend SWE with 3.5+ yrs in React & React Native (kausal.in). "
        f"Exploring SDE-2 openings and would love to connect for relevant mandates. Thanks!"
    )
    assert len(note) < 300, f"Generated note exceeds 300 chars: {len(note)}"
    return note


def generate_first_degree_dm(first_name: str, agency: str) -> str:
    """
    Generate an authentic 1st-degree warm direct message.
    Must contain: 'kausal.in', 'Kaushal Kumar', '3.5', 'React'
    """
    return (
        f"Hey {first_name}, hope you're having a good week! "
        f"Reaching out since we're connected here, and I know {agency} partners with some great tech teams in India. "
        f"I'm currently exploring new Frontend / SDE-2 opportunities in Bengaluru (open to hybrid/remote). "
        f"I have 3.5+ years of experience building web and mobile apps primarily with React, TypeScript, and React Native—"
        f"recently working on real-time trade settlement dashboards and incident management tools. "
        f"If you have a couple of minutes, I'd really appreciate your guidance or a quick check if anything on your radar might be a fit: https://kausal.in "
        f"No pressure at all if things are busy, but even pointing me in the right direction would mean a lot. Thanks! – Kaushal Kumar"
    )


def generate_valid_record(
    agency: str,
    name: str,
    handle: str,
    designation: str,
    is_first_degree: bool = False,
    date_contacted: str = "2026-09-23"
) -> Dict[str, Any]:
    """Generate a single conforming record dictionary."""
    first_name = name.split()[0]
    if is_first_degree:
        status = "Existing Connection"
        otype = "1st-Degree Message"
        msg = generate_first_degree_dm(first_name, agency)
    else:
        status = "Not Connected"
        otype = "Connection Request"
        msg = generate_connection_request_note(first_name, agency)

    return {
        "Agency": agency,
        "Person Name": name,
        "LinkedIn Profile": f"https://www.linkedin.com/in/{handle}/",
        "Current Designation": designation,
        "Location": "Bengaluru, Karnataka, India",
        "Recruitment Domain": "Enterprise GCC & Product Tech",
        "Relevant Tech Roles": "Frontend Engineer, React Developer, SDE-2",
        "Associated Companies": "Citi, JPMC, Standard Chartered, Walmart",
        "Connection Status": status,
        "Outreach Type": otype,
        "Personalized Message": msg,
        "Outreach Status": "Sent",
        "Date Contacted": date_contacted,
        "Follow-up Status": "None",
        "Notes": "Verified active tech recruiter; outreach dispatched via Chrome session"
    }


def generate_valid_dataset(count: int = 50, first_degree_per_agency: int = 1) -> List[Dict[str, Any]]:
    """
    Generate a full golden dataset of exactly 50 records:
    10 records for each of the 5 agencies.
    """
    records: List[Dict[str, Any]] = []

    for agency in AGENCIES:
        seeds = RECRUITER_SEEDS[agency]
        for idx, (name, handle, designation) in enumerate(seeds):
            is_1st = (idx < first_degree_per_agency)
            record = generate_valid_record(
                agency=agency,
                name=name,
                handle=handle,
                designation=designation,
                is_first_degree=is_1st
            )
            records.append(record)

    return records[:count]


def mutate_record(record: Dict[str, Any], **kwargs) -> Dict[str, Any]:
    """Return a modified deep copy of a record for negative/boundary testing."""
    mutated = copy.deepcopy(record)
    for k, v in kwargs.items():
        mutated[k] = v
    return mutated


def build_webhook_payload(records: List[Dict[str, Any]], tab_name: str = "Recruiter_Outreach") -> Dict[str, Any]:
    """Convert list of records into Apps Script Webhook payload format."""
    from verify_outreach import OUTREACH_HEADERS
    rows = []
    for r in records:
        rows.append([r.get(header) for header in OUTREACH_HEADERS])
    return {
        "date": tab_name,
        "headers": OUTREACH_HEADERS,
        "rows": rows
    }
