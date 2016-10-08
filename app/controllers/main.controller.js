(function () {
    angular.module('footballClub')
        .controller('mainController', [mainController]);

    function mainController() {

        var vm = this;

        vm.playersSelected = true;

        vm.playersClick = function () {
            vm.playersSelected = true;
        };

        vm.gamesClick = function () {
            vm.playersSelected = false;
        };

    }
})();