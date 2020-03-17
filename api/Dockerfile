FROM python:3.7-slim-buster

ADD requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY . /app
WORKDIR /app

ENV FLASK_APP=turn_data/app.py
ENV FLASK_DEBUG=1

EXPOSE 5000

ENTRYPOINT ["python"]
CMD ["-m", "flask", "run", "--host=0.0.0.0"]