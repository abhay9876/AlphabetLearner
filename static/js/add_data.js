const canvas = document.getElementById('drawcanvas');
const ctx = canvas.getContext('2d');
let drawing = false;


let currentLanguage = 'en'; 

// start drawing when mouse is pressed
canvas.addEventListener('mousedown', (event) => {
    drawing = true;
    draw(event);
});

// stop drawing when mouse is released
canvas.addEventListener('mouseup', () => {
    drawing = false;
    ctx.beginPath();
});

// handle mouse movement
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

// function to fetch random word
function fetchRandomWord(language) {
    const apiUrl = `https://random-word-api.herokuapp.com/word?number=1&lang=${language}`;
    return fetch(apiUrl)
        .then(response => response.json())
        .then(data => data[0])
        .catch(error => {
            console.error('Error fetching random word:', error);
            return 'ERROR';
        });
}

// function to fetch random letter based on language
function fetchRandomLetter(language) {
    const alphabetMap = {
        en: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        es: 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ',  // spanish
        fr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',    // french (same as English)
        de: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',    // german (same as English)
    };

    const alphabet = alphabetMap[language] || alphabetMap.en;
    const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
    return randomLetter;
}

// generate random letter
function generateRandomLetter() {
    const letter = fetchRandomLetter(currentLanguage);
    document.getElementById('random-letter').textContent = letter;
    document.getElementById('random-letter').style.display = 'inline'; 
    document.getElementById('random-text').style.display = 'none'; 
}


function generateRandomWord() {
    fetchRandomWord(currentLanguage)
        .then(word => {
            document.getElementById('random-text').textContent = word.toUpperCase();
            document.getElementById('random-text').style.display = 'inline'; 
            document.getElementById('random-letter').style.display = 'none'; 
        });
}

// function to update the current language
function updateLanguage() {
    currentLanguage = document.getElementById('language-select').value;
    generateRandomText(); 
}


function generateRandomText() {
    const randomChoice = Math.random() < 0.5; 
    if (randomChoice) {
        generateRandomLetter(); 
    } else {
        generateRandomWord(); 
    }
}


window.onload = generateRandomText;


function saveDrawing() {
    const imageData = canvas.toDataURL('image/png');
    const randomText = document.getElementById('random-text').style.display === 'inline'
        ? document.getElementById('random-text').textContent
        : document.getElementById('random-letter').textContent;

    fetch('/save-drawing', {
        method: 'POST',
        body: JSON.stringify({ image: imageData, text: randomText }),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => alert(data.message))
    .catch(error => console.error('Error:', error));
}
