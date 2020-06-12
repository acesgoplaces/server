from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
  return "home page"

@app.route('/p/<string:id>')
def show_page(id): # this is the link sent via SMS
  return render_template('link.html', id=id)