/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../models/player.ts" />

module app.controllers
{
    export interface IPlayersController{
        addPlayer: () => void;
        deletePlayer: (idx: number) => void;
        toggleQB: (idx: number) => void;
        refresh:() => void;
    }

    export class PlayersController implements IPlayersController{
        static controllerID = 'playersController';
        static $inject = ['playerFactory'];

        public playerToAdd: Player;
        public players: Player[];

        constructor(private playerFactory: any) {

        }

        addPlayer(): void {
            if (this.playerToAdd.name) {
                this.playerToAdd.name = this.playerToAdd.name.toLowerCase();
                this.playerFactory.add(this.playerToAdd);
                this.refresh();
            }
        }

        deletePlayer(idx: number): void {
            this.playerFactory.del(idx);
            this.refresh();
        }

        toggleQB(idx: number): void{
            this.playerFactory.toggleQB(idx);
            this.refresh();
        }

        refresh(): void {
            this.players = this.playerFactory.getAll();
            this.playerToAdd = this.playerFactory.newPlayer('');
        }
    }

    angular.module('footballClub')
    .controller(PlayersController.controllerID, ['playerFactory', PlayersController]);
}