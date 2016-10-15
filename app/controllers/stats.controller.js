(function () {
    angular.module('footballClub')
        .controller('statsController', ['gameFactory', statsController]);

    function statsController(gameFactory) {

        var vm = this;

        vm.refresh = function () {
            var games = gameFactory.getAllHistory().filter(function (x) { return x.groupID !== undefined });
            vm.groups = getStats(games);
        }

        function buildGroupObjects(games) {
            var groupIDs = games.map(function (x) {
                return x.groupID;
            });
            var uniqueGroups = groupIDs.distinct();
            var groupObjects = [];
            for (var i = 0; i < uniqueGroups.length; i++) {
                groupObjects.push({
                    groupID: uniqueGroups[i],
                    playerStats: []
                });
            }
            return groupObjects;
        }

        function getName(x) {
            return x.name;
        }

        function buildPlayerStatObjects(groups, games) {
            for (var gr = 0; gr < groups.length; gr++) {
                var groupPlayers = [];
                for (var ga = 0; ga < games.length; ga++) {
                    if (groups[gr].groupID === games[ga].groupID) {
                        groupPlayers = groupPlayers.concat(games[ga].team1.map(getName).concat(games[ga].team2.map(getName)));
                    }
                }
                var uniqueGroupPlayers = groupPlayers.distinct();
                for (var i = 0; i < uniqueGroupPlayers.length; i++) {
                    groups[gr].playerStats.push({
                        name: groupPlayers[i],
                        wins: 0,
                        losses: 0,
                        teamPoints: 0
                    });
                }
            }
        }

        function calcStats(groups, games) {
            for (var g = 0; g < groups.length; g++) {
                for (var s = 0; s < groups[g].playerStats.length; s++) {
                    for (var i = 0; i < games.length; i++) {
                        if (groups[g].groupID === games[i].groupID) {
                            var winners = [];
                            var losers = [];
                            var tiers = [];
                            var winnerPoints = 0;
                            var loserPoints = 0;
                            var tierPoints = 0;
                            if (games[i].team1Score > games[i].team2Score) {
                                winners = games[i].team1.map(getName);
                                losers = games[i].team2.map(getName);
                                winnerPoints = games[i].team1Score;
                            } else if (games[i].team2Score > games[i].team1Score) {
                                winners = games[i].team2.map(getName);
                                losers = games[i].team1.map(getName);
                                loserPoints = games[i].team2Score;
                            } else {
                                tiers = games[i].team1.map(getName).concat(games[i].team2.map(getName));
                                tierPoints = games[i].team1Score;
                            }

                            for (var w = 0; w < winners.length; w++) {
                                if (winners[w] === groups[g].playerStats[s].name) {
                                    groups[g].playerStats[s].wins++;
                                    groups[g].playerStats[s].teamPoints += winnerPoints;
                                }
                            }
                            for (var l = 0; l < losers.length; l++) {
                                if (losers[l] === groups[g].playerStats[s].name) {
                                    groups[g].playerStats[s].losses++;
                                    groups[g].playerStats[s].teamPoints += loserPoints;
                                }
                            }
                            for (var t = 0; t < losers.length; t++) {
                                if (tiers[t] === groups[g].playerStats[s].name) {
                                    groups[g].playerStats[s].teamPoints += tierPoints;
                                }
                            }
                        }
                    }
                }
            }
        }

        function getStats(games) {
            var groups = buildGroupObjects(games);
            buildPlayerStatObjects(groups, games);
            calcStats(groups, games);
            return groups;
        }
    }
})();