(function () {
    angular.module('footballClub')
        .controller('gameController', ['gameFactory', gameController]);

    function gameController(gameFactory) {

        var vm = this;

        vm.newGame = function () {
            if (vm.game){
                gameFactory.addToHistory(vm.game);
            }
            vm.game = gameFactory.newGame();
            refresh();
        };

        refresh = function() {
            vm.history = gameFactory.getAllHistory();
        }
    }
})();