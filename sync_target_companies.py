#!/usr/bin/env python3
"""
sync_target_companies.py

Synchronizes the curated dataset of verified product companies into Google Sheets
via the Google Apps Script Webhook.

Target Sheet / Tab: "Target Companies"
Spreadsheet ID: 1MUUvv4eULJP0uvcFAPoGP_B1y0AXyL0vhkTHoN1z_Po
Config: tracker_config.json
"""

import sys
import os
import json
import argparse
import urllib.request
import urllib.error

DEFAULT_WEBHOOK_URL = (
    "https://script.google.com/macros/s/AKfycby7GvgtNlJoIVL6L-OR2la73FMh3u_VqxKQgDV4wGRDHd8HiKoQSxfFM9NOoEkxwmDMwA/exec"
)

class PostRedirectHandler(urllib.request.HTTPRedirectHandler):
    """
    Handles HTTP 302 redirects from Google Apps Script while preserving User-Agent.
    Google Apps Script redirects POST to a temporary URL on script.googleusercontent.com.
    """
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return urllib.request.Request(
            newurl,
            headers={"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"}
        )

def load_config(config_path="tracker_config.json"):
    if os.path.exists(config_path):
        with open(config_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

def push_target_companies(json_path="target_companies.json", config_path="tracker_config.json"):
    print(f"Loading target companies dataset from: {json_path}")
    if not os.path.exists(json_path):
        raise FileNotFoundError(f"Dataset file not found: {json_path}")

    with open(json_path, "r", encoding="utf-8") as f:
        payload = json.load(f)

    # Validate structure
    assert "headers" in payload, "Missing 'headers' in dataset JSON"
    assert "rows" in payload, "Missing 'rows' in dataset JSON"
    tab_name = payload.get("date", "Target Companies")
    headers = payload["headers"]
    rows = payload["rows"]

    print(f"Dataset verified: tab='{tab_name}', headers={len(headers)}, rows={len(rows)}")

    config = load_config(config_path)
    webhook_url = config.get("apps_script_webhook_url", DEFAULT_WEBHOOK_URL)
    print(f"Target Webhook URL: {webhook_url}")

    request_payload = {
        "date": tab_name,
        "headers": headers,
        "rows": rows
    }
    encoded_data = json.dumps(request_payload).encode("utf-8")

    opener = urllib.request.build_opener(PostRedirectHandler)
    req = urllib.request.Request(
        webhook_url,
        data=encoded_data,
        headers={
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
        }
    )

    print(f"Dispatching HTTP POST with {len(rows)} company rows to Google Sheets...")
    try:
        with opener.open(req, timeout=60) as resp:
            response_code = resp.getcode()
            response_body = resp.read().decode("utf-8")
            print(f"HTTP Status: {response_code}")
            print(f"Response Body: {response_body}")
            print("Successfully synchronized Target Companies to Google Sheets!")
            return {
                "status": "success",
                "code": response_code,
                "response": response_body,
                "rows_synced": len(rows)
            }
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8", errors="replace")
        print(f"HTTP Error {e.code}: {e.reason} - {error_body}", file=sys.stderr)
        raise
    except Exception as e:
        print(f"Network error during sync: {e}", file=sys.stderr)
        raise

def main():
    parser = argparse.ArgumentParser(description="Synchronize target companies to Google Sheets.")
    parser.add_argument("--file", default="target_companies.json", help="Path to target_companies.json")
    parser.add_argument("--config", default="tracker_config.json", help="Path to tracker_config.json")
    args = parser.parse_args()

    try:
        push_target_companies(args.file, args.config)
        sys.exit(0)
    except Exception as e:
        print(f"Failed to synchronize target companies: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
