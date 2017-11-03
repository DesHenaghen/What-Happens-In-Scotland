import json
import logging
from TwitterAPI import TwitterAPI
api = TwitterAPI("YEzxsl5oNKfyYN4QPnRjJOtly", "sdB9kCZGpJ2WHSHowzI3u42dsvcLje8AXrcy1Po4a5x4kH4EzE", "924952244293955584-fvogKvX6SWdVoaZYqhvDAGgHPcVaG9c", "rvIKixbkoziz9fqSqDa1oa5bQ1okjXM7xJ9z2JqjImf0H")
# Search for tweets in Glasgow
r = api.request('statuses/filter', {'locations':'-4.360199,55.845440,-4.183044,55.881275'})
for item in r:
    if (item.get("coordinates")):
        print(json.dumps(item, indent=4))
    else:
        print("No Coordinates!!")
    if (item.get("text")):
        print(json.dumps(item["text"]))
