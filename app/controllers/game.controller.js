(function () {
    angular.module('footballClub')
        .controller('gameController', ['$scope', 'gameFactory', gameController]);

    function gameController($scope, gameFactory) {

        var vm = this;

        vm.game = gameFactory.initGame();

        vm.newGame = function () {
            vm.game = gameFactory.newGame();
            $scope.apply();
        };

    }
})();