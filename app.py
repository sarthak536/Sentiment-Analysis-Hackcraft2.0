# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import psycopg2
# from sentiment_analyser import analyze_sentiment as analyze_sentiment

# app = Flask(__name__)
# CORS(app, resources={r"/api/*": {"origins": "*"}})

# # PostgreSQL connection setup
# conn = psycopg2.connect(
#     host="localhost",
#     dbname="Review_system",
#     user="postgres",
#     password="SA@g250804",
#     port="5432"
# )
# cur = conn.cursor()

# # Fetch Laptop data
# @app.route("/api/laptop-data", methods=["GET"])
# def get_laptop_data():
#     cur.execute("SELECT review FROM laptop_reviews LIMIT 5")
#     data = [row[0] for row in cur.fetchall()]
#     return jsonify(data)

# # Fetch Phone data
# @app.route("/api/phone-data", methods=["GET"])
# def get_phone_data():
#     cur.execute("SELECT review FROM phone_reviews LIMIT 5")
#     data = [row[0] for row in cur.fetchall()]
#     return jsonify(data)

# # Fetch Watch data
# @app.route("/api/watch-data", methods=["GET"])
# def get_watch_data():
#     cur.execute("SELECT review FROM watch_reviews LIMIT 5")
#     data = [row[0] for row in cur.fetchall()]
#     return jsonify(data)

# # Analyze sentiment
# @app.route("/api/analyze", methods=["POST"])
# def analyze():
#     data = request.get_json()
#     text = data.get("text", "")
#     sentiment = analyze_sentiment(text)
#     return jsonify({"sentiment": sentiment})

# if __name__ == "__main__":
#     app.run(debug=True)

# app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
from sentiment_analyser import analyze_sentiment
import pandas as pd
from collections import Counter
import os

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

CSV_FILE = "amazon_review.csv"

# -------------------
# Helper Functions
# -------------------

def load_reviews():
    if os.path.exists(CSV_FILE):
        return pd.read_csv(CSV_FILE)
    else:
        return pd.DataFrame(columns=["product", "review", "sentiment", "stars"])

def save_review_to_csv(product, text, sentiment, stars):
    df = load_reviews()
    new_entry = pd.DataFrame([{
        "product": product,
        "review": text,
        "sentiment": sentiment,
        "stars": stars
    }])
    updated_df = pd.concat([df, new_entry], ignore_index=True)
    updated_df.to_csv(CSV_FILE, index=False)

# -------------------
# API Routes
# -------------------

@app.route("/api/analyze", methods=["POST"])
def analyze():
    data = request.get_json()
    text = data.get("text", "")
    product = data.get("product", "laptop").lower()

    result = analyze_sentiment(text)
    sentiment = result["sentiment"]
    stars = result["stars"]

    save_review_to_csv(product, text, sentiment, stars)
    return jsonify(result)

@app.route("/api/top-reviews", methods=["GET"])
def top_reviews():
    product = request.args.get("product", "laptop").lower()
    df = load_reviews()
    filtered = df[df["product"] == product]
    top = filtered.sort_values(by="stars", ascending=False).head(5)
    result = top[["review", "sentiment", "stars"]].to_dict(orient="records")
    return jsonify(result)

@app.route("/api/review-summary", methods=["GET"])
def review_summary():
    product = request.args.get("product", "laptop").lower()
    df = load_reviews()
    filtered = df[df["product"] == product]
    sentiments = filtered["sentiment"]
    count = dict(Counter(sentiments))
    summary = f"{product.title()} review summary: {count}"
    return jsonify({"summary": summary})

if __name__ == "__main__":
    app.run(debug=True)

