# from transformers import AutoTokenizer, AutoModelForSequenceClassification,pipeline 
# from scipy.special import softmax
# import pandas as pd
# import numpy as np
# from tqdm import tqdm
# import psycopg2

# MODEL = "cardiffnlp/twitter-roberta-base-sentiment"
# tokenizer = AutoTokenizer.from_pretrained(MODEL)
# model = AutoModelForSequenceClassification.from_pretrained(MODEL)
# model_pipeline = pipeline("sentiment-analysis", model=model, tokenizer=tokenizer)

# # Connect to PostgreSQL
# try:
#     conn = psycopg2.connect(
#         dbname="Review_system",
#         user="postgres",
#         password="SA@g250804",
#         host="localhost",
#         port="5432"
#     )
#     cursor = conn.cursor()
#     print("Connected to PostgreSQL database!")
# except Exception as e:
#     print(f"Error connecting to PostgreSQL: {e}")
#     exit()

# # Create tables
# cursor.execute("""
# CREATE TABLE IF NOT EXISTS reviews (
#     ID SERIAL PRIMARY KEY,
#     Model_Name TEXT,
#     Customer_Name TEXT,
#     Review TEXT,
#     Ratings INTEGER CHECK (Ratings >= 1 AND Ratings <= 5)
# );
# """)
# cursor.execute("""
# DO $$
# BEGIN
#     IF NOT EXISTS (
#         SELECT 1
#         FROM pg_class c
#         JOIN pg_namespace n ON n.oid = c.relnamespace
#         WHERE c.relname = 'model_idx' AND c.relkind = 'i'
#     ) THEN
#         CREATE INDEX model_idx ON reviews(Model_Name);
#     END IF;
# END $$;
# """)
# conn.commit()

# # Load model and tokenizer
# MODEL = "cardiffnlp/twitter-roberta-base-sentiment"
# tokenizer = AutoTokenizer.from_pretrained(MODEL)
# model = AutoModelForSequenceClassification.from_pretrained(MODEL)

# # Load CSV
# df = pd.read_csv('amazon_review.csv')
# df.columns = df.columns.str.strip().str.lower()
# df = df.rename(columns={
#     'reviewername': 'customer_name',
#     'reviewtext': 'review_text',
#     'overall': 'rating',
#     'summary': 'product_title'
# })

# # Ensure required columns exist
# required_columns = ['product_title', 'customer_name', 'review_text', 'rating']
# if not all(col in df.columns for col in required_columns):
#     print("CSV does not contain the required columns.")
#     exit()

# # Insert reviews into DB and store DB-generated IDs
# print("Inserting reviews into database...")
# db_ids = []
# df = df.dropna(subset=['review_text', 'customer_name', 'product_title', 'rating'])
# for i, row in tqdm(df.iterrows(), total=len(df)):
#     try:
#         if not isinstance(row['review_text'], str) or row['review_text'].strip() == "":
#             continue  # skip invalid reviews
        
#         insert_review = """
#         INSERT INTO reviews (Model_Name, Customer_Name, Review, Ratings)
#         VALUES (%s, %s, %s, %s)
#         RETURNING ID;
#         """
#         cursor.execute(insert_review, (
#             row['product_title'],
#             row['customer_name'],
#             row['review_text'],
#             int(row['rating'])
#         ))
#         review_id = cursor.fetchone()[0]
#         db_ids.append((review_id, row['review_text']))
#         conn.commit()
#     except Exception as e:
#         print("Error inserting review:", e)
#         conn.rollback()


# # Sentiment analysis
# print("Analyzing sentiment...")
# res = {}
# for review_id, text in tqdm(db_ids):
#     try:
#         if not isinstance(text, str):
#             raise ValueError(f"Review text for ID {review_id} is not a string.")
#         encoded_text = tokenizer(text, return_tensors='pt', truncation=True, max_length=512)
#         output = model(**encoded_text)
#         scores = output[0][0].detach().numpy()
#         scores = softmax(scores)
#         res[review_id] = {
#             'roberta_neg': float(scores[0]),
#             'roberta_neu': float(scores[1]),
#             'roberta_pos': float(scores[2])
#         }
#     except Exception as e:
#         print(f"Error processing review ID {review_id}: {e}")
#         continue

# # Create sentiment_results table
# cursor.execute("""
# CREATE TABLE IF NOT EXISTS sentiment_results (
#     review_id INTEGER PRIMARY KEY,
#     roberta_neg FLOAT,
#     roberta_neu FLOAT,
#     roberta_pos FLOAT,
#     FOREIGN KEY (review_id) REFERENCES reviews(ID) ON DELETE CASCADE
# );
# """)
# conn.commit()

# # Insert sentiment results
# print("Inserting sentiment results into database...")
# for review_id, scores in tqdm(res.items()):
#     try:
#         insert_query = """
#         INSERT INTO sentiment_results (review_id, roberta_neg, roberta_neu, roberta_pos)
#         VALUES (%s, %s, %s, %s)
#         ON CONFLICT (review_id) DO NOTHING;
#         """
#         cursor.execute(insert_query, (
#             review_id,
#             scores['roberta_neg'],
#             scores['roberta_neu'],
#             scores['roberta_pos']
#         ))
#         conn.commit()
#     except Exception as e:
#         print(f"Error inserting sentiment for review ID {review_id}: {e}")
#         conn.rollback()

# # Close connection
# cursor.close()
# conn.close()
# print("All data inserted into PostgreSQL and connection closed.")

# def get_star_rating(sentiment):
#     mapping = {
#         "very positive": 5,
#         "positive": 4,
#         "neutral": 3,
#         "negative": 2,
#         "very negative": 1
#     }
#     return mapping.get(sentiment.lower(), 3)

# # Modify your main analyzer to return stars
# # Assuming your function is called analyze_sentiment

# def analyze_sentiment(text):
#     sentiment = classifier(text)  # Your existing prediction logic
#     stars = get_star_rating(sentiment)
#     return {"sentiment": sentiment, "stars": stars}

# sentiment_analyser.py

from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
from scipy.special import softmax
import torch

MODEL = "cardiffnlp/twitter-roberta-base-sentiment"
tokenizer = AutoTokenizer.from_pretrained(MODEL)
model = AutoModelForSequenceClassification.from_pretrained(MODEL)

labels = ['negative', 'neutral', 'positive']

def get_star_rating(label):
    """
    Convert sentiment label to a star rating (1 to 5).

    Parameters:
        label (str): The sentiment label (e.g., 'very positive', 'positive', 'neutral', 'negative', 'very negative').

    Returns:
        int: Corresponding star rating.
            - 'very positive' -> 5 stars
            - 'positive'      -> 4 stars
            - 'neutral'       -> 3 stars
            - 'negative'      -> 2 stars
            - 'very negative' -> 1 star
            - Unknown label   -> 3 stars (default)
    """
    label = label.lower().strip()

    if label == "very positive":
        return 5
    elif label == "positive":
        return 4
    elif label == "neutral":
        return 3
    elif label == "negative":
        return 2
    elif label == "very negative":
        return 1
    else:
        # Fallback to neutral rating if label is unrecognized
        return 3

def analyze_sentiment(text):
    encoded_input = tokenizer(text, return_tensors='pt', truncation=True, max_length=512)
    with torch.no_grad():
        output = model(**encoded_input)
    scores = softmax(output[0][0].numpy())
    max_score_idx = scores.argmax()
    sentiment = labels[max_score_idx]
    stars = get_star_rating(sentiment)
    return {"sentiment": sentiment, "stars": stars}
