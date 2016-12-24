
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../models/game.ts" />

module app.controllers {

    export interface IGameController {
        proposal: boolean;
        game: Game;
        history: Array<Game>;
        newGame(): void;
        saveGame(): void;
        completeGame(): void;
        acceptProposal(): void;
        cancelProposal(): void;
        hasActiveGame(): boolean;
        clearHistory(): void;
    }

    export class GameController implements IGameController {

        static controllerID = 'gameController';
        static $inject = ['gameFactory'];

        /* @ngInject */
        constructor(private gameFactory: app.services.IGameFactory) {

        }

        game: Game;
        proposal: boolean;
        history: Array<Game>;

        private refresh(): void {
            this.proposal = false;
            this.game = this.gameFactory.getActiveGame();
            this.history = this.gameFactory.getAllHistory();
        }

        newGame(): void {
            this.game = this.gameFactory.newGame();
            this.proposal = true;
        }

        saveGame(): void {
            this.gameFactory.setActiveGame(this.game);
        }

        completeGame(): void {
            this.gameFactory.addToHistory(this.gameFactory.getActiveGame());
            this.gameFactory.setActiveGame(null);
            this.refresh();
        }

        hasActiveGame(): boolean {
            if (this.gameFactory.getActiveGame()) {
                return true;
            } else {
                return false;
            }
        }

        acceptProposal(): void {
            this.gameFactory.addToHistory(this.gameFactory.getActiveGame());
            this.gameFactory.setActiveGame(this.game);
            this.refresh();
        }

        cancelProposal(): void {
            this.refresh();
        }

        clearHistory(): void {
            this.gameFactory.clearAllHistory();
            this.refresh();
        }
    }
    angular.module('footballClub')
           .controller(GameController.controllerID, GameController);

}