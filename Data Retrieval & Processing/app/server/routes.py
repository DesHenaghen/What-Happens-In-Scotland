import datetime
import json
import string
import decimal

from sqlalchemy.exc import OperationalError

from server import get_app_instance, get_socketio_instance
from flask import render_template, send_from_directory, jsonify, request, Blueprint
import DatabaseManager as dbMan
from collections import deque
from many_stop_words import get_stop_words

__stop_words = list(get_stop_words('en'))  # About 900 stopwords
__nltk_words = ['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now']
__stop_words.extend(__nltk_words)
__translation = str.maketrans("", "", string.punctuation)


data_routes = Blueprint('data_routes', __name__)
app = get_app_instance()
socketio = get_socketio_instance()


class InvalidUsage(Exception):
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        rv['status_code'] = self.status_code
        return rv


def filterstopwords(words):
    return list(
        filter(
            lambda word: word is not None
                         and word.split(',')[0].translate(__translation) not in __stop_words
                         and (len(word.split(',')[0].strip()) > 1)
                         and not word.split(',')[0].isspace(), words
        )
    )


def alchemyencoder(obj):
    """JSON encoder function for SQLAlchemy special classes."""
    if isinstance(obj, datetime.date):
        return obj.isoformat()
    elif isinstance(obj, decimal.Decimal):
        return float(obj)


