(function () {
    angular.module('footballClub')
        .controller('mainController', ['APP_VERSION', mainController]);

    function mainController(APP_VERSION) {

        var vm = this;

        vm.version = APP_VERSION;

        vm.playersSelected = true;
        vm.gamesSelected = false;
        vm.statsSelected = false;

        vm.playersClick = function () {
            clearAll();
            vm.playersSelected = true;
        };

        vm.gamesClick = function () {
            clearAll();
            vm.gamesSelected = true;
        };

        vm.statsClick = function () {
            clearAll();
            vm.statsSelected = true;
        };

        function clearAll() {
            vm.playersSelected = false;
            vm.gamesSelected = false;
            vm.statsSelected = false;
        }

    }
})();