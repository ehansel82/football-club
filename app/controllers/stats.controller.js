(function () {
    angular.module('footballClub')
        .controller('statsController', ['gameFactory', '$scope', statsController]);

    function statsController(gameFactory, $scope) {

        var vm = this;

        $scope.$on('historyUpdate', function (event, data) {
            vm.refresh();
        });

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
                        teamPoints: 0,
                        isMVP: false,
                        isLVP: false
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
                                loserPoints = games[i].team2Score;
                            } else if (games[i].team2Score > games[i].team1Score) {
                                winners = games[i].team2.map(getName);
                                losers = games[i].team1.map(getName);
                                winnerPoints = games[i].team2Score;
                                loserPoints = games[i].team1Score;
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
                            for (var t = 0; t < tiers.length; t++) {
                                if (tiers[t] === groups[g].playerStats[s].name) {
                                    groups[g].playerStats[s].teamPoints += tierPoints;
                                }
                            }
                        }
                    }
                    groups[g].playerStats.sort(playerStatsSort);
                }
            }
        }

        function calcMVP(groups) {
            for (var i = 0; i < groups.length; i++) {
                if (groups[i].playerStats.length > 1) {
                    if (groups[i].playerStats[0].wins !== groups[i].playerStats[1].wins ||
                        groups[i].playerStats[0].teamPoints !== groups[i].playerStats[1].teamPoints) {
                        groups[i].playerStats[0].isMVP = true;
                    }
                }
            }
        }

        function calcLVP(groups) {
            for (var i = 0; i < groups.length; i++) {
                var l = groups[i].playerStats.length;
                if (l > 1) {
                    if (groups[i].playerStats[l - 1].wins !== groups[i].playerStats[l - 2].wins ||
                        groups[i].playerStats[l - 1].teamPoints !== groups[i].playerStats[l - 2].teamPoints) {
                        groups[i].playerStats[l - 1].isLVP = true;
                    }
                }
            }
        }

        function getStats(games) {
            var groups = buildGroupObjects(games);
            buildPlayerStatObjects(groups, games);
            calcStats(groups, games);
            calcMVP(groups);
            calcLVP(groups);
            return groups;
        }

        function playerStatsSort(a, b) {
            if (a.wins === b.wins) {
                return b.teamPoints - a.teamPoints;
            }
            else {
                return b.wins - a.wins;
            }
        }
    }
})();