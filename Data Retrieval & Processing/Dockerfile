# gunicorn-flask

FROM python:3
MAINTAINER Desmond Henaghen <deshenaghen@tuta.io>

ENV DEBIAN_FRONTEND noninteractive

# Add the PostgreSQL PGP key to verify their Debian packages.
# It should be the same key as https://www.postgresql.org/media/keys/ACCC4CF8.asc
RUN apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys B97B0AFCAA1A47F044F244A07FCC7D46ACCC4CF8

# Add PostgreSQL's repository. It contains the most recent stable release
#     of PostgreSQL, ``9.3``.
RUN echo "deb http://apt.postgresql.org/pub/repos/apt/ precise-pgdg main" > /etc/apt/sources.list.d/pgdg.list

# Install ``python-software-properties``, ``software-properties-common`` and PostgreSQL 9.3
#  There are some warnings (in red) that show up during the build. You can hide
#  them by prefixing each apt-get statement with DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y python3-dev postgresql postgresql-contrib python3-psycopg2 libpq-dev postgresql-server-dev-9.3 python-software-properties software-properties-common postgresql-9.3 postgresql-client-9.3 postgresql-contrib-9.3

# Note: The official Debian and Ubuntu images automatically ``apt-get clean``
# after each ``apt-get``


RUN apt-get update
RUN apt-get install -y python3 python3-pip python-virtualenv

# Setup flask application
RUN mkdir -p /deploy/app
COPY gunicorn_config.py /deploy/gunicorn_config.py
COPY app /deploy/app
RUN pip3 install pathlib gunicorn --src /usr/local/src
RUN pip3 install -r /deploy/app/requirements.txt --src /usr/local/src
WORKDIR /deploy/app

EXPOSE 8080

# Start gunicorn
CMD ["gunicorn", "--preload", "-k", "geventwebsocket.gunicorn.workers.GeventWebSocketWorker", "--config", "/deploy/gunicorn_config.py", "application"]
