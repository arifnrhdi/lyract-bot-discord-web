import os
from urllib.parse import urlencode

from flask import Flask, g, redirect, render_template, request

from translations import TRANSLATIONS

app = Flask(__name__)


@app.before_request
def select_language():
    g.lang = request.args.get("lang", "id")
    if g.lang not in TRANSLATIONS:
        g.lang = "id"


@app.url_defaults
def preserve_language(endpoint, values):
    # shortcut: language stays in the URL, add a cookie if direct visits should remember it.
    if endpoint != "static":
        values.setdefault("lang", g.lang)


@app.context_processor
def add_translations():
    return {"lang": g.lang, "t": TRANSLATIONS[g.lang]}


@app.get("/")
def home():
    return render_template("home.html")


@app.get("/commands")
def commands():
    return render_template("commands.html")


@app.get("/guide")
def guide():
    return render_template("guide.html")


@app.get("/about")
def about():
    return render_template("about.html")


@app.get("/invite")
def invite():
    client_id = os.getenv("DISCORD_CLIENT_ID", "").strip()
    if not client_id:
        return render_template("invite.html")

    query = urlencode({"client_id": client_id, "scope": "bot applications.commands"})
    return redirect(f"https://discord.com/oauth2/authorize?{query}")


if __name__ == "__main__":
    app.run()
