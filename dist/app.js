var app;
(function (app) {
    angular.module('footballClub', ['ngAnimate', 'LocalStorageModule'])
        .constant('APP_VERSION', '1.1.1');
    ;
})(app || (app = {}));
var Game = (function () {
    function Game() {
        this.date = '';
        this.qb = null;
        this.team1 = new Array();
        this.team2 = new Array();
        this.team1Score = 0;
        this.team2Score = 0;
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
                this.gameFactory.clearAllHistory();
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
var app;
(function (app) {
    var controllers;
    (function (controllers) {
        var MainController = (function () {
            function MainController(APP_VERSION) {
                this.version = APP_VERSION;
                this.playersSelected = true;
                this.gamesSelected = false;
                this.statsSelected = false;
            }
            MainController.prototype.playersClick = function () {
                this.clearAll();
                this.playersSelected = true;
            };
            MainController.prototype.gamesClick = function () {
                this.clearAll();
                this.gamesSelected = true;
            };
            MainController.prototype.statsClick = function () {
                this.clearAll();
                this.statsSelected = true;
            };
            MainController.prototype.clearAll = function () {
                this.playersSelected = false;
                this.gamesSelected = false;
                this.statsSelected = false;
            };
            MainController.controllerID = 'mainController';
            MainController.$inject = ['APP_VERSION'];
            return MainController;
        }());
        controllers.MainController = MainController;
        angular.module('footballClub').controller(MainController.controllerID, MainController);
    })(controllers = app.controllers || (app.controllers = {}));
})(app || (app = {}));
var Player = (function () {
    function Player(playerName) {
        this.name = playerName;
        this.isQB = false;
    }
    return Player;
}());
var app;
(function (app) {
    var services;
    (function (services) {
        var PlayerFactory = (function () {
            /* @ngInject */
            function PlayerFactory(localStorageService) {
                this.localStorageService = localStorageService;
            }
            PlayerFactory.prototype.getAll = function () {
                return this.localStorageService.get(PlayerFactory.playerKey) || [];
            };
            PlayerFactory.prototype.add = function (player) {
                var playerList = this.getAll();
                playerList.push(player);
                this.localStorageService.set(PlayerFactory.playerKey, playerList);
            };
            PlayerFactory.prototype.del = function (idx) {
                var playerList = this.getAll();
                playerList.splice(idx, 1);
                this.localStorageService.set(PlayerFactory.playerKey, playerList);
            };
            PlayerFactory.prototype.toggleQB = function (idx) {
                var playerList = this.getAll();
                var len = playerList.length;
                for (var i = 0; i < len; i++) {
                    if (i === idx) {
                        playerList[i].isQB = !playerList[i].isQB;
                    }
                    else {
                        playerList[i].isQB = false;
                    }
                }
                this.localStorageService.set(PlayerFactory.playerKey, playerList);
            };
            PlayerFactory.instance = function (localStorageService) {
                return new PlayerFactory(localStorageService);
            };
            PlayerFactory.factoryID = 'playerFactory';
            PlayerFactory.playerKey = 'players';
            PlayerFactory.$inject = ['localStorageService'];
            return PlayerFactory;
        }());
        services.PlayerFactory = PlayerFactory;
        angular.module('footballClub').factory(PlayerFactory.factoryID, PlayerFactory.instance);
    })(services = app.services || (app.services = {}));
})(app || (app = {}));
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../models/player.ts" />
/// <reference path="../services/player.factory.ts"/>
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
                this.playerToAdd = new Player('');
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
/// <reference path="../../typings/tsd.d.ts" />
var app;
(function (app) {
    var controllers;
    (function (controllers) {
        var StatsController = (function () {
            /* @ngInject */
            function StatsController(gameFactory, $scope) {
                this.gameFactory = gameFactory;
                this.$scope = $scope;
                var that = this;
                $scope.$on('historyUpdate', function (event, data) {
                    that.refresh();
                });
            }
            StatsController.prototype.refresh = function () {
                var games = this.gameFactory.getAllHistory();
                this.groups = this.getStats(games);
            };
            StatsController.prototype.getStats = function (games) {
                var gameDays = this.buildGameDays(games);
                this.buildPlayerStats(gameDays, games);
                this.calcGameDayStats(gameDays, games);
                this.calcMVP(gameDays);
                this.calcLVP(gameDays);
                return gameDays;
            };
            StatsController.prototype.buildGameDays = function (games) {
                var days;
                days = _.uniq(games.map(function (x) { return x.date; }));
                var gameDays = new Array();
                _.each(days, function (x) {
                    var gameDay = new GameDay();
                    gameDay.date = x;
                    gameDay.playerStats = new Array();
                    gameDays.push(gameDay);
                });
                return gameDays;
            };
            StatsController.prototype.buildPlayerStats = function (gameDays, games) {
                _.each(gameDays, function (gd) {
                    var gamesOnGameDay = _.where(games, { date: gd.date });
                    var gameDayPlayers = new Array();
                    _.each(gamesOnGameDay, function (x) {
                        gameDayPlayers = gameDayPlayers.concat(_.map(x.team1, function (x) { return x.name; }).concat(_.map(x.team2, function (x) { return x.name; })));
                    });
                    gameDayPlayers = _.uniq(gameDayPlayers);
                    _.each(gameDayPlayers, function (x) {
                        var playerStats = new PlayerStats();
                        playerStats.name = x;
                        gd.playerStats.push(playerStats);
                    });
                });
            };
            StatsController.prototype.calcGameDayStats = function (gameDays, games) {
                var _this = this;
                _.each(gameDays, function (gd) {
                    _.each(gd.playerStats, function (stat) {
                        _this.calcGamePlayerStats(stat, gd.date, games);
                    });
                    gd.playerStats.sort(_this.playerStatsSort);
                });
            };
            StatsController.prototype.calcGamePlayerStats = function (playerStat, date, games) {
                _.each(games, function (g) {
                    if (date === g.date) {
                        var winners = new Array();
                        var losers = new Array();
                        var tiers = new Array();
                        var winnerPoints_1 = 0;
                        var loserPoints_1 = 0;
                        var tierPoints_1 = 0;
                        if (g.team1Score > g.team2Score) {
                            winners = g.team1.map(function (x) { return x.name; });
                            losers = g.team2.map(function (x) { return x.name; });
                            winnerPoints_1 = g.team1Score;
                            loserPoints_1 = g.team2Score;
                        }
                        else if (g.team2Score > g.team1Score) {
                            winners = g.team2.map(function (x) { return x.name; });
                            losers = g.team1.map(function (x) { return x.name; });
                            winnerPoints_1 = g.team2Score;
                            loserPoints_1 = g.team1Score;
                        }
                        else {
                            tiers = g.team1.map(function (x) { return x.name; }).concat(g.team2.map(function (x) { return x.name; }));
                            tierPoints_1 = g.team1Score;
                        }
                        _.each(winners, function (w) {
                            if (w === playerStat.name) {
                                playerStat.wins++;
                                playerStat.teamPoints += winnerPoints_1;
                            }
                        });
                        _.each(losers, function (l) {
                            if (l === playerStat.name) {
                                playerStat.losses++;
                                playerStat.teamPoints += loserPoints_1;
                            }
                        });
                        _.each(tiers, function (t) {
                            if (t === playerStat.name) {
                                playerStat.teamPoints += tierPoints_1;
                            }
                        });
                    }
                });
            };
            StatsController.prototype.playerStatsSort = function (a, b) {
                if (a.wins === b.wins) {
                    return b.teamPoints - a.teamPoints;
                }
                else {
                    return b.wins - a.wins;
                }
            };
            StatsController.prototype.calcMVP = function (gameDays) {
                _.each(gameDays, function (gd) {
                    if (gd.playerStats.length > 1) {
                        if (gd.playerStats[0].wins !== gd.playerStats[1].wins ||
                            gd.playerStats[0].teamPoints !== gd.playerStats[1].teamPoints) {
                            gd.playerStats[0].isMVP = true;
                        }
                    }
                });
            };
            StatsController.prototype.calcLVP = function (gameDays) {
                _.each(gameDays, function (gd) {
                    var l = gd.playerStats.length;
                    if (gd.playerStats.length > l) {
                        if (gd.playerStats[l - 1].wins !== gd.playerStats[l - 2].wins ||
                            gd.playerStats[l - 1].teamPoints !== gd.playerStats[l - 2].teamPoints) {
                            gd.playerStats[l - 1].isLVP = true;
                        }
                    }
                });
            };
            StatsController.controllerID = 'statsController';
            StatsController.$inject = ['gameFactory', '$scope'];
            return StatsController;
        }());
        controllers.StatsController = StatsController;
        angular.module('footballClub')
            .controller(StatsController.controllerID, StatsController);
    })(controllers = app.controllers || (app.controllers = {}));
})(app || (app = {}));
var GameDay = (function () {
    function GameDay() {
    }
    return GameDay;
}());
var PlayerStats = (function () {
    function PlayerStats() {
        this.wins = 0;
        this.losses = 0;
        this.teamPoints = 0;
    }
    return PlayerStats;
}());
/// <reference path="../../typings/tsd.d.ts" />
var app;
(function (app) {
    var services;
    (function (services) {
        var GameFactory = (function () {
            /* @ngInject */
            function GameFactory(localStorageService, playerFactory, $rootScope) {
                this.localStorageService = localStorageService;
                this.playerFactory = playerFactory;
                this.$rootScope = $rootScope;
            }
            GameFactory.prototype.newGame = function () {
                var game = new Game();
                var players = this.playerFactory.getAll().slice(0);
                var len = players.length;
                for (var i = 0; i < len; i++) {
                    if (players[i].isQB) {
                        game.qb = players.splice(i, 1)[0];
                        break;
                    }
                }
                var shuffledPlayers = _.shuffle(players);
                var half_length = Math.ceil(shuffledPlayers.length / 2);
                game.team1 = shuffledPlayers.splice(0, half_length);
                game.team2 = shuffledPlayers;
                return game;
            };
            GameFactory.prototype.addToHistory = function (game) {
                if (game) {
                    var date = new Date();
                    game.date = (date.getMonth() + 1).toString() + "/" + date.getDate().toString() + "/" + date.getFullYear();
                    var gamesList = this.getAllHistory();
                    gamesList.splice(0, 0, game);
                    this.localStorageService.set(GameFactory.gamesHistoryKey, gamesList);
                    this.$rootScope.$broadcast('historyUpdate');
                }
            };
            GameFactory.prototype.getActiveGame = function () {
                return this.localStorageService.get(GameFactory.activeGameKey);
            };
            ;
            GameFactory.prototype.setActiveGame = function (game) {
                return this.localStorageService.set(GameFactory.activeGameKey, game);
            };
            ;
            GameFactory.prototype.getAllHistory = function () {
                return this.localStorageService.get(GameFactory.gamesHistoryKey) || new Array();
            };
            ;
            GameFactory.prototype.clearAllHistory = function () {
                this.localStorageService.set(GameFactory.gamesHistoryKey, null);
                this.$rootScope.$broadcast('historyUpdate');
            };
            GameFactory.instance = function (localStorageService, playerFactory, $rootScope) {
                return new GameFactory(localStorageService, playerFactory, $rootScope);
            };
            GameFactory.factoryID = 'gameFactory';
            GameFactory.gamesHistoryKey = 'gamesHistory';
            GameFactory.activeGameKey = 'activeGame';
            GameFactory.$inject = ['localStorageService', 'playerFactory', '$rootScope'];
            return GameFactory;
        }());
        services.GameFactory = GameFactory;
        angular.module('footballClub').factory(GameFactory.factoryID, GameFactory.instance);
    })(services = app.services || (app.services = {}));
})(app || (app = {}));
//# sourceMappingURL=app.js.map