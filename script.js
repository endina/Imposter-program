// ---------- CATEGORIES ----------
const categories = {
    "Ushqime": [
        "Mollë", "Banane", "Pica", "Hamburger", "Akullore", "Patate", "Djathë", "Çokollatë", "Sandwich", "Portokall",
        "Petulla", "Burek", "Tiramisu", "Karrotë", "Mandarina", "Dredhëz", "Spinaq", "Peshk", "Mish", "Kofshë Pule",
        "Kek", "Gjizë", "Kos", "Qumësht", "Ujë", "Vezë", "Ullinj", "Rrush", "Shalqiri", "Pjepër", "Kikirikë", "Mjaltë"
    ],
    "Kafshë": [
        "Mace", "Qen", "Luan", "Tigër", "Elefant", "Delfin", "Zog", "Peshk", "Ari", "Ujk", "Dhelpër", "Lepur",
        "Shqiponjë", "Gjirafë", "Zebër", "Majmun", "Kangaroo", "Panda", "Koala", "Pinguin", "Balenë", "Peshkaqen",
        "Korbi", "Gjel", "Pulë", "Kal", "Lopë", "Dhi", "Dele", "Derr", "Miu", "Breshkë", "Gjarpër", "Bletë"
    ],
    "Sporte": [
        "Futboll", "Basketboll", "Tenis", "Volejboll", "Not", "Atletikë", "Ping Pong", "Boks", "Hendboll", "Golf",
        "Karate", "Kriket", "Ragbi", "Skijim", "Çiklizëm", "Gjimnastikë", "Hokej", "Patinazh", "Formula 1", "Surf",
        "Shigjeta", "Bilardo", "Shah", "Maratonë", "Alpinizëm", "Zhytje", "Badminton", "Peshkim", "Yoga", "Bowling"
    ],
    "Objekte": [
        "Telefon", "Laptop", "Televizor", "Tavolinë", "Karrige", "Orë", "Çelës", "Libër", "Laps", "Çantë",
        "Kuletë", "Pasqyrë", "Dritare", "Derë", "Shtrat", "Jastëk", "Batanije", "Pjatë", "Gotë", "Thikë",
        "Pirun", "Lugë", "Filxhan", "Kamera", "Kufje", "Bateri", "Dritë", "Llambë", "Krehër", "Sapun",
        "Peshqir", "Furçë Dhëmbësh", "Gërshërë", "Letër", "Stilolaps", "Gomë", "Vizore"
    ],
    "Vende": [
        "Kosovë", "Shqipëri", "Francë", "Gjermani", "Itali", "Spanjë", "Turqi", "Japoni", "Kanada", "Brazil",
        "SHBA", "Angli", "Zvicër", "Austri", "Greqi", "Maqedoni", "Mali i Zi", "Kroaci", "Suedi", "Norvegji",
        "Egjipt", "Marok", "Afrika e Jugut", "Australi", "Kinë", "Indi", "Meksikë", "Argjentinë", "Prishtinë",
        "Tiranë", "Paris", "Londër", "Romë", "Nju Jork", "Tokio", "Stamboll", "Berlin"
    ]
};

// ---------- GAME STATE ----------
let players = [];
let secretWord = "";
let imposterIndex = -1;
let currentPlayerIdx = 0;
let currentCategoryMode = "manual";
let gameCategory = "Ushqime";

// DOM elements
const setupView = document.getElementById("setupView");
const gameView = document.getElementById("gameView");
const playerListEl = document.getElementById("playerList");
const playerNameInput = document.getElementById("playerName");
const addBtn = document.getElementById("addPlayerBtn");
const startBtn = document.getElementById("startGameBtn");
const categorySelect = document.getElementById("categorySelect");
const manualCatBox = document.getElementById("manualCatBox");
const randomCatBox = document.getElementById("randomCatBox");
const modeBtns = document.querySelectorAll(".mode-btn");

// ---------- HELPERS ----------
function savePlayers() {
    localStorage.setItem("impostor_players", JSON.stringify(players));
}

function loadPlayersFromStorage() {
    const saved = localStorage.getItem("impostor_players");
    if (saved) {
        try {
            players = JSON.parse(saved);
            if (!Array.isArray(players)) players = [];
        } catch(e) { players = []; }
    } else {
        players = [];
    }
    renderPlayers();
}

function renderPlayers() {
    if (!playerListEl) return;
    if (players.length === 0) {
        playerListEl.innerHTML = '<div style="text-align:center; padding:12px; color:#6b7280;">➕ Shtoni lojtarë</div>';
        return;
    }
    playerListEl.innerHTML = players.map((name, idx) => `
        <li>
            <span class="player-name">${escapeHtml(name)}</span>
            <button class="delete-btn" data-index="${idx}">Heq</button>
        </li>
    `).join('');
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt(btn.getAttribute('data-index'));
            if (!isNaN(idx)) {
                players.splice(idx, 1);
                savePlayers();
                renderPlayers();
            }
        });
    });
}

