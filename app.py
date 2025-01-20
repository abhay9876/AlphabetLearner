from flask import Flask, render_template

app=Flask(__name__)


@app.route('/')
def home():
    return render_template('home.html')

@app.route('/practice')
def practice():
    return render_template('practice.html')

@app.route('/add_data')
def add_data():
    return render_template('add_data.html')


if __name__  == '__main__':
    app.run(debug=True)