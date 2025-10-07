# Remove the incorrect file
rm check_status.py

# Create the correct Python file
cat > check_status.py << 'EOF'
#!/usr/bin/env python3
"""
Background job to check podcast feed statuses
Reads feeds.json and updates statuses.json
"""

import json
import requests
from datetime import datetime
import time

def check_feed_status(feed_url):
    """Check if a podcast feed is accessible"""
    try:
        response = requests.head(feed_url, timeout=10, allow_redirects=True)
        return {
            "status": "active" if response.status_code == 200 else "error",
            "status_code": response.status_code
        }
    except requests.exceptions.Timeout:
        return {"status": "timeout", "status_code": None}
    except requests.exceptions.RequestException as e:
        return {"status": "error", "status_code": None, "error": str(e)}

def main():
    print("Starting status check...")
    
    # Read feeds
    try:
        with open('feeds.json', 'r') as f:
            feeds = json.load(f)
    except FileNotFoundError:
        print("Error: feeds.json not found")
        return
    except json.JSONDecodeError:
        print("Error: feeds.json is not valid JSON")
        return
    
    # Check each feed
    statuses = []
    for feed in feeds:
        channel = feed.get('channel')
        feed_url = feed.get('feed')
        
        if not channel or not feed_url:
            continue
        
        print(f"Checking {channel}...")
        result = check_feed_status(feed_url)
        
        statuses.append({
            "channel": channel,
            "status": result["status"],
            "status_code": result.get("status_code"),
            "checked_at": datetime.utcnow().isoformat() + "Z"
        })
        
        # Be nice to servers
        time.sleep(0.5)
    
    # Write statuses
    try:
        with open('statuses.json', 'w') as f:
            json.dump(statuses, f, indent=2)
        print(f"Successfully updated {len(statuses)} statuses")
    except Exception as e:
        print(f"Error writing statuses.json: {e}")

if __name__ == "__main__":
    main()
EOF

# Make it executable
chmod +x check_status.py

# Install required package
pip3 install requests

# Test it
python3 check_status.py