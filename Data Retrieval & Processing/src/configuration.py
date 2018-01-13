import sys


class Config:
    def generate_connection_string(self):
        return "postgresql://{}:{}@{}:{}/{}"\
            .format(
                self.PSQL_USERNAME,
                self.PSQL_PASSWORD,
                self.PSQL_HOSTNAME,
                self.PSQL_PORT,
                self.PSQL_DATABASE
            )


class DevelopmentConfig(Config):
    DEBUG = True

    PSQL_USERNAME = 'postgres'
    PSQL_PASSWORD = 'postgres'
    PSQL_HOSTNAME = 'localhost'
    PSQL_PORT = '5432'
    PSQL_DATABASE = 'tweets'

    CONSUMER_KEY = 'YEzxsl5oNKfyYN4QPnRjJOtly'
    CONSUMER_SECRET = 'sdB9kCZGpJ2WHSHowzI3u42dsvcLje8AXrcy1Po4a5x4kH4EzE'
    ACCESS_TOKEN_KEY = '924952244293955584-fvogKvX6SWdVoaZYqhvDAGgHPcVaG9c'
    ACCESS_TOKEN_SECRET = 'rvIKixbkoziz9fqSqDa1oa5bQ1okjXM7xJ9z2JqjImf0H'


class ProductionConfig(Config):
    DEBUG = False

    PSQL_USERNAME = 'whig'
    PSQL_PASSWORD = '382FkjBoQPfk'
    PSQL_HOSTNAME = 'whathappensinglasgow.cszk7qzakguv.eu-west-2.rds.amazonaws.com'
    PSQL_PORT = '5432'
    PSQL_DATABASE = 'tweets'

    CONSUMER_KEY = 'MIg081jkp7Ygh0TFl4D90Dr8W'
    CONSUMER_SECRET = '6UASMZoKUHI07SS6e6F9pXtGpODNZe8yoDNuwYfrzZU78AOX5G'
    ACCESS_TOKEN_KEY = '924952244293955584-CyeEIdTVybmwwpE6jH25KgciahTpz2S'
    ACCESS_TOKEN_SECRET = 'ggQSp6fdat3vGVe4MYnnvR4LBmQanYcMGhFW1E3lRrGnt'


if 'dev' in sys.argv:
    config = DevelopmentConfig()
else:
    config = ProductionConfig()


def get_config():
    return config
