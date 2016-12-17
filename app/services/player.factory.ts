module app.services {

    export interface IPlayerFactory {
        getAll: () => Array<Player>;
        add: (player: Player) => void;
        del: (idx: number) => void;
        toggleQB: (idx: number) => void;
    }

    export class PlayerFactory implements IPlayerFactory {

        public static factoryID = 'playerFactory';
        private static playerKey: string = 'players';

        static $inject = ['localStorageService'];

        /* @ngInject */
        constructor(private localStorageService: any) {
            this.localStorageService = localStorageService;
        }

        public getAll(): Array<Player> {
            return this.localStorageService.get(PlayerFactory.playerKey) || [];
        }

        public add(player: Player): void {
            let playerList = this.getAll();
            playerList.push(player);
            this.localStorageService.set(PlayerFactory.playerKey, playerList);
        }

        public del(idx: number): void {
            let playerList = this.getAll();
            playerList.splice(idx, 1);
            this.localStorageService.set(PlayerFactory.playerKey, playerList);

        }

        public toggleQB(idx: number): void {
            let playerList = this.getAll();
            let len = playerList.length;
            for (let i = 0; i < len; i++) {
                if (i === idx) {
                    playerList[i].isQB = !playerList[i].isQB
                } else {
                    playerList[i].isQB = false;
                }
            }
            this.localStorageService.set(PlayerFactory.playerKey, playerList);
        }

        public static instance(localStorageService: any) {
            return new PlayerFactory(localStorageService);
        }
    }

    angular.module('footballClub').factory(PlayerFactory.factoryID, PlayerFactory.instance);
}
