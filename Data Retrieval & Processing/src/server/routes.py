import datetime

from server import template_dir, get_app_instance, get_socketio_instance
from flask import render_template, send_from_directory, jsonify, request, Blueprint
import DatabaseManager as dbMan

data_routes = Blueprint('data_routes', __name__, template_folder=template_dir)
app = get_app_instance()
socketio = get_socketio_instance()


@data_routes.route('/')
def index():
    """Serve the client-side application."""
    return render_template('index.html')


def parse_twitter_data(tweets):
    values = []
    totals = []
    total = 0
    last_tweet_text = tweets[-1].text if len(tweets) > 0 else ""
    last_tweet_user = tweets[-1].user if len(tweets) > 0 else {}
    last_tweet_words = tweets[-1].text_sentiments if len(tweets) > 0 else []
    last_tweet_scores = tweets[-1].text_sentiment_words if len(tweets) > 0 else []

    epoch = datetime.date.fromtimestamp(0)
    for tweet in tweets:
        values.append({
            'x': (tweet.day - epoch).total_seconds() * 1000,
            'y': tweet.avg_compound
        })

        total += int(tweet.total)
        totals.append(int(tweet.total))

    return {
        'values': values,
        'total': total,
        'totals': totals,
        'last_tweet': {
            'text': last_tweet_text,
            'user': last_tweet_user,
            'words': last_tweet_words,
            'scores': last_tweet_scores
        }
   }


@data_routes.route('/api/all_scotland_district_data')
def all_scotland_district_data():
    # Get parameters from the request
    area_ids = request.args.getlist('ids')
    region = request.args.get('region')

    ids_dict = {}

    # If region data is requested, pop the last id in the list and fetch area data
    if region:
        region_id = area_ids.pop()
        ids_dict[region_id] = parse_twitter_data(dbMan.get_scotland_tweets().fetchall())

    # Get the tweet data for all tweets from the specified area ids
    raw_data = dbMan.get_scotland_district_tweets(area_ids, "area").fetchall()

    # Initialise tweet arrays
    tweet_dict = {}
    for area_id in area_ids:
        tweet_dict[area_id] = []

    # Sort and group tweets by area_id
    for tweet in raw_data:
        tweet_area_id = tweet["area_id"]

        if tweet_area_id:
            tweet_dict[tweet_area_id].append(tweet)

    # Parse twitter data and store to id dictionary
    for key, tweets in tweet_dict.items():
        ids_dict[key] = parse_twitter_data(tweets)

    # Send those bad boys away
    return jsonify(ids_dict)


@data_routes.route('/api/all_scotland_ward_data')
def all_scotland_ward_data():
    # Get parameters from the request
    area_ids = request.args.getlist('ids')
    region = request.args.get('region')

    ids_dict = {}

    # If region data is requested, pop the last id in the list and fetch area data
    if region:
        region_id = area_ids.pop()
        ids_dict[region_id] = parse_twitter_data(dbMan.get_scotland_district_tweets([region_id], "area").fetchall())

    # Get the tweet data for all tweets from the specified area ids
    raw_data = dbMan.get_scotland_district_tweets(area_ids, "ward").fetchall()

    # Initialise tweet arrays
    tweet_dict = {}
    for area_id in area_ids:
        tweet_dict[area_id] = []

    # Sort and group tweets by area_id
    for tweet in raw_data:
        tweet_dict[tweet["ward_id"]].append(tweet)

    # Parse twitter data and store to id dictionary
    for key, tweets in tweet_dict.items():
        ids_dict[key] = parse_twitter_data(tweets)

    # Send those bad boys away
    return jsonify(ids_dict)


@data_routes.route('/api/<path:api_route>')
def route(api_route):
    print(api_route)
    return 'This api route does not exist'


@data_routes.route('/<path:filename>')
def fallback(filename):
    print(filename)
    return send_from_directory(app.template_folder, filename)
