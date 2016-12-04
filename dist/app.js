var Game = (function () {
    function Game() {
    }
    return Game;
}());
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../models/game.ts" />
var app;
(function (app) {
    var controllers;
    (function (controllers) {
        var GameController = (function () {
            /* @ngInject */
            function GameController(gameFactory) {
                this.gameFactory = gameFactory;
            }
            GameController.prototype.refresh = function () {
                this.proposal = false;
                this.game = this.gameFactory.getActiveGame();
                this.history = this.gameFactory.getAllHistory();
            };
            GameController.prototype.newGame = function () {
                this.game = this.gameFactory.newGame();
                this.proposal = true;
            };
            GameController.prototype.saveGame = function () {
                this.gameFactory.setActiveGame(this.game);
            };
            GameController.prototype.completeGame = function () {
                this.gameFactory.addToHistory(this.gameFactory.getActiveGame());
                this.gameFactory.setActiveGame(null);
                this.refresh();
            };
            GameController.prototype.hasActiveGame = function () {
                if (this.gameFactory.getActiveGame()) {
                    return true;
                }
                else {
                    return false;
                }
            };
            GameController.prototype.acceptProposal = function () {
                this.gameFactory.addToHistory(this.gameFactory.getActiveGame());
                this.gameFactory.setActiveGame(this.game);
                this.refresh();
            };
            GameController.prototype.cancelProposal = function () {
                this.refresh();
            };
            GameController.prototype.clearHistory = function () {
                this.gameFactory.clearHistory();
                this.refresh();
            };
            GameController.controllerID = 'gameController';
            GameController.$inject = ['gameFactory'];
            return GameController;
        }());
        controllers.GameController = GameController;
        angular.module('footballClub')
            .controller(GameController.controllerID, GameController);
    })(controllers = app.controllers || (app.controllers = {}));
})(app || (app = {}));
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
            /* @ngInject */
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
            .controller(PlayersController.controllerID, PlayersController);
    })(controllers = app.controllers || (app.controllers = {}));
})(app || (app = {}));
//# sourceMappingURL=app.js.map