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

    epoch = datetime.date.fromtimestamp(0)
    for tweet in tweets:
        values.append({
            'x': (tweet[2] - epoch).total_seconds() * 1000,
            'y': tweet[7]
        })

        total += int(tweet[8])
        totals.append(int(tweet[8]))

    return jsonify({
        'values': values,
        'total': total,
        'totals': totals,
        'last_tweet': {
            'text': last_tweet_text,
            'user': last_tweet_user
        }
    })


@data_routes.route('/api/glasgow_district_data')
def glasgow_district_data():
    tweets = dbMan.get_glasgow_geo_tweets(request.args.get('id')).fetchall()
    return parse_twitter_data(tweets)


@data_routes.route('/api/glasgow_data')
def glasgow_data():
    tweets = dbMan.get_glasgow_tweets().fetchall()
    return parse_twitter_data(tweets)


@data_routes.route('/api/scotland_district_data')
def scotland_district_data():
    tweets = dbMan.get_scotland_geo_tweets(request.args.get('id')).fetchall()
    return parse_twitter_data(tweets)


@data_routes.route('/api/scotland_data')
def scotland_data():
    tweets = dbMan.get_scotland_tweets().fetchall()
    return parse_twitter_data(tweets)


@data_routes.route('/api/<path:api_route>')
def route(api_route):
    print(api_route)
    return 'This api route does not exist'


@data_routes.route('/<path:filename>')
def fallback(filename):
    print(filename)
    return send_from_directory(app.template_folder, filename)
