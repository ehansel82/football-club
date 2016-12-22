module app.controllers {

    export interface IMainController {
        version: string;
        playersSelected: boolean;
        gamesSelected: boolean;
        statsSelected: boolean;
        playersClick: () => void;
        gamesClick: () => void;
        statsClick: () => void;
    }

    export class MainController implements IMainController {

        public version: string;
        public playersSelected: boolean;
        public gamesSelected: boolean;
        public statsSelected: boolean;

        static controllerID = 'mainController';
        static $inject = ['APP_VERSION'];

        constructor(APP_VERSION: string) {
            this.version = APP_VERSION;
            this.playersSelected = true;
            this.gamesSelected = false;
            this.statsSelected = false;
        }

        public playersClick(): void {
            this.clearAll();
            this.playersSelected = true;
        }

        public gamesClick(): void {
            this.clearAll();
            this.gamesSelected = true;
        }

        public statsClick(): void {
            this.clearAll();
            this.statsSelected = true;
        }

        private clearAll(): void {
            this.playersSelected = false;
            this.gamesSelected = false;
            this.statsSelected = false;
        }
    }

    angular.module('footballClub').controller(MainController.controllerID, MainController);
}
