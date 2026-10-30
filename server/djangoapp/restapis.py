import requests
import os

backend_url = os.getenv('backend_url', default="http://localhost:3030")
sentiment_analyzer_url = os.getenv(
    'sentiment_analyzer_url',
    default="https://sentianalyzer.2gk9yqbicdqy.us-south.codeengine.appdomain.cloud/")


def get_request(endpoint, **kwargs):
    params = ""
    if kwargs:
        params = "&".join(f"{k}={v}" for k, v in kwargs.items())
    request_url = backend_url + endpoint + "?" + params
    print("GET from {} ".format(request_url))
    try:
        response = requests.get(request_url)
        return response.json()
    except Exception:
        print("Network exception occurred")


def analyze_review_sentiments(text):
    request_url = sentiment_analyzer_url + "analyze/" + text
    try:
        response = requests.get(request_url)
        return response.json()
    except Exception as err:
        print(f"Unexpected {err=}, {type(err)=}")
        return {"sentiment": "neutral"}


def post_review(data_dict):
    request_url = backend_url + "/insert_review"
    try:
        response = requests.post(request_url, json=data_dict)
        print(response.json())
        return response.json()
    except Exception:
        print("Network exception occurred")
