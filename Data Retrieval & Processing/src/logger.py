import logging


logger = logging.getLogger('twitter_stream')
__handler = logging.FileHandler('twitter_stream.log')
__formatter = logging.Formatter('%(asctime)s %(levelname)s %(message)s')


def set_up_logger():
    __handler.setFormatter(__formatter)
    logger.addHandler(__handler)
    logger.setLevel(logging.INFO)


set_up_logger()

