# football-club
*Football Club is a mobile web app for creating random backyard football teams.*

## Players
*The players tab allows you to manage the pool of football players.*

**You Can:**
* Add a player
* Delete a player
* Designate a player as all time QB.

## Games
*The games tab allows you to generate random teams and tracks team history.*
### New Game 
* Will generate a random proposal of two teams. Note the all time QB is not considered part of either team.

**You Can:**
* Accept the proposal which sets the proposed game as the "active game".
* Cancel the proposal which will restore the previous "active game".
* Regenerate which will create another random game proposal. 

### Game History
*When a game is considered "complete" it is moved into the game history.*
* A game is considered complete when you click "Complete Game" after accepting a game proposal.
* If you accept a new game proposal while there is already an active accepted game, the previous active game is considered complete and moved to history.
* There is a clear history button to easily clear out the game history.

## Development
This is a fully client side AngularJS application using bootstrap 3 for styling.

The players list and history are stored in browser local storage.

The app uses npm for dependencies.
* On a command line run *npm install* to install all required dependencies.
* Install light-server globally with *npm install -g lite-server*
* On the command line type the command *npm run dev* to run locally.
