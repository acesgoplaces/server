from flask import Flask, render_template

app = Flask(__name__)

@app.route('/api/coords', methods=["HEAD", "POST"])
def receive_coords():
  return
