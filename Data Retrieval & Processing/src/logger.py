import logging


logger = logging.getLogger('twitter_stream')
handler = logging.FileHandler('twitter_stream.log')
formatter = logging.Formatter('%(asctime)s %(levelname)s %(message)s')


def set_up_logger():
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    logger.setLevel(logging.INFO)


set_up_logger()

