from flask import Flask

app = Flask(__name__, static_folder="../build", static_url_path='/')
#app = Flask(__name__)
from app import api
