<script>
// https://www.youtube.com/watch?v=ZgUAT7CIhsY
// cd C:\Users\krasi\Documents\PhoneGapAPPs\GuessTheNumber
window.onload = newgame;        // Start a new game when we load
window.onpopstate = popState;   // Handle history events
var state, ui;                  // Globals initialized in newgame()

function newgame(playagain) {   // Begin a new game of guess-the-number
    // Set up an object to hold document elements we care about
    ui = {
        heading: null, // The <h1> at the top of the document.
        prompt: null,  // Ask the user to enter a guess.
        input: null,   // Where the user enters the guess.
        low: null,     // Three table cells for the visual representation
        mid: null,     // ...of the range of numbers to guess.
        high: null
    };
    // Look up each of these element ids
    for(var id in ui) ui[id] = document.getElementById(id);

    // Define an event handler for the input field
    ui.input.onchange = handleGuess;

    // Pick a random number and initialize game state
    state = {
        n: Math.floor(99 * Math.random()) + 1,  // An integer: 0 < n < 100
        low: 0,            // The lower bound (exclusive) on guesses
        high: 100,         // The upper bound (exclusive) on guesses
        guessnum: 0,       // How many guesses have been made
        guess: undefined   // What the last guess was
    };
    
    // Modify document content to display this initial state
    display(state);  

    // This function is called as the onload event handler, and is also called
    // by the Play Again button displayed at the end of a game. The playagain
    // argument will be true in that second case. If it is true, then we save
    // the new game state. But if we were called in response to a load event,
    // we don't save the state. This is because load events will also occur
    // when we step backwards through the browser history from some other 
    // document into the existing state of a game. If we were to save a new
    // initial state, in that case we would overwrite the acutal historical 
    // state of the game. In browsers that support pushState(), the load event
    // is always followed by a popstate event. So rather than saving state here,
    // we wait for the popstate. If it gives us a state object, we just use 
    // that. Otherwise, if the popstate has a null state, we know this is
    // really a new game and we use replaceState to save the new game state.
    if (playagain === true) save(state);
}

// Save game state into browser history with pushState(), if it is supported
function save(state) {  
    if (!history.pushState) return; // Do nothing if pushState() not defined

    // We'll associate a URL with the saved state. This URL displays the 
    // guess number, but does not encode the game state, so it is not useful
    // to bookmark. We can't easily put game state in the URL because it would 
    // make the secret number visible in the location bar. 
    var url = "#guess" + state.guessnum;
    // Now save the state object and the URL
    history.pushState(state,  // State object to save
                      "",     // State title: current browsers ignore this
                      url);   // State URL: not useful to bookmark
}

// This is the onpopstate event handler that restores historical states.
function popState(event) {
    if (event.state) {  // If the event has a state object, restore that state
        // Note that event.state is a deep copy of the saved state object
        // so we can modify it without altering the saved value.
        state = event.state;    // Restore the historical state
        display(state);         // Display the restored state
    }
    else {
        // When we load the page for the first time, we'll get a popstate event
        // with no state. Replace that null state with our real state: see the
        // comment in newgame(). No need to call display() here.
        history.replaceState(state, "", "#guess" + state.guessnum);
    }
};

// This event handler is invoked each time the user guesses a number.
// It updates the game state, saves it, and displays it.
function handleGuess() {
    // Get the user's guess from the input field
    var g = parseInt(this.value);
    // If it is a number and is in the right range
    if ((g > state.low) && (g < state.high)) { 
        // Update the state object based on this guess
        if (g < state.n) state.low = g;          
        else if (g > state.n) state.high = g;
        state.guess = g;
        state.guessnum++;
        // Now save the new state in the browser's history
        save(state);
        // Modify the document to respond to the user's guess
        display(state);
    }
    else {  // An invalid guess: don't push a new history state
        alert("Please enter a number greater than " + state.low +
              " and less than " + state.high);
    }
}

// Modify the document to display the current state of the game.
function display(state) { 
    // Display document heading and title
    ui.heading.innerHTML = document.title =
        "Guess the number between " +
        state.low + " and " + state.high + ".";

    // Display a visual representation of the range of numbers using a table
    ui.low.style.width = state.low + "%";
    ui.mid.style.width = (state.high-state.low) + "%";
    ui.high.style.width = (100-state.high) + "%";

    // Make sure the input field is visible, empty, and focused
    ui.input.style.visibility = "visible"; 
    ui.input.value = "";
    ui.input.focus();
 //  ui.state.guessnum = "guessnum" + guessnum;

    // Set the prompt based on the user's most recent guess
    if (state.guess === undefined)
        ui.prompt.innerHTML = "Type your guess and hit Enter: ";

    else if (state.guess < state.n)
        ui.prompt.innerHTML = state.guess + " is too low. Guess again: ";
    else if (state.guess > state.n)
        ui.prompt.innerHTML = state.guess + " is too high. Guess again: ";
    else {
        // When correct, hide the input field and show a Play Again button.
        ui.input.style.visibility = "hidden";  // No more guesses now
        ui.heading.innerHTML = document.title = state.guess + " is correct! ";
        ui.prompt.innerHTML = "After " +
            state.guessnum + " OPITA You Win finaly :D! <button onclick='newgame(true)'>Play Again?</button>";
		//	ui.prompt.innerHTML = state.guessnum + "?guessnum";  // <<< KRASI!!!
    }
}
</script>