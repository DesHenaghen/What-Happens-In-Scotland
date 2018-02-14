import sqlalchemy
from sqlalchemy import Column, Text, Integer, REAL, DateTime, select, text
from sqlalchemy.dialects.postgresql import JSONB, ARRAY
from datetime import datetime, timedelta
from server import get_socketio_instance
import logger as log
import configuration
from SentimentAnalyser import SentimentAnalyser

__socketio = get_socketio_instance()

__config = configuration.get_config()
__connection_string = __config.generate_connection_string()
print(__connection_string)

__analyser = SentimentAnalyser()

__db = sqlalchemy.create_engine(__connection_string)
__engine = __db.connect()
__meta = sqlalchemy.MetaData(__engine)

# Define table schemas
__scotland_tweets = sqlalchemy.Table("scotland_tweets", __meta,
                                     Column('id', Integer, primary_key=True),
                                     Column('place', JSONB),
                                     Column('text', Text),
                                     Column('date', DateTime),
                                     Column('user', JSONB),
                                     Column('neg_sent', REAL),
                                     Column('neu_sent', REAL),
                                     Column('pos_sent', REAL),
                                     Column('compound_sent', REAL),
                                     Column('text_sentiments', ARRAY(REAL)),
                                     Column('text_sentiment_words', ARRAY(Text)),
                                     Column('area_id', Text),
                                     Column('ward_id', Text),
                                     Column('coordinates', Text))

# Creates tables if they don't already exist
__meta.create_all()


def save_scotland_tweet(tweet):
    if 'extended_tweet' in tweet:
        full_text = tweet.get('extended_tweet').get('full_text')
    else:
        full_text = tweet.get('text')

    # Tweet date & time
    float_ts = int(tweet.get('timestamp_ms')) / 1000
    date = datetime.fromtimestamp(float_ts)

    # Tweet sentiment scores
    scores = __analyser.calculate_sentiment_scores(full_text)
    sentiment_words = __analyser.get_sentiment_words(full_text)
    sentiment_word_scores = __analyser.get_sentiment_word_scores(full_text)

    if tweet.get('coordinates'):
        coord_array = tweet.get("coordinates").get("coordinates")
        coord_string = "(" + str(coord_array[1]) + "," + str(coord_array[0]) + ")"
        wkt_coords = "POINT(" + str(coord_array[0]) + " " + str(coord_array[1]) + ")"
    else:
        coord_string = None
        coord_array = tweet.get("place").get("bounding_box").get("coordinates")[0]

        if tweet.get('place').get('name') != 'Scotland':
            wkt_coords = 'POLYGON((' + ', '.join(map(lambda x: str(x[0]) + " " + str(x[1]), coord_array)) + ', ' + str(
                coord_array[0][0]) + ' ' + str(coord_array[0][1]) + '))'
        else:
            wkt_coords = None

    try:
        area_id = __engine.execute(
            text("select id " +
                 "from scotland_districts " +
                 "where ST_Contains(area, ST_Centroid(ST_GeomFromText('" + wkt_coords + "', 4326)))")
        ).fetchone()[0]
    except TypeError as e:
        area_id = None

    if coord_string is not None:
        try:
            ward_id = __engine.execute(
                text("select id " +
                     "from scotland_wards " +
                     "where ST_Contains(area, ST_Centroid(ST_GeomFromText('" + wkt_coords + "', 4326)))")
            ).fetchone()[0]
        except TypeError as e:
            ward_id = None
    else:
        ward_id = None

    if area_id is not None:
        __socketio.emit('district_geo_tweet', {
            'text': full_text,
            'user': tweet.get("user"),
            'ward': area_id,
            'coordinates': coord_array,
            'score': scores.get('compound'),
            'text_sentiments': sentiment_word_scores,
            'text_sentiment_words': sentiment_words
        })

    if ward_id is not None:
        __socketio.emit('ward_geo_tweet', {
            'text': full_text,
            'user': tweet.get("user"),
            'ward': ward_id,
            'coordinates': coord_array,
            'score': scores.get('compound'),
            'text_sentiments': sentiment_word_scores,
            'text_sentiment_words': sentiment_words
        })

    statement = __scotland_tweets.insert().values(
        place=tweet.get("place"),
        text=full_text,
        date=date,
        coordinates=coord_string,
        user=tweet.get("user"),
        neg_sent=scores.get('neg'),
        neu_sent=scores.get('neu'),
        pos_sent=scores.get('pos'),
        compound_sent=scores.get('compound'),
        text_sentiments=sentiment_word_scores,
        text_sentiment_words=sentiment_words,
        area_id=area_id,
        ward_id=ward_id
    )

    __engine.execute(statement)

    # logger.info(json.dumps(tweet, indent=4, sort_keys=True))
    log.logger.info("added to scotland_tweets")
    # print("added to scotland tweets")
    # print(tweet)


