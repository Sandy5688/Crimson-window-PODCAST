Podcast Feed Health Checker
============================

Files Included:
1. PODCAST HEALTH FOLDER.json  -> List of all channels/platforms/feeds.
2. check_feeds.py -> Python script to run the health check.

How to Use on MacBook:
----------------------
1. Install Python dependencies:
   pip3 install requests

2. Run the checker:
   python3 check_feeds.py

3. Results:
   - statuses.json will be created showing each feed's live status (ok or error).

Notes:
------
- Ensure 'feeds.json' and 'check_feeds.py' are in the same folder when running the command.
- Feeds are checked via HTTP GET with a 10-second timeout.
