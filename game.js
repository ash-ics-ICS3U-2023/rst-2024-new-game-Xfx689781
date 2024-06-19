// Define global variables for the functions to use
let dealerSum = 0; //define dealerSum - the dealer's score
let yourSum = 0; //define yourSum - the player's score

let dealerAceCount = 0; 
let yourAceCount = 0; 

let hidden; 
let deck;

let canHit = false;
let canStand = false;
let canBet = true;
let broke = false;

let balance = 100;
let betAmount = 0;

 
window.onload = function() {
    makeDeck();
    shuffleDeck();
    updateMoneyDisplay();
    document.getElementById("placeBet").addEventListener("click", placeBet);
    document.getElementById("outOfMoney").addEventListener("click", atm);
}

function checkBalance(){
    if (balance == 0){
        broke = true;
        console.log(broke);
    } // check if the balance is 0 and therefore applting if the being broke is true or not
    else{
        broke = false;
        console.log(broke);
    }
}
checkBalance();

function atm(){
    // Function for giving money to player when they out
    if (broke == false){ // Doesnt give money if use is not at 0$
        return
    }
    //Gives player 10$, updates the money display, displays text, and resets the broke status
    balance += 10;
    console.log(balance);
    updateMoneyDisplay();
    document.getElementById("results").innerText = "You went to the atm and withdrew $10, keep on gambling!";
    broke = false;
}

function updateMoneyDisplay(){
    document.getElementById("balance").innerText = balance;
}

//to bet: if the money the player has > 0, the player can bet
function placeBet(){
    if (canBet == false) {
        return;
    } // 
    canBet = false;
    canStand = true;
    canHit = true;
    let amount = document.getElementById("betAmount").value;
    betAmount = parseInt(amount);

    //enter the bet amount of money
    if (isNaN(betAmount) || betAmount <= 0 || betAmount > balance){
        alert("Please enter a valid bet amount.");
        canBet = true;
        return;
    }

    balance -= betAmount;
    console.log(balance);
    updateMoneyDisplay();
    startRound();
}

//define the card deck
 function makeDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]);
        }
    }
}

//shuffle the card deck
function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length);
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    console.log(deck);
}

//the function to start the game 
function startRound() {
    // Show first face down card
    let hiddenCard = document.getElementById("hidden");
    hiddenCard.style.display = "inline";
    // Give hidden card a value/card
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);
    console.log(hidden);
    console.log(dealerSum);
        //<img src="./cards/4-C.png">
        // Show first face card for dealer
        let displayCard = document.createElement("img");
        let card = deck.pop();
        displayCard.src = "./cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(displayCard);
    console.log(dealerSum);

    //create two random image of the cards
    for (let i = 0; i < 2; i++) {
        let displayCard = document.createElement("img");  //display the cards' images on the screen
        let card = deck.pop();
        displayCard.src = "./cards/" + card + ".png";
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-cards").append(displayCard);
        // console.log("Loop Check");
    }
    console.log(yourSum);
    if (yourSum == 21){
        canHit = false; //if the player's score = 21, the player cannot hit or stand, and that person wins 3.5 times of the money he/she paid for
        document.getElementById("hidden").src = "./cards/" + hidden + ".png";
        let message = ""
        balance += betAmount * 3.5;
        message = "Blackjack!\nBig winner 💰\nYou made: $" + betAmount * 3.5;
        document.getElementById("dealer-sum").innerText = dealerSum;
        document.getElementById("your-sum").innerText = yourSum;
        document.getElementById("results").innerText = message;
        document.getElementById("resetGame").addEventListener("click", nextRound);
        updateMoneyDisplay();
    }

    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", endRound);

}

//the function to control hits and stands
function hit() {
    if (canHit == false) {
        return;
    }

    let displayCard = document.createElement("img");
    let card = deck.pop();
    displayCard.src = "./cards/" + card + ".png";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(displayCard);

    if (reduceAce(yourSum, yourAceCount) > 21) { //when the player burst, the player cannot hit or stand
        canHit = false;
        canStand = false;
        
        document.getElementById("hidden").src = "./cards/" + hidden + ".png";
        let message = ""
        message = "You busted!\nYou lose 😢";
        document.getElementById("dealer-sum").innerText = dealerSum;
        document.getElementById("your-sum").innerText = yourSum;
        document.getElementById("results").innerText = message;
        document.getElementById("resetGame").addEventListener("click", nextRound);
    }
}//

//the function to play the game
function endRound() {
    if (canStand == false){
        return
    }
    canStand = false;
    canHit = false;

    while (dealerSum < 17) {
        //<img src="./cards/4-C.png">
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
    }
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    console.log(dealerSum);
    yourSum = reduceAce(yourSum, yourAceCount);
    console.log(yourSum)

    // Reveal hidden card
    document.getElementById("hidden").src = "./cards/" + hidden + ".png";

    let message = "";
    if (yourSum == dealerSum) { //when the player's score = the dealer's score, the player's money is returned
        message = "Standoff!\nYour bet has been returned 😊";
        balance += betAmount;
    }
    else if (yourSum > 21) { //when the player's score > 21, the player loses
        message = "You busted!\nYou lose 😢"; 
    }
    else if (dealerSum > 21) { //when the dealer's score > 21, the player wins
        balance += betAmount * 2;
        message = "The dealer busted!\nYou win 🥳\nYou made: $" + betAmount * 2;
    }
    else if (yourSum > dealerSum) { //if 21 > player > dealer, the player wins
        balance += betAmount * 2;        
        message = "You have a higher hand!\nYou win 🥳\nYou made: $" + betAmount * 2;
    }
    else if (yourSum < dealerSum) { //if 21 > dealer > player, the player loses
        message = "The dealer has a higher hand!\nYou lose 😢";
    }

    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("results").innerText = message;
    updateMoneyDisplay();

    document.getElementById("resetGame").addEventListener("click", nextRound);
}

//get card value - correspond the cards with their corresponding value, and the special cases are J, Q, K and A, where JQK = 10 points and A = 11 points
function getValue(card) {
    let data = card.split("-"); // "4-C" -> ["4", "C"]
    let value = data[0];

    if (isNaN(value)) { //A J Q K
        if (value == "A") {
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

//check
function checkAce(card) {
    if (card[0] == "A") {
        return 1;
    }
    return 0;
}

//reduce the ace - when the player has a score value greater than 21
function reduceAce(playerSum, playerAceCount) {
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount-- ;
    }
    return playerSum;
}

//entering the next round - dealer's score and the player's score get to zero and give the cards again
function nextRound(){
    dealerSum = 0;
    yourSum = 0;
    dealerAceCount = 0;
    yourAceCount = 0; 
    hidden = "";
    canHit = false;
    canStand = false;
    canBet = true;

    makeDeck();
    shuffleDeck();

    document.getElementById("dealer-cards").innerHTML = '<img id="hidden" src="./cards/BACK.png" style="display: none;">';
    document.getElementById("your-cards").innerHTML = "";
    document.getElementById("results").innerText = "";
    document.getElementById("dealer-sum").innerText = "";
    document.getElementById("your-sum").innerText = "";

    let hiddenCard = document.getElementById("hidden");
    hiddenCard.style.display = "none";
}