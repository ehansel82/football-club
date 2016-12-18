/// <reference path="../../typings/tsd.d.ts" />

module app.controllers {

    export interface IStatsController {
        groups: GameDay[];
        refresh: () => void;
    }

    export class StatsController implements IStatsController {

        static controllerID = 'statsController';
        static $inject = ['gameFactory', '$scope'];

        private games: Game[];
        
        public groups: GameDay[];

        /* @ngInject */
        constructor(private gameFactory: app.services.IGameFactory, private $scope: any) {    
            let that = this;      
            $scope.$on('historyUpdate', function (event: any, data: any) {
                that.refresh();
            });
        }

        public refresh(): void {
            let games = this.gameFactory.getAllHistory();
            this.groups = this.getStats(games);
        }

        private getStats(games: any): GameDay[] {
            let gameDays: GameDay[] = this.buildGameDays(games);
            this.buildPlayerStats(gameDays, games);
            this.calcGameDayStats(gameDays, games);
            this.calcMVP(gameDays);
            this.calcLVP(gameDays);
            return gameDays;
        }

        private buildGameDays(games: Game[]): GameDay[] {
            let days: string[];
            days = _.uniq(games.map(x => x.date));

            let gameDays: GameDay[] = new Array<GameDay>();
            _.each(days, x => {
                let gameDay = new GameDay();
                gameDay.date = x;
                gameDay.playerStats = new Array<PlayerStats>();
                gameDays.push(gameDay);
            });

            return gameDays;
        }

        private buildPlayerStats(gameDays: GameDay[], games: Game[]): void {
            _.each(gameDays, gd => {
                let gamesOnGameDay = _.where(games, { date: gd.date })

                let gameDayPlayers: string[] = new Array<string>();
                _.each(gamesOnGameDay, x => {
                    gameDayPlayers = gameDayPlayers.concat(_.map(x.team1, x => x.name).concat(_.map(x.team2, x => x.name)))
                });
                gameDayPlayers = _.uniq(gameDayPlayers);

                _.each(gameDayPlayers, x => {
                    var playerStats = new PlayerStats();
                    playerStats.name = x;
                    gd.playerStats.push(playerStats);
                });
            });
        }

        private calcGameDayStats(gameDays: GameDay[], games: Game[]): void {
            _.each(gameDays, gd => {
                _.each(gd.playerStats, stat => {
                    this.calcGamePlayerStats(stat, gd.date, games);
                })

                gd.playerStats.sort(this.playerStatsSort);
            });
        }
        
        private calcGamePlayerStats(playerStat: PlayerStats, date: string, games: Game[]): void {
            _.each(games, g => {
                if(date === g.date){
                    let winners: string[] = new Array<string>();
                    let losers: string[] = new Array<string>();
                    let tiers: string[] = new Array<string>();
                    let winnerPoints: number = 0;
                    let loserPoints: number = 0;
                    let tierPoints: number = 0;

                    if (g.team1Score > g.team2Score) {
                        winners = g.team1.map(x => x.name);
                        losers = g.team2.map(x => x.name);
                        winnerPoints = g.team1Score;
                        loserPoints = g.team2Score;
                    } else if (g.team2Score > g.team1Score) {
                        winners = g.team2.map(x => x.name);
                        losers = g.team1.map(x => x.name);
                        winnerPoints = g.team2Score;
                        loserPoints = g.team1Score;
                    } else {
                        tiers = g.team1.map(x => x.name).concat(g.team2.map(x => x.name));
                        tierPoints = g.team1Score;
                    }

                    _.each(winners, w => {
                        if (w === playerStat.name){
                            playerStat.wins++;
                            playerStat.teamPoints += winnerPoints;
                        }
                    });

                    _.each(losers, l => {
                        if (l === playerStat.name){
                            playerStat.losses++;
                            playerStat.teamPoints += loserPoints;
                        }
                    });

                    _.each(tiers, t => {
                        if (t === playerStat.name){
                            playerStat.teamPoints += tierPoints;
                        }
                    });
                }
            });
        } 

        private playerStatsSort(a: PlayerStats, b: PlayerStats): number {
            if (a.wins === b.wins) {
                return b.teamPoints - a.teamPoints;
            }
            else {
                return b.wins - a.wins;
            }
        }

        private calcMVP(gameDays: GameDay[]): void{
            _.each(gameDays, gd => {
                if(gd.playerStats.length > 1){
                    if (gd.playerStats[0].wins !== gd.playerStats[1].wins ||
                        gd.playerStats[0].teamPoints !== gd.playerStats[1].teamPoints) {
                        gd.playerStats[0].isMVP = true;
                    }                    
                }
            });
        }

        private calcLVP(gameDays: GameDay[]): void{
            _.each(gameDays, gd => {
                var l = gd.playerStats.length;
                if(gd.playerStats.length > l){
                    if (gd.playerStats[l - 1].wins !== gd.playerStats[l - 2].wins ||
                        gd.playerStats[l - 1].teamPoints !== gd.playerStats[l - 2].teamPoints) {
                        gd.playerStats[l - 1].isLVP = true;
                    }                             
                }
            });
        }
    }

    angular.module('footballClub')
           .controller(StatsController.controllerID, StatsController);
}