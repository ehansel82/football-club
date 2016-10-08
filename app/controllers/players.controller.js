(function () {
    angular.module('footballClub')
        .controller('playersController', ['$scope', 'playerFactory', playersController]);

    function playersController($scope, playerFactory) {

        var vm = this;
        
        vm.addPlayer = function () {
            playerFactory.add(vm.playerToAdd);
            vm.refresh();
        }

        vm.deletePlayer = function (idx) {
            playerFactory.del(idx);
            vm.refresh();
        }

        vm.toggleQB = function (idx) {
            playerFactory.toggleQB(idx);
            vm.refresh();
        }

        vm.refresh = function() {
            vm.players = playerFactory.getAll();
            vm.playerToAdd = playerFactory.newPlayer('');
        }
    }
})();