def get_scotland_district_tweets(area_ids, group):
    start_date = datetime.now() - timedelta(days=14)

    sql = text("""
      SELECT t.text, t.user, x.day, x.avg_neg, x.avg_neu, x.avg_neg, x.avg_pos, x.avg_compound, x.total, t.text_sentiments,
      t.text_sentiment_words, t.{0}_id , y.word_arr
      FROM scotland_tweets as t 
        INNER JOIN ( 
          SELECT t.area_id, array_agg(word ||', ' || word_ct::text) word_arr 
          FROM ( 
            SELECT area_id, word, count(*) word_ct
            FROM   scotland_tweets, unnest(text_sentiment_words, text_sentiments) AS u(word, word_score)
            WHERE  word_score != 0 AND date > {1}
            GROUP  BY word, area_id
            ORDER  BY area_id, count(*) DESC, word
          ) t
        GROUP BY t.area_id
       ) as y ON t.area_id = y.area_id
       
         INNER JOIN (
            SELECT date::date as day, MAX(date) as max_date, AVG(neg_sent) as avg_neg, AVG(neu_sent) as avg_neu,
              AVG(pos_sent) as avg_pos, AVG(compound_sent) as avg_compound, COUNT(*) as total
            FROM scotland_tweets
            WHERE {0}_id = ANY(:ids)
            AND date >= {1}
            GROUP by day, {0}_id 
            ORDER BY day ASC
           ) as x ON t.date = x.max_date
        ORDER BY x.day ASC;
        """.format(group, "'" + start_date.strftime('%Y-%m-%d') + "'")
    )

    return __engine.execute(sql, {'ids': area_ids})


def get_scotland_tweets():
    start_date = datetime.now() - timedelta(days=14)

    sql = text("""
      SELECT t.text, t.user, x.day, x.avg_neg, x.avg_neu, x.avg_neg, x.avg_pos, x.avg_compound, x.total, t.text_sentiments,
      t.text_sentiment_words, y.word_arr
      FROM scotland_tweets as t 
        INNER JOIN ( 
          SELECT array_agg(word ||', ' || word_ct::text) word_arr 
          FROM ( 
            SELECT word, count(*) word_ct
            FROM   scotland_tweets, unnest(text_sentiment_words, text_sentiments) AS u(word, word_score)
            WHERE  word_score != 0 AND date > {0}
            GROUP  BY word
            ORDER  BY count(*) DESC, word
          ) t
      ) as y ON t.id = t.id
       
         INNER JOIN (
            SELECT date::date as day, MAX(date) as max_date, AVG(neg_sent) as avg_neg, AVG(neu_sent) as avg_neu,
              AVG(pos_sent) as avg_pos, AVG(compound_sent) as avg_compound, COUNT(*) as total
            FROM scotland_tweets
            WHERE area_id IS NOT NULL
            AND date >= {0}
            GROUP by day
            ORDER BY day DESC
         ) as x ON t.date = x.max_date
      ORDER BY x.day DESC;
      """.format("'" + start_date.strftime('%Y-%m-%d') + "'")
   )

    return __engine.execute(sql)


def get_all_scotland_tweets():
    return select([
        __scotland_tweets.c.id,
        __scotland_tweets.c.text,
        __scotland_tweets.c.timestamp
    ]).execute()


def __update_tweets_sentiment(table, tweet_id, sentiment, date):
    table.update() \
        .values(
        neg_sent=sentiment.get('neg'),
        neu_sent=sentiment.get('neu'),
        pos_sent=sentiment.get('pos'),
        compound_sent=sentiment.get('compound'),
        date=date
    ).where(table.c.id == tweet_id).execute()


def update_scotland_tweets_sentiment(tweet_id, sentiment, date):
    __update_tweets_sentiment(__scotland_tweets, tweet_id, sentiment, date)
