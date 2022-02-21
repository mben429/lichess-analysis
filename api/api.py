import requests
from flask import Flask
import json
from flask.globals import request
from flask.helpers import send_from_directory
from flask_cors import CORS, cross_origin

app = Flask(__name__, static_folder='../build', static_url_path='')
CORS(app)

@app.route('/get_chess_game_data', methods=['POST'])
@cross_origin()
def get_chess_game_data():

    # Username from react form
    username = request.json

    URL = "http://lichess.org/api/games/user/{}".format(username)
    PARAMS = {'moves': 'true', 'max': '100', 'opening': 'true', 'perfType': 'bullet,blitz,rapid,classical', 'rated': 'true'} 
    HEADERS = {"Accept": "application/x-ndjson"}

    r = requests.get(url=URL, params = PARAMS, headers=HEADERS)

    r_text = r.content.decode("utf-8")
    games_list = [json.loads(s) for s in r_text.split("\n")[:-1]]
    json_games = json.dumps(games_list)

    return json_games

@app.route('/')
@cross_origin()
def serve():
    return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    app.run()
