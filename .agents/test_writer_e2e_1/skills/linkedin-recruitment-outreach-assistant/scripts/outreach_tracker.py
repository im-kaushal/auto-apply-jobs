import json
import urllib.request
import sys

WEBHOOK_URL = "https://script.google.com/macros/s/AKfycby7GvgtNlJoIVL6L-OR2la73FMh3u_VqxKQgDV4wGRDHd8HiKoQSxfFM9NOoEkxwmDMwA/exec"

OUTREACH_HEADERS = [
    "Agency",
    "Person Name",
    "LinkedIn Profile",
    "Current Designation",
    "Location",
    "Recruitment Domain",
    "Relevant Tech Roles",
    "Associated Companies",
    "Connection Status",
    "Outreach Type",
    "Personalized Message",
    "Outreach Status",
    "Date Contacted",
    "Follow-up Status",
    "Notes"
]

class PostRedirectHandler(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return urllib.request.Request(newurl, headers={'User-Agent': 'Mozilla/5.0'})

def push_outreach_records(records, tab_name="Recruiter_Outreach"):
    opener = urllib.request.build_opener(PostRedirectHandler)
    payload = {
        "date": tab_name,
        "headers": OUTREACH_HEADERS,
        "rows": records
    }
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(
        WEBHOOK_URL,
        data=data,
        headers={'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'}
    )
    with opener.open(req, timeout=45) as resp:
        result = resp.read().decode('utf-8')
        print(f"Spreadsheet updated successfully: {result}")
        return result

if __name__ == "__main__":
    print("Outreach tracker utility ready.")
