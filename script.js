let players = [];

const categories = {
    "Ushqime": [
        "Mollë", "Banane", "Pica", "Hamburger", "Akullore", "Patate", "Djathë", "Çokollatë", "Sanduiç", "Portokall",
        "Sufllaqe", "Petulla", "Burek", "Tiramisu", "Karrotë", "Mandarina", "Dredhëz", "Spinaq", "Peshk", "Mish",
        "Kofshë Pule", "Kek", "Gjizë", "Kos", "Qumësht", "Ujë", "Lëng Portokalli", "Mente", "Vezë", "Ullinj",
        "Maltë", "Rrush", "Shalqiri", "Pjepër", "Kikirikë", "Badem", "Lajthi", "Mjaltë", "Gjalpë", "Kokoshka"
    ],

    "Kafshë": [
        "Mace", "Qen", "Luan", "Tigër", "Elefant", "Delfin", "Zog", "Peshk", "Ari", "Ujk",
        "Dhelpër", "Lepur", "Kaqorri", "Shqiponjë", "Gjirafë", "Zebër", "Majmun", "Kangaroo", "Panda", "Koala",
        "Pinguin", "Balenë", "Peshkaqen", "Dallëndyshe", "Korbi", "Gjel", "Pulë", "Kal", "Lopë", "Dhi",
        "Dele", "Derr", "Miu", "Breshkë", "Gjarpër", "Hardhucë", "Athe", "Krimb", "Flutur", "Bletë"
    ],

    "Sporte": [
        "Futboll", "Basketboll", "Tenis", "Volejboll", "Not", "Atletikë", "Ping Pong", "Boks", "Hendboll", "Golf",
        "Karate", "Kriket", "Ragbi", "Skijim", "Çiklizëm", "Gjimnastikë", "Kanoe", "Hokej", "Patinazh", "Formula 1",
        "Moto GP", "Sërfin", "Shigjeta", "Bilardo", "Shah", "Maratonë", "Alpinizëm", "Zhytje", "Badminton", "Kërcim me Bunxhi",
        "Gjuajtje me Hark", "Peshkim", "Shtytje Peshash", "Mundje", "Kikboks", "Kuaj", "Yoga", "Skateboard", "Regata", "Bowling"
    ],

    "Objekte": [
        "Telefon", "Laptop", "Televizor", "Tavolinë", "Karrige", "Orë", "Çelës", "Libër", "Laps", "Çantë",
        "Kuletë", "Pasqyrë", "Dritare", "Derë", "Shtrat", "Jastëk", "Batanije", "Pjatë", "Gotë", "Thikë",
        "Pirun", "Lugë", "Filxhan", "Gjilpërë", "Gjenerator", "Kamera", "Kufje", "Bateri", "Dritë", "Llambë",
        "Krehër", "Sapun", "Peshqir", "Furçë Dhëmbësh", "Gërshërë", "Letër", "Stilolaps", "Gomë", "Vizore", "Ombrellë"
    ],

    "Vende": [
        "Kosovë", "Shqipëri", "Francë", "Gjermani", "Itali", "Spanjë", "Turqi", "Japoni", "Kanada", "Brazil",
        "SHBA", "Angli", "Zvicër", "Austri", "Greqi", "Maqedoni", "Mali i Zi", "Kroaci", "Suedi", "Norvegji",
        "Egjipt", "Marok", "Afrika e Jugut", "Australi", "Zelanda e Re", "Kinë", "Indi", "Meksikë", "Argjentinë", "Kolombi",
        "Prishtinë", "Tiranë", "Paris", "Londër", "Romë", "Nju Jork", "Tokio", "Stamboll", "Berlin", "Madrid"
    ]
};
let secretWord = "";
let imposterIndex = -1;
let currentPlayerIndex = 0;

// Auto-add triggers on Mobile Soft-Keyboard Done/Enter click
document.getElementById("playerName").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        addPlayer();
        // Minimizes keyboard focus to prevent layout shifting on small devices
        document.getElementById("playerName").blur(); 
    }
});

function addPlayer() {
    const input = document.getElementById("playerName");
    const name = input.value.trim();
    if (!name) return;
    
    players.push(name);
    input.value = "";
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
                <button class="delete-btn" onclick="removePlayer(${index})">Heq</button>
            </li>
        `;
    });
}

function startGame() {
    if (players.length < 3) {
        alert("Duhet të ketë të paktën 3 lojtarë!");
        return;
    }

    const selectedCategory = document.getElementById("category").value;
    const wordList = categories[selectedCategory];
    
    secretWord = wordList[Math.floor(Math.random() * wordList.length)];
    imposterIndex = Math.floor(Math.random() * players.length);
    currentPlayerIndex = 0;

    document.getElementById("setupView").classList.add("hidden");
    document.getElementById("gameView").classList.remove("hidden");
    
    renderTurnStepOne();
}

function renderTurnStepOne() {
    const card = document.getElementById("gameCard");
    
    if (currentPlayerIndex >= players.length) {
        renderGameOver();
        return;
    }

    card.innerHTML = `
        <h2>Rradha e: ${players[currentPlayerIndex]} 📱</h2>
        <p>Merrni telefonin. Pasi pajisja të jetë vetëm në dorën tënde, shtyp butonin sekret më poshtë.</p>
        <button class="btn-primary" onclick="renderTurnStepTwo()">Shfaq Fjalën</button>
    `;
}

function renderTurnStepTwo() {
    const card = document.getElementById("gameCard");
    const evaluatedWord = (currentPlayerIndex === imposterIndex) ? "IMPOSTOR 🕵️‍♂️" : secretWord;

    card.innerHTML = `
        <p style="margin-bottom: 4px;">Fjala jote sekrete është:</p>
        <div class="secret-word-display">${evaluatedWord}</div>
        <p>Memorizoje fjalën, pastaj kaloja telefonin lojtarit tjetër.</p>
        <button class="btn-primary" onclick="advanceTurn()">Lojtari Tjetër</button>
    `;
}

function advanceTurn() {
    currentPlayerIndex++;
    renderTurnStepOne();
}

function renderGameOver() {
    const card = document.getElementById("gameCard");
    card.innerHTML = `
        <h2>Të gjithë morën fjalët! 🔍</h2>
        <p>Filloni diskutimin e hapur. Kush mendoni se po gënjen?</p>
        <button class="btn-success" onclick="resetToSetup()">Luaj Përsëri</button>
    `;
}

function resetToSetup() {
    document.getElementById("gameView").classList.add("hidden");
    document.getElementById("setupView").classList.remove("hidden");
}