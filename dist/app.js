var Player = (function () {
    function Player() {
    }
    return Player;
}());
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../models/player.ts" />
var app;
(function (app) {
    var controllers;
    (function (controllers) {
        var PlayersController = (function () {
            function PlayersController(playerFactory) {
                this.playerFactory = playerFactory;
            }
            PlayersController.prototype.addPlayer = function () {
                if (this.playerToAdd.name) {
                    this.playerToAdd.name = this.playerToAdd.name.toLowerCase();
                    this.playerFactory.add(this.playerToAdd);
                    this.refresh();
                }
            };
            PlayersController.prototype.deletePlayer = function (idx) {
                this.playerFactory.del(idx);
                this.refresh();
            };
            PlayersController.prototype.toggleQB = function (idx) {
                this.playerFactory.toggleQB(idx);
                this.refresh();
            };
            PlayersController.prototype.refresh = function () {
                this.players = this.playerFactory.getAll();
                this.playerToAdd = this.playerFactory.newPlayer('');
            };
            PlayersController.controllerID = 'playersController';
            PlayersController.$inject = ['playerFactory'];
            return PlayersController;
        }());
        controllers.PlayersController = PlayersController;
        angular.module('footballClub')
            .controller(PlayersController.controllerID, ['playerFactory', PlayersController]);
    })(controllers = app.controllers || (app.controllers = {}));
})(app || (app = {}));
//# sourceMappingURL=app.js.map