(function () {
    angular.module('footballClub')
        .factory('gameFactory', ['localStorageService', 'playerFactory', gameFactory]);

    function gameFactory(localStorageService, playerFactory) {

        var gamesHistoryKey = 'gamesHistory';
        var gameFactory = {};

        gameFactory.newGame = function () {
            var game = gameFactory.initGame();

            var players = playerFactory.getAll().slice(0);
            var len = players.length;
            var qb = null;
            for (var i = 0; i < len; i++) {
                if (players[i].isQB) {
                    game.qb = players.splice(i, 1)[0];
                    break;
                }
            }
            var shuffledPlayers = window.knuthShuffle(players);
            var half_length = Math.ceil(shuffledPlayers.length / 2);
            game.team1 = shuffledPlayers.splice(0, half_length);
            game.team2 = shuffledPlayers;
            return game;
        };

        gameFactory.addToHistory = function (game) {
            var gamesList = gameFactory.getAllHistory();
            gamesList.splice(0, 0, game);
            localStorageService.set(gamesHistoryKey, gamesList);
        };

        gameFactory.getAllHistory = function () {
            return localStorageService.get(gamesHistoryKey) || [];
        };

        gameFactory.initGame = function () {
            return {
                qb: null,
                team1: [],
                team2: []
            }
        }

        return gameFactory;
    }
})();