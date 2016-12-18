class Game {

    constructor() {
        this.date = '';
        this.qb = null;
        this.team1 = new Array<Player>();
        this.team2 = new Array<Player>();
        this.team1Score = 0;
        this.team2Score = 0;

    }

    date: string;
    qb: Player;
    team1: Player[];
    team2: Player[];
    team1Score: number;
    team2Score: number;

}