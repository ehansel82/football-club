/// <reference path="../../typings/tsd.d.ts" />
module app.services {

    export interface IGameFactory {
        newGame: () => Game;
        addToHistory: (game: Game) => void;
        getActiveGame: () => Game;
        setActiveGame: (game: Game) => Game;
        getAllHistory: () => Array<Game>;
        clearAllHistory: () => void;
    }

    export class GameFactory implements IGameFactory {

        public static factoryID = 'gameFactory';
        public static gamesHistoryKey = 'gamesHistory';
        public static activeGameKey = 'activeGame';

        public static $inject = ['localStorageService', 'playerFactory', '$rootScope'];

        /* @ngInject */
        constructor(private localStorageService: any,
            private playerFactory: IPlayerFactory,
            private $rootScope: any) {
        }

        public newGame(): Game {
            let game = new Game();

            let players = this.playerFactory.getAll().slice(0);
            let len = players.length;
            for (let i = 0; i < len; i++) {
                if (players[i].isQB) {
                    game.qb = players.splice(i, 1)[0];
                    break;
                }
            }
            var shuffledPlayers = _.shuffle(players) as Array<Player>;
            var half_length = Math.ceil(shuffledPlayers.length / 2);
            game.team1 = shuffledPlayers.splice(0, half_length);
            game.team2 = shuffledPlayers;

            return game;
        }

        public addToHistory(game: Game): void {
            if (game) {
                var date = new Date();
                game.date = (date.getMonth() + 1).toString() + "/" + date.getDate().toString() + "/" + date.getFullYear();
                var gamesList = this.getAllHistory();
                gamesList.splice(0, 0, game);
                this.localStorageService.set(GameFactory.gamesHistoryKey, gamesList);
                this.$rootScope.$broadcast('historyUpdate');
            }
        }

        public getActiveGame(): Game {
            return this.localStorageService.get(GameFactory.activeGameKey);
        };

        public setActiveGame(game: Game): Game {
            return this.localStorageService.set(GameFactory.activeGameKey, game);
        };

        public getAllHistory(): Array<Game> {
            return this.localStorageService.get(GameFactory.gamesHistoryKey) || new Array<Game>();
        };

        public clearAllHistory(): void {
            this.localStorageService.set(GameFactory.gamesHistoryKey, null);
            this.$rootScope.$broadcast('historyUpdate');
        }

        public static instance(localStorageService: any,
            playerFactory: IPlayerFactory,
            $rootScope: any): GameFactory {

            return new GameFactory(localStorageService, playerFactory, $rootScope);

        }
    }
    angular.module('footballClub').factory(GameFactory.factoryID, GameFactory.instance);
}

