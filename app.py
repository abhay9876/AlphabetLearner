from flask import Flask, render_template,request , jsonify
import numpy as np #used to process and save image data as a numpy array.
import base64 # helps decode the image data sent from the frontend
from PIL import Image #handles image processing (resizing,grayscale conversion)
from io import BytesIO #converts byte data into an image format for processing
import os



app=Flask(__name__)

#it creates  the directory to store the processed drawing data
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

# @app.route('/save-drawing', methods=['POST'])
# def save_drawing():
#     data = request.json['image']  #exttract the base64-encoded image string sent via AJAX request from the frontend
#     image_data = base64.b64decode(data.split(',')[1]) #splits and decode the image data to extract the raw image bytes.
#     image_data = Image.open(BytesIO(image_data)).convert('L') # Opens the image in grwsyscale mode ('L' fro 8-bit grayscale)
#     image= image.resize((28,28)) # resize the images to 28*28 pixels for further processing (a common size for ML modes)
#     img_array = np.array(image) / 255.0   #converts the grayscale image to a numpy array and normalizes pixel values to the range[0,1]
#     np.save('save_data/user_letter.npy', img_array) #saves the numpyy array to the  saved_data  diretory with the filename user_letter.npy
#     return jsonify({"message":"Drawing saved successfully!"})

@app.route('/save-drawing', methods=['POST'])
def save_drawing():
    try:
        data = request.json.get('image', '')  # Safely get the 'image' key
        if ',' in data:
            image_data = base64.b64decode(data.split(',')[1])  # Decode base64 after comma
        else:
            return jsonify({"error": "Invalid image data format"}), 400

        image = Image.open(BytesIO(image_data)).convert('L')  # Convert to grayscale

        # Resize to 28x28 pixels for ML processing
        image = image.resize((28, 28))
        img_array = np.array(image) / 255.0  # Normalize pixel values

        # Save the NumPy array
        np.save('saved_data/user_letter.npy', img_array)

        return jsonify({"message": "Drawing saved successfully!"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__  == '__main__':
    app.run(debug=True)