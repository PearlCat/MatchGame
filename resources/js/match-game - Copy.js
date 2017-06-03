$(document).ready(function(){

var MatchGame = {};
var displayTime;
var Start;

/*
  Generates and returns an array of matching card values.
 */
MatchGame.generateCardValues = function () {

  var numbers = [];
  for (i=1; i<9; i++){
    numbers.push(i);
    numbers.push(i);
  }

  /*var numbers =['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H'];*/

  var cardValues = [];
  while (numbers.length > 0){
    var arrayIndex = Math.floor(Math.random()*numbers.length);
    cardValues.push(numbers[arrayIndex]);
    numbers.splice(arrayIndex, 1);
  }

  return cardValues;
}; /* end of generate card values */

/* display elapsed timer */
MatchGame.elapsedTime = function(timeStart){
  var timeStop = new Date();
  var duration = timeStop.getTime() - timeStart.getTime();
  $('#timer').css("display", "block").text(duration/1000);
}

/*
  Converts card values to jQuery card objects and adds them to the supplied game
  object.
*/
MatchGame.renderCards = function(cardValues, $game) {

  $('#victory').css("display", "none");
  $('#timer').css("display", "none");
  var colors = ["hsl(25, 85%, 65%)", "hsl(55, 85%, 65%)", "hsl(90, 85%, 65%)", "hsl(160, 85%, 65%)", "hsl(220, 85%, 65%)", "hsl(265, 85%, 65%)", "hsl(310, 85%, 65%)", "hsl(360, 85%, 65%)"];
  $game.empty();

  for (i=0; i < cardValues.length; i++){
    var cValue = cardValues[i];
    var colorValue = colors[cValue -1];
    var data ={value: cValue, color: colorValue, flipped: false };
    var $cardHTML = $('<div class ="col-xs-3 card"></div>');
    $cardHTML.data(data);
    $game.append($cardHTML);
  }

  $game.data('cardsShown', []); /* keep data of cards clicked before match */
  $game.data('cardsMatch', 0); /* count number of matches made */
  var cards = $game.data('cardsShown');
  var count = 0; /* keep track of number of click made*/

  $('.card').click(function(){
    /* start timer when the first click is made */
    count = count + 1;
    if (count === 1) {
      var Start = new Date();
      displayTime = setInterval(function(){ MatchGame.elapsedTime(Start)}, 200);
      }
    /* run flip card */
    MatchGame.flipCard($(this), $('#game'));
  }); /* end of .card click */

}; /*end of renderCards */

/*
  Flips over a given card and checks to see if two cards are flipped over.
  Updates styles on flipped cards depending whether they are a match or not.
 */
MatchGame.flipCard = function($card, $game) {

  if ($card.data("flipped") === true) {
  return }

  $card.css('background-color', $card.data('color')).text($card.data('value')).data('flipped', true);

  var cardsShown = $game.data('cardsShown');
  cardsShown.push($card);

  if(cardsShown.length === 2) {
    var card1 = cardsShown[0];
    var card2 = cardsShown[1];
    var no1 = card1.data('value');
    var no2 = card2.data('value');
    if (no1 === no2) {
      /* play sound */
      var audio = new Audio('./resources/sound/341695__projectsu012__coins-1.wav');
      audio.play()
      /* display matching cards */
      card1.animate({fontSize: "9rem"});
      card2.animate({fontSize: "9rem"});
      card1.animate({
        fontSize: "7rem"
      }, 200, function() {
          card1.css("background-color", "rgb(153, 153, 153)");
          card1.css("color", "rgb(24, 24, 24)");
          card1.text(cards1.data('value'));
        });
        card2.animate({
          fontSize: "7rem"
        }, 200, function() {
            card2.css("background-color", "rgb(153, 153, 153)");
            card2.css("color", "rgb(24, 24, 24)");
            card1.text(cards2.data('value'));
          });
      /* increament the number of cards matched */
      var n = $game.data('cardsMatch');
      n = n + 2;
      $game.data('cardsMatch', n);
      /* display win message and stop timing when no of cards match equals 16 */
        if($game.data('cardsMatch') === 16) {
          clearInterval(displayTime);
          /*count = 0;*/
          $('#victory').css("display", "flex");
          }/* end of display win message and stop timing when cardsMatch equals 16 */
        } /*end of if equal*/
        else {
          window.setTimeout(function(){
          card1.css('background-color', 'rgb(32, 64, 86)').text("").data('flipped', false);
  		    card2.css('background-color', 'rgb(32, 64, 86)').text("").data('flipped', false);
          },
          400);
        } /* end of else not equal*/

    /* reset cardShown */
    $game.data('cardsShown', []);
  } /* end of if cardsShown.length === 2 */
}; /*End of flip card */

/*
  Sets up a new game after HTML document has loaded.
  Renders a 4x4 board of cards.
*/
MatchGame.renderCards(MatchGame.generateCardValues(), $('#game'));


/* reset game when reset button is clicked */
$('#reset').click(function(){
  $('#victory').css("display", "none");
  $('#timer').css("display", "none");
  clearInterval(displayTime);
  MatchGame.renderCards(MatchGame.generateCardValues(), $('#game'));
});


/* end of document ready method*/
});
