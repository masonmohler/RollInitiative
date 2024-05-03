// Define arrays to store player and enemy data
let players = [];
let enemies = [];

// Load players and enemies from local storage when the page is loaded
window.addEventListener("load", function () {
  loadFromLocalStorage();
  displayCharacters(); // Ensure characters are displayed after loading from local storage
});

// Function to add a new player
function addPlayer() {
  // Create form for entering player details
  let formHTML = `
        <form id="playerForm">
            <label for="playerName">Name:</label>
            <input type="text" id="playerName" name="playerName" required><br>
            <label for="playerAC">AC:</label>
            <input type="text" id="playerAC" name="playerAC" required><br>
            <label for="playerHP">HP:</label>
            <input type="text" id="playerHP" name="playerHP" required><br>
            <label for="playerInit">Initiative:</label>
            <input type="text" id="playerInit" name="playerInit" required><br>
            <div class="formButtons">
            <input type="button" id="submitButton" class="close-modal" value="Close">
            <input type="submit" id="submitButton" value="Add Player">
            </div>
        </form>
    `;

  // Display form in a modal
  showModal(formHTML);

  // Listen for form submission
  document
    .getElementById("playerForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      // Get form values
      let playerName = document.getElementById("playerName").value;
      let playerAC = document.getElementById("playerAC").value;
      let playerHP = document.getElementById("playerHP").value;
      let playerInit = document.getElementById("playerInit").value;

      // Create player object
      let player = {
        name: playerName,
        AC: playerAC,
        HP: playerHP,
        Initiative: playerInit,
      };

      // Add player to the players array
      players.push(player);

      // Sort players by initiative
      players.sort((a, b) => b.Initiative - a.Initiative);

      // Display characters
      saveToLocalStorage();
      displayCharacters();
    });
}

// Function to add a new enemy
function addEnemy() {
  // Create form for entering enemy details
  let formHTML = `
        <form id="enemyForm">
            <label for="enemyName">Name:</label>
            <input type="text" id="enemyName" name="enemyName" required><br>
            <label for="enemyAC">AC:</label>
            <input type="text" id="enemyAC" name="enemyAC" required><br>
            <label for="enemyHP">HP:</label>
            <input type="text" id="enemyHP" name="enemyHP" required><br>
            <label for="enemyInit">Initiative:</label>
            <input type="text" id="enemyInit" name="enemyInit" required><br>
            <label for="numEnemies">Number of Enemies:</label>
            <input type="text" id="numEnemies" name="numEnemies"><br>
            <div class="formButtons">
            <input type="button" id="submitButton" class="close-modal" value="Close">
            <input type="submit" id="submitButton" value="Add Enemy">
            </div>
        </form>
    `;

  // Display form in a modal
  showModal(formHTML);

  // Listen for form submission
  document
    .getElementById("enemyForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      // Get form values
      let enemyName = document.getElementById("enemyName").value;
      let enemyAC = document.getElementById("enemyAC").value;
      let enemyHP = document.getElementById("enemyHP").value;
      let enemyInit = document.getElementById("enemyInit").value;

      // Prompt user to enter number of enemies
      let numEnemies = document.getElementById("numEnemies").value;

      if (numEnemies > 1) {
        for (let i = 1; i <= numEnemies; i++) {
          let enemy = {
            name: enemyName + " " + i,
            AC: enemyAC,
            HP: enemyHP,
            Initiative: enemyInit,
          };
          enemies.push(enemy);
        }
      } else {
        let enemy = {
          name: enemyName,
          AC: enemyAC,
          HP: enemyHP,
          Initiative: enemyInit,
        };
        enemies.push(enemy);
      }

      // Sort enemies by initiative
      enemies.sort((a, b) => b.Initiative - a.Initiative);

      // Display characters
      saveToLocalStorage();
      displayCharacters();
    });
  // Save players to local storage
}

// Function to display characters in character cards section
function displayCharacters() {
  // Combine players and enemies into a single array with type property
  let characters = [
    ...players.map((player) => ({ ...player, type: "player" })),
    ...enemies.map((enemy) => ({ ...enemy, type: "enemy" })),
  ];

  // Sort characters by initiative
  characters.sort((a, b) => b.Initiative - a.Initiative);

  // Get character cards container
  let characterCardsContainer = document.querySelector(".characterCards");

  // Clear character cards container
  characterCardsContainer.innerHTML = "";

  // Loop through characters and create character cards
  characters.forEach((character) => {
    let cardHTML = `
            <div class="${character.type}Card">
                <h2>${character.name}</h2>
                <p>AC: ${character.AC}</p>
                <p>HP: ${character.HP}</p>
                <p>Initiative: ${character.Initiative}</p>
                <input type="button" value="Edit" id="edit" data-type="${character.type}" data-name="${character.name}" onclick="editCharacter(event)">
                <input type="button" value="Delete" id="delete" data-type="${character.type}" data-name="${character.name}" onclick="deleteCharacter(event)">
            </div>
        `;
    characterCardsContainer.innerHTML += cardHTML;
  });
}

