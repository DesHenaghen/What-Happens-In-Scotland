import datetime

from server import app
from flask import render_template, send_from_directory, jsonify, request
import DatabaseManager as db_man


@app.route('/')
def index():
    """Serve the client-side application."""
    return render_template('index.html')


def parse_twitter_data(tweets):
    values = []
    total = 0
    last_tweet_text = tweets[-1].text if len(tweets) > 0 else ""
    last_tweet_user = tweets[-1].user if len(tweets) > 0 else {}

    epoch = datetime.date.fromtimestamp(0)
    for tweet in tweets:
        values.append({
            'x': (tweet[2] - epoch).total_seconds() * 1000,
            'y': tweet[7]
        })

        total += int(tweet[8])

    return jsonify({
        'values': values,
        'total': total,
        'last_tweet': {
            'text': last_tweet_text,
            'user': last_tweet_user
        }
    })


@app.route('/api/ward_data')
def ward_data():
    tweets = db_man.get_geo_tweets(request.args.get('id')).fetchall()
    return parse_twitter_data(tweets)


@app.route('/api/glasgow_data')
def glasgow_data():
    tweets = db_man.get_glasgow_tweets().fetchall()
    return parse_twitter_data(tweets)


@app.route('/api/<path:api_route>')
def route(api_route):
    print(api_route)
    return 'This api route does not exist'


@app.route('/<path:filename>')
def fallback(filename):
    print(filename)
    return send_from_directory(app.template_folder, filename)
