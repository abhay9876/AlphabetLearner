from flask import Flask, render_template, request, jsonify
import numpy as np
import base64
from PIL import Image
from io import BytesIO
import os

app = Flask(__name__)


def setup_folder():
    os.makedirs("saved_data", exist_ok=True)

setup_folder()

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/add_data')
def add_data():
    return render_template('add_data.html')

@app.route('/save-drawing', methods=['POST'])
def save_drawing():
    try:
        image_data = request.json.get('image', '')  
        label = request.json.get('text', '')  

        if not label:
            return jsonify({"error": "Please generate a character first!"}), 400

        if ',' in image_data:
            decoded_image = base64.b64decode(image_data.split(',')[1])
        else:
            return jsonify({"error": "Invalid image format"}), 400

        image = Image.open(BytesIO(decoded_image)).convert('L')  
        image = image.resize((28, 28))  
        img_array = np.array(image) / 255.0  

        folder_path = os.path.join("saved_data", label)
        os.makedirs(folder_path, exist_ok=True)

        file_count = len(os.listdir(folder_path)) + 1
        file_path = os.path.join(folder_path, f"{label}_{file_count}.npy")

        np.save(file_path, img_array)

        return jsonify({"message": "Drawing saved successfully!"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/practice')
def practice():
    return render_template('practice.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        image_data = request.json.get('image', '')

        if ',' in image_data:
            decoded_image = base64.b64decode(image_data.split(',')[1])
        else:
            return jsonify({"error": "Invalid image format"}), 400

        image = Image.open(BytesIO(decoded_image)).convert('L')  
        image = image.resize((28, 28))  
        img_array = np.array(image) / 255.0  
        img_array = img_array.reshape(1, 28, 28, 1)  

        from tensorflow.keras.models import load_model
        model = load_model('model/trained_model.h5')

        prediction = model.predict(img_array)
        predicted_label = chr(np.argmax(prediction) + ord('A'))  

        return jsonify({"prediction": predicted_label})

    except Exception as e:
        return jsonify({"error": str(e)}), 500



if __name__ == '__main__':
    app.run(debug=True)
