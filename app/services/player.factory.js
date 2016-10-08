(function () {
    angular.module('footballClub')
        .factory('playerFactory', ['localStorageService', playerFactory]);

    function playerFactory(localStorageService) {

        var playerKey = 'players';
        var playerFactory = {};

        playerFactory.getAll = function () {
            return localStorageService.get(playerKey) || [];
        };

        playerFactory.add = function (player) {
            var playerList = playerFactory.getAll();
            playerList.push(player);
            localStorageService.set(playerKey, playerList);
        };

        playerFactory.del = function (idx) {
            var playerList = playerFactory.getAll();
            playerList.splice(idx, 1);
            localStorageService.set(playerKey, playerList);
        };

        playerFactory.toggleQB = function (idx) {
            var playerList = playerFactory.getAll();
            var len = playerList.length;
            for (var i = 0; i < len; i++) {
                if (i === idx) {
                    playerList[i].isQB = !playerList[i].isQB
                } else {
                    playerList[i].isQB = false;
                }
            }
            localStorageService.set(playerKey, playerList);
        };

        playerFactory.newPlayer = function (playerName) {
            return {
                isQB: false,
                name: playerName
            };
        };

        return playerFactory;
    }
})();