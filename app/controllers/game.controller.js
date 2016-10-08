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

        vm.completeGame = function() {
            gameFactory.addToHistory(gameFactory.getActiveGame());
            gameFactory.setActiveGame(null);
            refresh();
        };

        vm.acceptProposal = function () {
            gameFactory.addToHistory(gameFactory.getActiveGame());
            gameFactory.setActiveGame(vm.game);
            refresh();
        };

        vm.cancelProposal = function () {
            refresh();
        };

        function refresh() {
            vm.proposal = false;
            vm.game = gameFactory.getActiveGame();
            vm.history = gameFactory.getAllHistory();
        }
    }
})();