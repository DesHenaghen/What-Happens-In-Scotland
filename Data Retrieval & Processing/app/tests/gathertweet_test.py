import pytest
#import sys
#from mock import patch
import DatabaseManager as dbMan
import TwitterManager as twMan
from TwitterAPI import TwitterResponse
from threading import Timer

# Ensure development credentials are used for tests
# noinspection PyUnresolvedReferences
# patch.object(sys, 'argv', ['dev'])

__twitter = twMan.TwitterManager()
connection = __twitter.get_scotland_twitter_stream()


def fail_test():
    assert False


def test_twitter_connection():
    assert type(connection) is TwitterResponse


def test_twitter_fetching():
    Timer(10.0, fail_test).start()
    for tweet in connection:
        assert type(tweet) is dict
        break


def test_database_saving():
    for tweet in connection:
        assert type(dbMan.save_scotland_tweet(tweet).fetchone().id) is int
        break
