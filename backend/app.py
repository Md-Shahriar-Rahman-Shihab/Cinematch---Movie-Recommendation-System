from flask import Flask, request, jsonify
from flask_cors import CORS

import pickle
import requests
from concurrent.futures import ThreadPoolExecutor

app = Flask(__name__)

CORS(app)


# =========================
# TMDB API KEY
# =========================

TMDB_API_KEY = "279e07aefbd457bcab619023cc35d00d"


# =========================
# LOAD MODEL FILES
# =========================

movies = pickle.load(
    open("movies.pkl", "rb")
)

similarity = pickle.load(
    open("similarity.pkl", "rb")
)


# =========================
# FETCH MOVIE POSTER
# =========================

import re

def fetch_poster(movie_name):
    try:
        # "Avatar (2009)" → clean_name="Avatar", year="2009"
        match = re.match(r"^(.*?)\s*\((\d{4})\)\s*$", movie_name.strip())
        if match:
            clean_name = match.group(1).strip()
            year = match.group(2)
        else:
            clean_name = movie_name.strip()
            year = ""

        url = (
            f"https://api.themoviedb.org/3/search/movie"
            f"?api_key={TMDB_API_KEY}"
            f"&query={clean_name}"
            f"&language=en-US"
            + (f"&year={year}" if year else "")
        )

        response = requests.get(url, timeout=5)
        data = response.json()

        if "results" in data and len(data["results"]) > 0:
            for result in data["results"]:
                poster_path = result.get("poster_path")
                if poster_path:
                    return "https://image.tmdb.org/t/p/w500" + poster_path

        return None

    except Exception as e:
        print(e)
        return None

# =========================
# RECOMMEND FUNCTION
# =========================

def recommend(movie_name):

    matched_movies = movies[
        movies["title"]
        .str.lower()
        .str.contains(
            movie_name.lower(),
            na=False,
            regex=False
        )
    ]

    if matched_movies.empty:

        return []

    movie_index = matched_movies.index[0]

    distances = similarity[movie_index]

    movie_list = sorted(
        list(enumerate(distances)),
        reverse=True,
        key=lambda x: x[1]
    )[1:6]

    titles = [
        movies.iloc[m[0]].title
        for m in movie_list
    ]

    with ThreadPoolExecutor(max_workers=5) as executor:

        posters = list(
            executor.map(fetch_poster, titles)
        )

    recommendations = [
        {"title": title, "poster": poster}
        for title, poster in zip(titles, posters)
    ]

    return recommendations


# =========================
# RECOMMEND API
# =========================

@app.route(
    "/recommend",
    methods=["POST"]
)

def recommend_movies():

    data = request.get_json()

    movie = data["movie"]

    recommendations = recommend(movie)

    return jsonify(
        recommendations
    )


# =========================
# SEARCH API
# =========================

@app.route(
    "/search",
    methods=["GET"]
)

def search_movies():

    query = request.args.get(
        "query",
        ""
    )

    matched_movies = movies[
        movies["title"]
        .str.lower()
        .str.contains(
            query.lower(),
            na=False,
            regex=False
        )
    ]["title"].head(5)

    return jsonify(
        matched_movies.tolist()
    )


# =========================
# RUN SERVER
# =========================

if __name__ == "__main__":

    app.run(debug=True)