// Function to display character in character cards section
function displayCharacter(character, type) {
  let characterCards = document.querySelector(".characterCards");
  let card = document.createElement("div");
  card.classList.add(`${type}Card`);
  card.innerHTML = `
        <h2>${character.name}</h2>
        <p>AC: ${character.AC}</p>
        <p>HP: ${character.HP}</p>
        <p>Initiative: ${character.Initiative}</p>
        <input type="button" value="Edit" id="edit" onclick="editCharacter(event)" data-type="${type}" data-name="${character.name}" />
        <input type="button" value="Delete" id="delete" onclick="deleteCharacter(event)" data-type="${type}" data-name="${character.name}" />
    `;
  characterCards.appendChild(card);
}

// Function to edit character details
function editCharacter(event) {
  let type = event.target.getAttribute("data-type");
  let name = event.target.getAttribute("data-name");
  let index;

  if (type === "player") {
    index = players.findIndex((player) => player.name === name);
  } else {
    index = enemies.findIndex((enemy) => enemy.name === name);
  }

  // Create form for editing character details
  let formHTML = `
        <form id="editForm">
            <label for="newAC">AC:</label>
            <input type="text" id="newAC" name="newAC" value="${
              type === "player" ? players[index].AC : enemies[index].AC
            }" required><br>
            <label for="newHP">HP:</label>
            <input type="text" id="newHP" name="newHP" value="${
              type === "player" ? players[index].HP : enemies[index].HP
            }" required><br>
            <label for="newInit">Initiative:</label>
            <input type="text" id="newInit" name="newInit" value="${
              type === "player"
                ? players[index].Initiative
                : enemies[index].Initiative
            }" required><br>
            <div class="formButtons">
            <input type="button" id="submitButton" class="close-modal" value="Close">
            <input type="submit" id="submitButton" value="Save Changes">
            </div>
        </form>
    `;

  // Display form in a modal
  showModal(formHTML);

  // Listen for form submission
  document
    .getElementById("editForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      // Get form values
      let newAC = document.getElementById("newAC").value;
      let newHP = document.getElementById("newHP").value;
      let newInit = document.getElementById("newInit").value;

      // Update character details
      if (type === "player") {
        players[index].AC = newAC;
        players[index].HP = newHP;
        players[index].Initiative = newInit;
      } else {
        enemies[index].AC = newAC;
        enemies[index].HP = newHP;
        enemies[index].Initiative = newInit;
      }

      // Sort characters by initiative
      players.sort((a, b) => b.Initiative - a.Initiative);
      enemies.sort((a, b) => b.Initiative - a.Initiative);

      // Display characters
      saveToLocalStorage();
      displayCharacters();
    });
}

// Function to delete character
function deleteCharacter(event) {
  let type = event.target.getAttribute("data-type");
  let name = event.target.getAttribute("data-name");
  let index;

  if (type === "player") {
    index = players.findIndex((player) => player.name === name);
    players.splice(index, 1);
  } else {
    index = enemies.findIndex((enemy) => enemy.name === name);
    enemies.splice(index, 1);
  }

  // Display characters
  saveToLocalStorage();
  displayCharacters();
}

// Function to show modal with form
function showModal(formHTML) {
  // Create modal element
  let modal = document.createElement("div");
  modal.classList.add("modal");
  modal.innerHTML = formHTML;

  // Append modal to body
  document.body.appendChild(modal);

  // Close modal when clicking outside
  window.addEventListener("click", function (event) {
    if (
      event.target === modal ||
      event.target.classList.contains("close-modal")
    ) {
      modal.remove();
    }
  });
}

// Load arrays from local storage on document load
window.addEventListener("load", function () {
  players = JSON.parse(localStorage.getItem("players")) || [];
  enemies = JSON.parse(localStorage.getItem("enemies")) || [];

  // Display characters from loaded arrays
  displayCharacters();
});

// Function to save players and enemies to local storage
function saveToLocalStorage() {
  localStorage.setItem("players", JSON.stringify(players));
  localStorage.setItem("enemies", JSON.stringify(enemies));
}

// Function to load players and enemies from local storage
function loadFromLocalStorage() {
  let storedPlayers = localStorage.getItem("players");
  let storedEnemies = localStorage.getItem("enemies");

  if (storedPlayers) {
    players = JSON.parse(storedPlayers);
  }

  if (storedEnemies) {
    enemies = JSON.parse(storedEnemies);
  }
}
