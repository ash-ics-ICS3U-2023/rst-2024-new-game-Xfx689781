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

// Ensuring that all pages are loaded elements before any other type of scripts is executed 
window.onload = function() {
    makeDeck(); // Making the 
    shuffleDeck(); //Shuffling the deck function
    updateMoneyDisplay(); // update the money display after each bet
    checkBalance(); //calclating the balance 
    document.getElementById("placeBet").addEventListener("click", placeBet); 
    document.getElementById("outOfMoney").addEventListener("click", atm); 
}

//the function checks the balance
function checkBalance(){
    if (balance == 0){
        broke = true;
        //console.log(broke);
    } // check if the balance is 0 and therefore applting if the being broke is true or not
    else{
        broke = false;
        //console.log(broke);
    }
}

//the atm function are activated when out of money
function atm(){
    //console.log("ATM")
    // Function for giving money to player when they out
    if (broke == false){ // Doesnt give money if use is not at 0$
        return
    }
    else{
    //Gives player 10$, updates the money display, displays text, and resets the broke status
    balance += 10;
    console.log(balance);
    updateMoneyDisplay();
    document.getElementById("results").innerText = "You went to the atm and withdrew $10, keep on gambling!";
    broke = false;
    }
}

//the function update the player's money display after each game
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
    //deck.push('R-J', 'B-J');    ** would have been used for joker function but we did not have time to finish it
    //console.log(deck); check deck
}

//shuffle the card deck
function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length);
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    //console.log(deck); check shuffle
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
        // Show first face card for dealer
        let displayCard = document.createElement("img");
        let card = deck.pop();
        displayCard.src = "./cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(displayCard);
    console.log(dealerSum);

    // Generate two random cards from shuffled deck and give them images and value, add them to user score
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
    // Case for if you draw blackjack (21)
    if (yourSum == 21){
        // Similar to stand function it ends the game and resets it
        canHit = false; //if the player's score = 21, the player cannot hit or stand, and that person wins 5 times of the money he/she paid for
        canStand = false;
        document.getElementById("hidden").src = "./cards/" + hidden + ".png";
        let message = ""
        balance += betAmount * 5;
        message = "Blackjack!\nBig winner 💰\nYou made: $" + betAmount * 5;
        document.getElementById("dealer-sum").innerText = dealerSum;
        document.getElementById("your-sum").innerText = yourSum;
        document.getElementById("results").innerText = message;
        document.getElementById("resetGame").addEventListener("click", nextRound);
        updateMoneyDisplay();
    }
    // Give purpose to hit and stand button
    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", endRound);

}

//the function to control hits
function hit() {
    if (canHit == false) {
        return;
    }
    // generate image for the drawn cards
    let displayCard = document.createElement("img");
    let card = deck.pop();
    displayCard.src = "./cards/" + card + ".png";
    // Update the value of user score
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(displayCard);

        // Case for if you bust off of a hit
    if (reduceAce(yourSum, yourAceCount) > 21) { //when the player burst, the player cannot hit or stand
        canHit = false;
        canStand = false;
        // Similar to stand function it ends the game and resets it
        document.getElementById("hidden").src = "./cards/" + hidden + ".png";
        let message = ""
        message = "You busted!\nYou lose 😢";
        document.getElementById("dealer-sum").innerText = dealerSum;
        document.getElementById("your-sum").innerText = yourSum;
        document.getElementById("results").innerText = message;
        document.getElementById("resetGame").addEventListener("click", nextRound);
    }
}//

// Function that happens when you click stand
function endRound() {
    // Do nothing if you are not supposed to be able to stand
    if (canStand == false){
        return
    }
    // Stops stand and hit buttons from being pressed again
    canStand = false;
    canHit = false;
    // Giver dealer more cards until they are above 17
    while (dealerSum < 17) {
        // The code generates images for new cards
        let cardImg = document.createElement("img");
        let card = deck.pop();
        // Create text that the html page can read to produce an image
        cardImg.src = "./cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        // Send to game.html page
        document.getElementById("dealer-cards").append(cardImg);
    }
    // Ace check functions
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    //console.log(dealerSum);
    yourSum = reduceAce(yourSum, yourAceCount);
    //console.log(yourSum)

    // Reveal hidden card
    document.getElementById("hidden").src = "./cards/" + hidden + ".png";

    // Create message for the html page to display
    let message = "";
    if (yourSum == dealerSum) { //when the player's score = the dealer's score, its a standoff and bets are teurned
        message = "Standoff!\nYour bet has been returned 😊";
        balance += betAmount; // Edit money
    }
    else if (yourSum > 21) { //when the player's score > 21, the player loses they busted
        message = "You busted!\nYou lose 😢"; 
    }
    else if (dealerSum > 21) { //when the dealer's score > 21, the player wins the dealer busted
        balance += betAmount * 2; // Edit money
        message = "The dealer busted!\nYou win 🥳\nYou made: $" + betAmount * 2;
    }
    else if (yourSum > dealerSum) { //if player > dealer, the player wins
        balance += betAmount * 2;       // Edit money  
        message = "You have a higher hand!\nYou win 🥳\nYou made: $" + betAmount * 2;
    }
    else if (yourSum < dealerSum) { //if dealer > player, the player loses
        message = "The dealer has a higher hand!\nYou lose 😢";
    }

    // Update and display user score, dealer score put result message in result box
    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("results").innerText = message;
    updateMoneyDisplay(); // update money
    //Add event to play again button so the user can play another round
    document.getElementById("resetGame").addEventListener("click", nextRound);
}

// functino that reads the chosen value from thee shuffled card deck array
function getValue(card) {
    let data = card.split("-"); // splits value from deck array into two values in a new array. Ex. the data variable would be: data = ["4", "C"]
    let value = data[0];

    if (isNaN(value)) { // A face card or ace
        if (value == "A") { // Ace value
            return 11;
        }
        return 10; // queen, king, jack value is 100
    }
    return parseInt(value);
}

//check for ace card off of draw (Aces off of a draw are equal to 1 not 11)
function checkAce(card) {
    if (card[0] == "A") {
        return 1;
    }
    return 0;
}

// If the plays score is over 21 and they have an ace it could be that high because their ace is worth 11 when it shold be worth 1
function reduceAce(playerSum, playerAceCount) {
    // This function takes away 10 from 11 to make the ace worth 1
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount-- ;
    }
    return playerSum;
}

//entering the next round - dealer's score and the player's score get to zero and give the cards again
function nextRound(){
    // Resest global variables
    dealerSum = 0;
    yourSum = 0;
    dealerAceCount = 0;
    yourAceCount = 0; 
    hidden = "";
    canHit = false;
    canStand = false;
    canBet = true;
    // Reshuffle deck
    makeDeck();
    shuffleDeck();
    checkBalance();

    // Reset text boxes
    document.getElementById("dealer-cards").innerHTML = '<img id="hidden" src="./cards/BACK.png" style="display: none;">';
    document.getElementById("your-cards").innerHTML = "";
    document.getElementById("results").innerText = "";
    document.getElementById("dealer-sum").innerText = "";
    document.getElementById("your-sum").innerText = "";
    // Hide the first card of the dealer
    let hiddenCard = document.getElementById("hidden");
    hiddenCard.style.display = "none";
}