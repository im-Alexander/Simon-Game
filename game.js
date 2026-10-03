/** instance variables */
var buttonColors = ["red", "blue", "green", "yellow"];  // an array of all the button colors
var gamePattern = [];                                   // stores the game pattern
var userClickedPattern = [];                            // stores the user click pattern
var level = 0;                                          // keeps track of players level
var highScore = 0;

/** Starts game */
function startGame(){
    
}

/** generates the sequence of buttons to be clicked */
function nextSequence() {
    var randomNumber = Math.floor(Math.random() * 4);       // a random number from 0 to 3
    var randomChosenColor = buttonColors[randomNumber];     // the color associated with the random number
    gamePattern.push(randomChosenColor);                    // add the color to the stack

    $("#level-title").html("Level " + gamePattern.length);  // displays current level

    flashColor(randomChosenColor);                          // flashes the chosen color
}

/** Detects a key down event */
$("body").keydown( function () {
    // if statement to make sure a game is not in progress
    if (gamePattern.length === 0) {
        $(".startButton").addClass("invisible");
        nextSequence();     // calls the next sequence function to start the game
        level = 1;
    }
});

$(".startButton").click( function () {
    if (gamePattern.length === 0) {
        $(".startButton").addClass("invisible");
        nextSequence();     // calls the next sequence function to start the game
        level = 1;
    }
});

/** when the user clicks a button */
$(".btn").click(function userClick() {
    userClickedPattern.push($(this).attr("id"));        // adds the selected color to the user clicked pattern array
    animatePress($(this).attr("id"));                   // plays the sound and flashes the color of the selected button
    checkAnswer(level - 1);                             // checks if the player got the correct answer
});

/** checks players answer */
function checkAnswer(currentLevel) {
    // edge case if they haven't started
    if (level == 0) {
        startOver();
    } else if (gamePattern[currentLevel] == userClickedPattern[currentLevel]) { // if they get the correct answer

        // goes to the next game level
        if (gamePattern.length === userClickedPattern.length) {
            setTimeout(nextSequence, 1000);
            level = 0;
            userClickedPattern = [];
        }

        level++;

    } else {        // if they guess wrong
        startOver();
    }
}

function startOver() {
    if(highScore < gamePattern.length - 1)
        highScore = gamePattern.length - 1;

    gameOverEffect();
    gamePattern = [];
    userClickedPattern = [];

    level = 0;
}

/** -------   VISUAL AND AUDIO EFFECTS ------- */

/** function that flashes color */
function flashColor(color) {
    playSound(color);                           // calls play sound function
    $("." + color).fadeOut(150).fadeIn(150);    // flashes the button
}

/** Plays the button press animation */
function animatePress(currentColor) {
    playSound(currentColor);                     // play sound
    $("." + currentColor).addClass("pressed");   // adds the pressed class to the selected button

    // removes pressed class after 100ms
    setTimeout(function () {
        $("." + currentColor).removeClass("pressed");
    }, 100);
}

/** Plays sound */
function playSound(color) {
    var colorSound = new Audio("./sounds/" + color + ".mp3");   // creates the sound variable
    colorSound.play();                                          // plays the sound of the selected color
}

/** Game over effect */
function gameOverEffect() {
    var gameOverSound = new Audio("./sounds/wrong.mp3");   // creates the sound variable
    gameOverSound.play();                                  // plays sound
    $("#level-title").html("Game Over, Press Any Key or");
    $(".startButton").html("Click here to play again!");
    $(".startButton").removeClass("invisible");
    $(".highScoreText").html("High Score : " + highScore);

    // flashes screen red for 200ms 
    $("body").addClass("game-over").delay(200).queue(function () {
        $("body").removeClass("game-over").dequeue();
    });
}