(function () {

    angular.module('footballClub')
        .factory('gameFactory', ['localStorageService', 'playerFactory', '$rootScope', gameFactory]);

    function gameFactory(localStorageService, playerFactory, $rootScope) {

        var gamesHistoryKey = 'gamesHistory';
        var activeGameKey = 'activeGame';
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
            if (game) {
                var date = new Date();
                game.date = date.toLocaleString();
                game.groupID = (date.getMonth() + 1).toString() + "/" + date.getDate().toString() + "/" + date.getFullYear();
                var gamesList = gameFactory.getAllHistory();
                gamesList.splice(0, 0, game);
                localStorageService.set(gamesHistoryKey, gamesList);
                $rootScope.$broadcast('historyUpdate');
            }
        };

        gameFactory.getActiveGame = function () {
            return localStorageService.get(activeGameKey);
        };

        gameFactory.setActiveGame = function (game) {
            return localStorageService.set(activeGameKey, game);
        };

        gameFactory.getAllHistory = function () {
            return localStorageService.get(gamesHistoryKey) || [];
        };

        gameFactory.clearHistory = function () {
            localStorageService.set(gamesHistoryKey, null);
            $rootScope.$broadcast('historyUpdate');
        };

        gameFactory.initGame = function () {
            return {
                groupID: '',
                date: '',
                qb: null,
                team1: [],
                team2: [],
                team1Score: null,
                team2Score: null
            }
        };

        return gameFactory;
    }
})();