@app.errorhandler(InvalidUsage)
def handle_invalid_usage(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response


@data_routes.route('/')
def index():
    """Serve the client-side application."""
    return render_template('index.html')


def convert_score_to_percentage(score):
    return (score + 1) * 50


def parse_twitter_data(tweets, date, period):
    start_date = datetime.datetime.strptime(date, '%Y-%m-%d %H') - datetime.timedelta(days=(int(period)-1))
    totals = {}
    values = {}
    while start_date <= datetime.datetime.strptime(date, '%Y-%m-%d %H'):
        values[start_date.strftime('%Y-%m-%d %H')] = {'x': start_date.timestamp() * 1000, 'y': 50}
        totals[start_date.strftime('%Y-%m-%d %H')] = 0
        start_date += datetime.timedelta(hours=1)

    total = 0
    last_tweet_text = format_html_text(tweets[-1])['text'] if len(tweets) > 0 else ""
    last_tweet_user = tweets[-1].user if len(tweets) > 0 else {}
    last_tweet_words = tweets[-1].text_sentiments if (len(tweets) > 0 and tweets[-1].text_sentiments is not None) else []
    last_tweet_scores = tweets[-1].text_sentiment_words if (len(tweets) > 0 and tweets[-1].text_sentiment_words is not None) else []
    last_tweet_score = convert_score_to_percentage(tweets[-1].compound_sent) if (len(tweets) > 0 and tweets[-1].compound_sent is not None) else 50

    for i, tweet in enumerate(tweets):
        values[tweet.day.strftime('%Y-%m-%d %H')] = {
            'x': tweet.day.timestamp() * 1000,
            'y': convert_score_to_percentage(tweet.avg_compound)
        }

        total += int(tweet.total)
        totals[tweet.day.strftime('%Y-%m-%d %H')] = int(tweet.total)

    return {
        'values': [v for k, v in values.items()],
        'total': total,
        'totals': [v for k, v in totals.items()],
        'last_tweet': {
            'score': last_tweet_score,
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
    date = request.args.get('date')
    period = request.args.get('period')

    ids_dict = {}

    try:
        # If region data is requested, pop the last id in the list and fetch area data
        if region:
            region_id = area_ids.pop()
            ids_dict[region_id] = parse_twitter_data(dbMan.get_scotland_tweets(date, period).fetchall(), date, period)

        # Get the tweet data for all tweets from the specified area ids
        raw_data = dbMan.get_scotland_district_tweets(area_ids, "area", date, period).fetchall()
    except Exception:
        raise InvalidUsage('Error occurred when fetching data from the database', status_code=500)

    try:
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
            ids_dict[key] = parse_twitter_data(tweets, date, period)
    except Exception:
        raise InvalidUsage('Somehow crashed when processing database results', status_code=418)

    # Send those bad boys away
    return jsonify(ids_dict)


@data_routes.route('/api/all_scotland_ward_data')
def all_scotland_ward_data():
    # Get parameters from the request
    area_ids = request.args.getlist('ids')
    region = request.args.get('region')
    date = request.args.get('date')
    period = request.args.get('period')

    ids_dict = {}

    try:
        # If region data is requested, pop the last id in the list and fetch area data
        if region:
            region_id = area_ids.pop()
            ids_dict[region_id] = parse_twitter_data(
                dbMan.get_scotland_district_tweets([region_id], "area", date, period).fetchall(),
                date,
                period
            )

        # Get the tweet data for all tweets from the specified area ids
        raw_data = dbMan.get_scotland_district_tweets(area_ids, "ward", date, period).fetchall()
    except Exception:
        raise InvalidUsage('Error occurred when fetching data from the database', status_code=500)

    try:
        # Initialise tweet arrays
        tweet_dict = {}
        for area_id in area_ids:
            tweet_dict[area_id] = []

        # Sort and group tweets by area_id
        for tweet in raw_data:
            if tweet["ward_id"] is not None:
                tweet_dict[tweet["ward_id"]].append(tweet)

        # Parse twitter data and store to id dictionary
        for key, tweets in tweet_dict.items():
            ids_dict[key] = parse_twitter_data(tweets, date, period)
    except Exception:
        raise InvalidUsage('Somehow crashed when processing database results', status_code=418)

    # Send those bad boys away
    return jsonify(ids_dict)


@data_routes.route('/api/common_words')
def get_common_words():
    # Get parameters from the request
    area_ids = request.args.getlist('ids')
    group = request.args.get('group')
    date = request.args.get('date')
    period = request.args.get('period')
    region = request.args.get('region')
    region_id = request.args.getlist('region_id')

    ids_dict = {}
    ids_dict['region'] = {}

    try:
        rawData = dbMan.get_scotland_district_common_words(area_ids, group, date, period).fetchall()

        if region and len(region_id) > 0:
            regionData = dbMan.get_scotland_district_common_words(region_id, 'area', date, period).fetchall()
            for row in regionData:
                word_arr = filterstopwords(row.word_arr
                                                     if row is not None and row.word_arr is not None
                                                     else [])

                ids_dict['region']["%.0f" % (row.hour.timestamp() * 1000)] = word_arr

        elif region:
            regionData = dbMan.get_scotland_common_words(date, period).fetchall()
            for row in regionData:
                word_arr = filterstopwords(row.word_arr if row is not None else [])
                ids_dict['region']["%.0f" % (row.hour.timestamp() * 1000)] = word_arr

    except Exception:
        raise InvalidUsage('Encountered an error fetching data from the database', status_code=500)

    try:
        for row in rawData:
            print(row.group_id, row.hour)
            if row.group_id not in ids_dict:
                ids_dict[row.group_id] = {}

            ids_dict[row.group_id]["%.0f" % (row.hour.timestamp() * 1000)] = filterstopwords(row.word_arr if row.word_arr is not None else [])

    except Exception as e:
        raise InvalidUsage('Failed to format the database data', status_code=418)

    return jsonify(ids_dict)


@data_routes.route('/api/districts_tweets')
def get_districts_tweets():
    date = request.args.get('date')

    try:
        tweets = dbMan.get_districts_tweets(date).fetchall()
    except Exception:
        raise InvalidUsage("Encountered an error fetching the data from the database", status_code=500)

    try:
        json_tweets = list(map(format_html_text, tweets))
        json_tweets = json.dumps([dict(r) for r in json_tweets], default=alchemyencoder)
    except Exception:
        raise InvalidUsage('Could not format twitter data', status_code=418)

    return json_tweets


def format_html_text(r):
    row = dict(r)
    sentiment = deque(row['text_sentiments'] if row['text_sentiments'] else [])
    words = deque(row['text_sentiment_words'] if row['text_sentiment_words'] else [])
    word_array = row['text'].split(' ')
    score_key = 'score' if 'score' in row else 'avg_compound'
    row[score_key] = convert_score_to_percentage(row[score_key] if row[score_key] is not None else 0)
    row['text'] = " ".join(list(map((lambda x: format_word(x, sentiment, words)), word_array)))

    del row['text_sentiments']
    del row['text_sentiment_words']

    return row


def format_word(word, sentiment, words):
    if len(words) > 0 and word.lower().startswith(words[0]):
        score = sentiment.popleft()
        words.popleft()

        if score > 0:
            word = "<span class='good_word'>" + word + "</span>"
        elif score < 0:
            word = "<span class='bad_word'>" + word + "</span>"

    return word


@data_routes.route('/api/<path:api_route>')
def route(api_route):
    raise InvalidUsage('This api route does not exist', status_code=404)


@data_routes.route('/<path:filename>')
def fallback(filename):
    # print(filename)
    return send_from_directory(app.template_folder, filename)
