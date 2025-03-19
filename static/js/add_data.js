const canvas = document.getElementById('drawcanvas');
const ctx = canvas.getContext('2d');
let drawing = false;


const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const numbers = "0123456789";


canvas.addEventListener('mousedown', (event) => {
    drawing = true;
    draw(event);
});


canvas.addEventListener('mouseup', () => {
    drawing = false;
    ctx.beginPath();
});


canvas.addEventListener('mousemove', (event) => {
    if (drawing) {
        draw(event);
    }
});

function draw(event) {
    ctx.fillStyle = 'black';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';

    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(event.offsetX, event.offsetY);
}


function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}


function generateRandomLetter() {
    let randomChar = letters[Math.floor(Math.random() * letters.length)];
    document.getElementById("random-text").innerText = randomChar;
}


function generateRandomNumber() {
    let randomNum = numbers[Math.floor(Math.random() * numbers.length)];
    document.getElementById("random-text").innerText = randomNum;
}


function saveDrawing() {
    const imageData = canvas.toDataURL('image/png');
    const randomText = document.getElementById('random-text').textContent;

    if (!randomText) {
        alert("Generate a character first!");
        return;
    }

    fetch('/save-drawing', {
        method: 'POST',
        body: JSON.stringify({ image: imageData, text: randomText }),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => alert(data.message))
    .catch(error => console.error('Error:', error));
}
