import json
import requests
import datetime

try:
    with open("feeds.json") as f:
        feeds = json.load(f)
except FileNotFoundError:
    print("Error: feeds.json not found!")
    exit(1)
except json.JSONDecodeError as e:
    print(f"Error: Invalid JSON in feeds.json - {e}")
    exit(1)

results = []
for feed in feeds:
    url = feed.get("url")
    if isinstance(url, list) and url:  # Handle multi-URL array
        primary_url = url[0]  # Use first as primary
        alt_urls = url[1:] if len(url) > 1 else []
        print(f"Checking primary URL for {feed['channel']}/{feed['platform']}: {primary_url}")
        if alt_urls:
            print(f"Alternatives: {', '.join(alt_urls)}")  # Log for reference
    else:
        primary_url = url  # Backward compat for string URL
        print(f"Checking URL for {feed['channel']}/{feed['platform']}: {primary_url}")

    try:
        r = requests.get(primary_url, timeout=10)
        status = "ok" if r.status_code == 200 else f"HTTP {r.status_code}"
    except Exception as e:
        status = f"error: {e}"

    results.append({
        "channel": feed["channel"],
        "platform": feed["platform"],
        "url": url,  # Keep original (list or string) for reference
        "status": status,
        "checked_at": datetime.datetime.utcnow().isoformat()
    })

with open("statuses.json", "w") as f:
    json.dump(results, f, indent=2)

print("Health check complete – statuses.json created!")
# TODO: For multi-URL: Loop through alts and aggregate statuses if primary fails
