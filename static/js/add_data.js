const canvas = document.getElementById('drawcanvas');
const ctx = canvas.getContext('2d');
let drawing = false;

// language selection
let currentLanguage = 'en'; // default language is English

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

// function to clear the canvas
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
    document.getElementById('random-letter').style.display = 'inline'; // show letter
    document.getElementById('random-text').style.display = 'none'; // hide word
}

// generate random word
function generateRandomWord() {
    fetchRandomWord(currentLanguage)
        .then(word => {
            document.getElementById('random-text').textContent = word.toUpperCase();
            document.getElementById('random-text').style.display = 'inline'; // show word
            document.getElementById('random-letter').style.display = 'none'; // hide letter
        });
}

// function to update the current language
function updateLanguage() {
    currentLanguage = document.getElementById('language-select').value;
    generateRandomText(); // regenerate text based on new language
}

// function to generate random text (either letter or word)
function generateRandomText() {
    const randomChoice = Math.random() < 0.5; // 50% chance for letter or word
    if (randomChoice) {
        generateRandomLetter(); // generate random letter
    } else {
        generateRandomWord(); // generate random word
    }
}

// call random text function initially
window.onload = generateRandomText;

// function to save drawing along with the letter or word
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
