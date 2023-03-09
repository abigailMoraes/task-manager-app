FROM python:3

ENV PYTHONUNBUFFERED 1

RUN mkdir /code

WORKDIR /code

COPY requirements.txt /code/

RUN pip install --upgrade pip

RUN pip install -r requirements.txt

COPY . /code/

FROM library/postgres

COPY init.sql /docker-entrypoint-initdb.d/

EXPOSE 80
