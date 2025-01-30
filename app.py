from flask import Flask, render_template,request , jsonify
import numpy as np #used to process and save image data as a numpy array.
import base64 # helps decode the image data sent from the frontend
from PIL import Image #handles image processing (resizing,grayscale conversion)
from io import BytesIO #converts byte data into an image format for processing
import os



app=Flask(__name__)


if not os.path.exists('saved_data'):
    os.makedirs('saved_data')


@app.route('/')
def home():
    return render_template('home.html')

@app.route('/practice')
def practice():
    return render_template('practice.html')

@app.route('/add_data')
def add_data():
    return render_template('add_data.html')



@app.route('/save-drawing', methods=['POST'])
def save_drawing():
    try:
        data = request.json.get('image', '')  
        if ',' in data:
            image_data = base64.b64decode(data.split(',')[1])  
        else:
            return jsonify({"error": "Invalid image data format"}), 400

        image = Image.open(BytesIO(image_data)).convert('L')  

        
        image = image.resize((28, 28))
        img_array = np.array(image) / 255.0  

        
        np.save('saved_data/user_letter.npy', img_array)

        return jsonify({"message": "Drawing saved successfully!"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__  == '__main__':
    app.run(debug=True)