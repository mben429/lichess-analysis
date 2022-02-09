import requests
from flask import Flask
import numpy as np
import pandas as pd
import json
from flask.globals import request

app = Flask(__name__)

@app.route('/get_chess_game_data', methods=['POST'])
def get_chess_game_data():

    # Username from react form
    username = request.json
    print(username)

    URL = "http://lichess.org/api/games/user/{}".format(username)
    PARAMS = {'moves': 'true', 'max': '1', 'opening': 'true'}
    HEADERS = {"Accept": "application/x-ndjson"}

    r = requests.get(url=URL, params = PARAMS, headers=HEADERS)

    r_text = r.content.decode("utf-8")
    games_list = [json.loads(s) for s in r_text.split("\n")[:-1]]
    json_games = json.dumps(games_list)

    print("Games: ", json_games)

    return json_games
    
    

def gamedata_to_json(gamedata):
    game_data_df = pd.DataFrame(columns=[
        "Event", 
        "Site", 
        "Date", 
        "White",
        "Black",
        "Result",
        "UTCDate",
        "UTCTime",
        "WhiteElo",
        "BlackElo",
        "WhiteRatingDiff",
        "BlackRatingDiff",
        "Variant",
        "TimeControl",
        "ECO",
        "Opening",
        "Termination"
        ])


    

    


