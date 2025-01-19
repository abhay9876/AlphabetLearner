const canvas = document.getElementById('writingCanvas');  
const ctx = canvas.getContext('2d');  

canvas.width = canvas.clientWidth; // Set to the canvas element's width  
canvas.height = canvas.clientHeight; // Set to the canvas element's height  

let drawing = false;  

canvas.addEventListener('mousedown', () => {  
    drawing = true;  
    ctx.beginPath();  
});  

canvas.addEventListener('mousemove', draw);  
canvas.addEventListener('mouseup', () => {  
    drawing = false;  
    ctx.closePath();  
});  
canvas.addEventListener('mouseout', () => {  
    drawing = false;  
    ctx.closePath();  
});  

// Function to draw on the canvas  
function draw(event) {  
    if (!drawing) return;  
    const rect = canvas.getBoundingClientRect();  
    const x = event.clientX - rect.left;  
    const y = event.clientY - rect.top;  
    ctx.lineWidth = 2;  
    ctx.lineCap = 'round';  
    ctx.strokeStyle = '#000';  
    ctx.lineTo(x, y);  
    ctx.stroke();  
    ctx.moveTo(x, y);  
}  

// Output and Practice Data button functionality  
document.getElementById('outputButton').addEventListener('click', function() {  
    const outputBox = document.getElementById('outputBox');  
    outputBox.textContent = 'Displaying output data...';  
});  

document.getElementById('practiceButton').addEventListener('click', function() {  
    const outputBox = document.getElementById('outputBox');  
    outputBox.textContent = 'Entering practice data...';  
});  

// Clear Canvas button functionality  
document.getElementById('clearButton').addEventListener('click', function() {  
    ctx.clearRect(0, 0, canvas.width, canvas.height);  
});  

// Image upload functionality  
document.getElementById('imageUpload').addEventListener('change', function(event) {  
    const file = event.target.files[0];  
    const reader = new FileReader();  
    reader.onload = function(e) {  
        const img = new Image();  
        img.src = e.target.result;  
        img.onload = function() {  
            const outputDiv = document.getElementById('uploadedContent');  
            outputDiv.innerHTML += `<img src="${img.src}" style="max-width: 100%; height: auto; margin-top: 10px;" />`;  
        };  
    };  
    reader.readAsDataURL(file);  
});  

// PDF upload functionality  
document.getElementById('pdfUpload').addEventListener('change', function(event) {  
    const file = event.target.files[0];  
    if (file.type === 'application/pdf') {  
        const reader = new FileReader();  
        reader.onload = function(e) {  
            const outputDiv = document.getElementById('uploadedContent');  
            outputDiv.innerHTML += `<iframe src="${e.target.result}" style="width: 100%; height: 500px;" frameborder="0"></iframe>`;  
        };  
        reader.readAsDataURL(file);  
    } else {  
        alert('Please upload a valid PDF file.');  
    }  
});