(function () {
    angular.module('footballClub')
        .controller('gameController', ['gameFactory', gameController]);

    function gameController(gameFactory) {

        var vm = this;

        refresh();

        vm.newGame = function () {
            vm.game = gameFactory.newGame();
            vm.proposal = true;
        };

        vm.saveGame = function(){
            gameFactory.setActiveGame(vm.game);
        };

        vm.completeGame = function () {
            gameFactory.addToHistory(gameFactory.getActiveGame());
            gameFactory.setActiveGame(null);
            refresh();
        };

        vm.acceptProposal = function () {
            gameFactory.addToHistory(gameFactory.getActiveGame());
            vm.game.date = new Date().toLocaleString();
            gameFactory.setActiveGame(vm.game);
            refresh();
        };

        vm.cancelProposal = function () {
            refresh();
        };

        vm.hasActiveGame = function () {
            if (gameFactory.getActiveGame()) {
                return true;
            } else {
                return false;
            }
        };

        vm.clearHistory = function () {
            gameFactory.clearHistory();
            refresh();
        };

        function refresh() {
            vm.proposal = false;
            vm.game = gameFactory.getActiveGame();
            vm.history = gameFactory.getAllHistory();
        }
    }
})();