// Local In-Memory Reactive States
let players = [];

const categories = {
    "Ushqime": ["Mollë", "Banane", "Pica", "Hamburger", "Akullore", "Patate", "Djathë", "Çokollatë", "Sanduiç", "Portokall"],
    "Kafshë": ["Mace", "Qen", "Luan", "Tigër", "Elefant", "Delfin", "Zog", "Peshk", "Ari", "Ujk"],
    "Sporte": ["Futboll", "Basketboll", "Tenis", "Volejboll", "Not", "Atletikë", "Ping Pong", "Boks", "Hendboll", "Golf"],
    "Objekte": ["Telefon", "Laptop", "Televizor", "Tavolinë", "Karrige", "Orë", "Çelës", "Libër", "Laps", "Çantë"],
    "Vende": ["Kosovë", "Shqipëri", "Francë", "Gjermani", "Itali", "Spanjë", "Turqi", "Japoni", "Kanada", "Brazil"]
};

// Global Runtime State Counters
let secretWord = "";
let imposterIndex = -1;
let currentPlayerIndex = 0;

// UX Shortcut Handler: Register Enter keypresses on the input bar
document.getElementById("playerName").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        addPlayer();
    }
});

function addPlayer() {
    const input = document.getElementById("playerName");
    const name = input.value.trim();
    
    if (!name) return; // Disallow empty whitespace rows
    
    players.push(name);
    input.value = ""; // Clear active input value
    renderPlayers();
}

function removePlayer(index) {
    players.splice(index, 1);
    renderPlayers();
}

function renderPlayers() {
    const list = document.getElementById("playerList");
    list.innerHTML = "";
    
    players.forEach((player, index) => {
        list.innerHTML += `
            <li>
                <span>${player}</span>
                <button class="delete-btn" onclick="removePlayer(${index})">Fshij</button>
            </li>
        `;
    });
}

function startGame() {
    // Structural Safety Constraint Checklist
    if (players.length < 3) {
        alert("Duhet të ketë të paktën 3 lojtarë për të luajtur!");
        return;
    }

    const selectedCategory = document.getElementById("category").value;
    const wordList = categories[selectedCategory];
    
    // Core Game Generation Engine Logic
    secretWord = wordList[Math.floor(Math.random() * wordList.length)];
    imposterIndex = Math.floor(Math.random() * players.length);
    currentPlayerIndex = 0;

    // View Manipulation Layer
    document.getElementById("setupView").classList.add("hidden");
    document.getElementById("gameView").classList.remove("hidden");
    
    renderTurnStepOne();
}

// Phase Step 1: Secure Intermediary Pass Screen
function renderTurnStepOne() {
    const card = document.getElementById("gameCard");
    
    if (currentPlayerIndex >= players.length) {
        renderGameOver();
        return;
    }

    card.innerHTML = `
        <h2>Rradha : ${players[currentPlayerIndex]}</h2>
        <p>Pasi pajisja të jetë vetëm në dorën tënde, shtyp burtonin më poshtë.</p>
        <button class="btn-primary" onclick="renderTurnStepTwo()">Shfaq Fjalën</button>
    `;
}

// Phase Step 2: Individual Blind Word Reveal
function renderTurnStepTwo() {
    const card = document.getElementById("gameCard");
    const evaluatedWord = (currentPlayerIndex === imposterIndex) ? "IMPOSTOR 🕵️‍♂️" : secretWord;

    card.innerHTML = `
        <p style="margin-bottom:10px;">Fjala jote sekrete është:</p>
        <div class="secret-word-display">${evaluatedWord}</div>
        <p>Memorizoje dhe mos ia trego askujt!</p>
        <button class="btn-primary" onclick="advanceTurn()">Lojtari Tjetër</button>
    `;
}

function advanceTurn() {
    currentPlayerIndex++;
    renderTurnStepOne();
}

// Phase Step 3: Global Game Active Broadcast Screen
function renderGameOver() {
    const card = document.getElementById("gameCard");
    card.innerHTML = `
        <h2>Të gjithë morën fjalët! 🔍</h2>
        <p>Filloni diskutimin. </p>
        <button class="btn-success" onclick="resetToSetup()">Luaj Përsëri</button>
    `;
}

function resetToSetup() {
    document.getElementById("gameView").classList.add("hidden");
    document.getElementById("setupView").classList.remove("hidden");
}