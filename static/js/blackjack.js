let blackjackGame = {
   'you': { 'scoreSpan': '#your-blackjack-result', 'div': '#your-box', 'score': 0 },
   'dealer': { 'scoreSpan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score': 0 },
   'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
   'cardsMap': { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 10, 'Q': 10, 'K': 10, 'A': [1, 11] },
   'wins': 0,
   'losses': 0,
   'draws': 0,
   'isStand': false,
   'turnsOver' : false
};

const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];

const hitSound = new Audio('static/sounds/swish.m4a');
const winSound = new Audio('static/sounds/cash.mp3');
const lostSound = new Audio('static/sounds/aww.mp3');

document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackHit);

document.querySelector('#blackjack-stand-button').addEventListener('click', dealerLogic);

document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackDeal);

function blackjackHit() {
   if (blackjackGame['isStand'] === false) {
      let card = randomCard();
      showCard(YOU, card);
      updateScore(card, YOU);
      showScore(YOU);
   }
}

function showCard(activePlayer, card) {
   if (activePlayer['score'] <= 21) {
      let cardImage = document.createElement('img');
      cardImage.src = `static/images/${card}.png`;
      document.querySelector(activePlayer['div']).appendChild(cardImage);
      hitSound.play();
   }
}

function blackjackDeal() {
   if (blackjackGame['turnsOver'] === true) {
      blackjackGame['isStand'] = false;
      let yourImages = document.querySelector('#your-box').querySelectorAll('img');
      let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');
      for (i = 0; i < yourImages.length; i++) {
         yourImages[i].remove();
      }
      for (i = 0; i < dealerImages.length; i++) {
         dealerImages[i].remove();
      }
      YOU['score'] = 0;
      DEALER['score'] = 0;

      document.querySelector('#your-blackjack-result').textContent = 0;
      document.querySelector('#your-blackjack-result').style.color = '#ffffff';
      document.querySelector('#dealer-blackjack-result').textContent = 0;
      document.querySelector('#dealer-blackjack-result').style.color = '#ffffff';

      document.querySelector('#blackjack-result').textContent = "Let's Play";
      document.querySelector('#blackjack-result').style.color = '#000000';
      blackjackGame['turnsOver'] = true;
   }
}

function randomCard() {
   let randomIndex = Math.floor(Math.random() * 13);
   return blackjackGame['cards'][randomIndex];
}

function updateScore(card, activePlayer) 
{
   if (card === 'A') {
      if (activePlayer['score'] + blackjackGame['cardsMap'][card][1] <= 21)
      {
         activePlayer['score'] += blackjackGame['cardsMap'][card][1];
      } else
      {
         activePlayer['score'] += blackjackGame['cardsMap'][card][0];   
      }
   } else
   {
      activePlayer['score'] += blackjackGame['cardsMap'][card];
   }
}

function showScore(activePlayer) {
      if (activePlayer['score'] > 21) {
         document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST';
         document.querySelector(activePlayer['scoreSpan']).style.color = 'red';

      } else {
         document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
      }
}

function sleeep(ms) {
   return new Promise(resolve => setTimeout(resolve, ms));
}

async function dealerLogic() {
   blackjackGame['isStand'] = true;
   while (DEALER['score'] < 16 && blackjackGame['isStand'] === true) {
      let card = randomCard();
      showCard(DEALER, card);
      updateScore(card, DEALER);
      showScore(DEALER);
      await sleeep(1000);
   }

   blackjackGame['turnsOver'] = true;
   let winner = computerWinner();
   showResult(winner);
}

function computerWinner() {
   let winner;

   if (YOU['score'] <= 21) {
      if (YOU['score'] > DEALER['score'] || DEALER['score'] > 21) {
         blackjackGame['wins']++;
         winner = YOU;
      } else if (YOU['score'] < DEALER['score']) {
         blackjackGame['losses']++;
         winner = DEALER;
      } else if (YOU['score'] === DEALER['score']) {
         blackjackGame['draws']++;
      } 
   } else if (YOU['score'] > 21 && DEALER['score'] < 21) {
      blackjackGame['losses']++;
      winner = DEALER;
   } else if (YOU['score'] > 21 && DEALER['score'] > 21) {
      blackjackGame['draws']++;
   }
   return winner;
}

function showResult(winner) {
   if (blackjackGame['turnsOver'] === true) {
      let message, messageColor;
      if (winner === YOU) {
         message = 'You Won!';
         messageColor = 'green';
         winSound.play();
         document.querySelector('#wins').textContent = blackjackGame['wins'];
      } else if (winner === DEALER) {
         message = 'You Lost!';
         messageColor = 'red';
         lostSound.play();
         document.querySelector('#losses').textContent = blackjackGame['losses'];
      } else {
         message = 'You Drew!';
         messageColor = 'Black';
         document.querySelector('#draws').textContent = blackjackGame['draws'];
      }
      document.querySelector('#blackjack-result').textContent = message;
      document.querySelector('#blackjack-result').style.color = messageColor;
   }
}
