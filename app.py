from flask import Flask, render_template,request , jsonify
import numpy as np 
import base64 
from PIL import Image 
from io import BytesIO 
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
        label = request.json.get('label', '')  

        if not label or not label.isalpha():
            return jsonify({"error": "Invalid label"}), 400
        
        if ',' in data:
            image_data = base64.b64decode(data.split(',')[1])  
        else:
            return jsonify({"error": "Invalid image data format"}), 400

        image = Image.open(BytesIO(image_data)).convert('L')  
        image = image.resize((28, 28))
        img_array = np.array(image) / 255.0  

        
        folder_path = f"saved_data/{label.upper()}"
        os.makedirs(folder_path, exist_ok=True)

        
        file_count = len(os.listdir(folder_path)) + 1  
        file_path = os.path.join(folder_path, f"{label.upper()}_{file_count}.npy")

        np.save(file_path, img_array)

        return jsonify({"message": "Drawing saved successfully!"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    


def preprocess_image(image_data):
    
    image_data = image_data.split(",")[1]  
    image_bytes = base64.b64decode(image_data)
    
    
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_GRAYSCALE)

    
    img = cv2.resize(img, (28, 28))
    img = img / 255.0  

   
    img = img.reshape(1, 28, 28, 1)
    
    return img


@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    image_data = data['image']
    
    processed_img = preprocess_image(image_data)
    
    
    prediction = model.predict(processed_img)
    predicted_label = np.argmax(prediction)  
    
    return jsonify({'prediction': str(predicted_label)})


if __name__  == '__main__':
    app.run(debug=True)