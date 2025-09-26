import json
import requests
import datetime

with open("feeds.json") as f:
    feeds = json.load(f)

results = []
for feed in feeds:
    try:
        r = requests.get(feed["url"], timeout=10)
        status = "ok" if r.status_code == 200 else f"HTTP {r.status_code}"
    except Exception as e:
        status = f"error: {e}"

    results.append({
        "channel": feed["channel"],
        "platform": feed["platform"],
        "url": feed["url"],
        "status": status,
        "checked_at": datetime.datetime.utcnow().isoformat()
    })

with open("statuses.json", "w") as f:
    json.dump(results, f, indent=2)

print("Health check complete – statuses.json created!")