// Constants for card values
const cardValues = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
    'JACK': 10, 'QUEEN': 10, 'KING': 10, 'ACE': 11
};

// Global variables
let deck = [];
let playerHand = [];
let dealerHand = [];

// Function to start the game
function startGame() {
    createDeck();
    shuffleDeck();

    playerHand.push(drawCard());
    playerHand.push(drawCard());
    dealerHand.push(drawCard());
    dealerHand.push(drawCard());

    displayGameState();
}

// Function to create a new deck of cards
function createDeck() {
    deck = [];
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'JACK', 'QUEEN', 'KING', 'ACE'];

    for (let suit of suits) {
        for (let rank of ranks) {
            deck.push({rank, suit});
        }
    }
}

// Function to shuffle the deck
function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// Function to draw a card from the deck
function drawCard() {
    return deck.pop();
}

// Function to calculate the total value of a hand
function calculateHandValue(hand) {
    let total = 0;
    let aceCount = 0;

    for (let card of hand) {
        if (card.rank === 'ACE') {
            aceCount++;
        }
        total += cardValues[card.rank];
    }

    while (aceCount > 0 && total > 21) {
        total -= 10;
        aceCount--;
    }

    return total;
}

// Function to display the game state
function displayGameState() {
    const gameSection = document.getElementById('game-section');
    const gameStatus = document.getElementById('game-status');

    gameSection.innerHTML = '';

    const playerHandDiv = document.createElement('div');
    playerHandDiv.innerHTML = '<h3>Player Hand</h3>';
    for (let card of playerHand) {
        playerHandDiv.innerHTML += `<span>${card.rank} of ${card.suit}</span>`;
    }
    playerHandDiv.innerHTML += `<p>Total: ${calculateHandValue(playerHand)}</p>`;
    gameSection.appendChild(playerHandDiv);

    const dealerHandDiv = document.createElement('div');
    dealerHandDiv.innerHTML = '<h3>Dealer Hand</h3>';
    dealerHandDiv.innerHTML += `<span>${dealerHand[0].rank} of ${dealerHand[0].suit}</span>`;
    gameSection.appendChild(dealerHandDiv);

    const actionButtonsDiv = document.createElement('div');
    const hitButton = document.createElement('button');
    hitButton.textContent = 'Hit';
    hitButton.addEventListener('click', hit);
    actionButtonsDiv.appendChild(hitButton);

    const standButton = document.createElement('button');
    standButton.textContent = 'Stand';
    standButton.addEventListener('click', stand);
    actionButtonsDiv.appendChild(standButton);

    gameSection.appendChild(actionButtonsDiv);

    gameStatus.textContent = 'Game in progress...';
}

// Function to handle player hitting
function hit() {
    playerHand.push(drawCard());
    displayGameState();

    if (calculateHandValue(playerHand) > 21) {
        endGame('Player busts!');
    }
}

// Function to handle player standing
function stand() {
    while (calculateHandValue(dealerHand) < 17) {
        dealerHand.push(drawCard());
    }
    displayGameState();
    determineWinner();
}

// Function to determine the winner
function determineWinner() {
    const playerTotal = calculateHandValue(playerHand);
    const dealerTotal = calculateHandValue(dealerHand);

    if (playerTotal > dealerTotal || dealerTotal > 21) {
        endGame('Player wins!');
    } else if (playerTotal < dealerTotal) {
        endGame('Dealer wins!');
    } else {
        endGame('It\'s a tie!');
    }
}

// Function to end the game
function endGame(message) {
    const gameStatus = document.getElementById('game-status');
    gameStatus.textContent = message;
}