function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function addPlayer() {
    const name = playerNameInput.value.trim();
    if (!name) return;
    if (players.length >= 12) {
        alert("Max 12 lojtarë");
        return;
    }
    players.push(name);
    savePlayers();
    renderPlayers();
    playerNameInput.value = "";
    playerNameInput.focus();
}

function setMode(mode) {
    currentCategoryMode = mode;
    modeBtns.forEach(btn => {
        if (btn.getAttribute("data-mode") === mode) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
    if (mode === "manual") {
        manualCatBox.classList.remove("hidden");
        randomCatBox.classList.add("hidden");
    } else {
        manualCatBox.classList.add("hidden");
        randomCatBox.classList.remove("hidden");
    }
}

function getGameCategory() {
    if (currentCategoryMode === "manual") {
        return categorySelect.value;
    } else {
        const keys = Object.keys(categories);
        return keys[Math.floor(Math.random() * keys.length)];
    }
}

// ---------- GAME FLOW ----------
function startGame() {
    if (players.length < 3) {
        alert("Duhet të paktën 3 lojtarë!");
        return;
    }
    
    gameCategory = getGameCategory();
    const wordList = categories[gameCategory];
    if (!wordList || wordList.length === 0) {
        alert("Gabim me kategorinë");
        return;
    }
    
    secretWord = wordList[Math.floor(Math.random() * wordList.length)];
    imposterIndex = Math.floor(Math.random() * players.length);
    currentPlayerIdx = 0;
    
    setupView.classList.add("hidden");
    gameView.classList.remove("hidden");
    
    renderTurnStepOne();
}

function renderTurnStepOne() {
    const card = document.getElementById("gameCard");
    if (currentPlayerIdx >= players.length) {
        renderDiscussionOnly();
        return;
    }
    
    card.innerHTML = `
        <div class="game-card">
            <div style="margin-bottom: 8px; color:#6b7280; font-size:0.75rem;">Rradha</div>
            <div class="turn-name">${escapeHtml(players[currentPlayerIdx])}</div>
            <div class="game-info">📱 Merre pajisjen</div>
            <button class="btn-primary full-btn" id="revealBtn">Shfaq Fjalën</button>
        </div>
    `;
    const reveal = document.getElementById("revealBtn");
    if (reveal) reveal.onclick = () => renderTurnStepTwo();
}

function renderTurnStepTwo() {
    const card = document.getElementById("gameCard");
    const isImposter = (currentPlayerIdx === imposterIndex);
    const displayWord = isImposter ? "IMPOSTOR" : secretWord;
    
    card.innerHTML = `
        <div class="game-card">
            <div class="category-tag">${escapeHtml(gameCategory)}</div>
            <div class="word-box">
                <div class="word-display">${escapeHtml(displayWord)}</div>
            </div>
            <div class="game-info" style="font-size:0.8rem;">Memorizo → kalo te tjetri</div>
            <button class="btn-primary full-btn" id="nextTurnBtn">Lojtari Tjetër</button>
        </div>
    `;
    const next = document.getElementById("nextTurnBtn");
    if (next) next.onclick = () => advanceTurn();
}

function advanceTurn() {
    currentPlayerIdx++;
    if (currentPlayerIdx < players.length) {
        renderTurnStepOne();
    } else {
        renderDiscussionOnly();
    }
}

function renderDiscussionOnly() {
    const card = document.getElementById("gameCard");
    card.innerHTML = `
        <div class="game-card">
            <div class="turn-name" style="font-size:1.5rem;">🗣️ Diskutoni</div>
            <div class="game-info">Të gjithë morën fjalët.<br>Diskutoni dhe gjeni impostorin.</div>
            <button class="btn-success full-btn" id="resetGameBtn">Luaj Përsëri</button>
        </div>
    `;
    const reset = document.getElementById("resetGameBtn");
    if (reset) reset.onclick = () => resetToSetup();
}

function resetToSetup() {
    gameView.classList.add("hidden");
    setupView.classList.remove("hidden");
    secretWord = "";
    imposterIndex = -1;
    currentPlayerIdx = 0;
    gameCategory = "Ushqime";
}

// ---------- EVENT LISTENERS ----------
document.addEventListener("DOMContentLoaded", () => {
    loadPlayersFromStorage();
    
    addBtn.addEventListener("click", addPlayer);
    playerNameInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") addPlayer();
    });
    
    startBtn.addEventListener("click", startGame);
    
    modeBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const mode = btn.getAttribute("data-mode");
            if (mode === "manual") setMode("manual");
            else setMode("random");
        });
    });
    
    setMode("manual");
});