(function () {
    angular.module('footballClub')
        .controller('statsController', ['gameFactory', statsController]);

    function statsController(gameFactory) {

        var vm = this;

        vm.refresh = function () {
            var games = gameFactory.getAllHistory();

            //Backwards compatibility from version 1 objects.
            for (var i=0;i<games.length;i++){
                if(games[i].groupID === undefined){
                    //var date = Date.parse(games[i].date);
                    var date = new Date(games[i].date);
                    games[i].groupID = date.getYear().toString() + date.getMonth(),toString() + date.getDay().toString();
                }
            }
            vm.groups = getStats(games);
        }

        function buildGroupObjects(games) {
            var groupIDs = games.map(function(x) {
                return x.groupID;
            });
            var uniqueGroups = groupIDs.distinct();
            var groupObjects = [];
            for(var i=0;i<uniqueGroups.length;i++){
                groupObjects.push({
                    groupID: uniqueGroups[i],
                    playerStats: []
                });
            }
            return groupObjects;
        }

        function getName(x){
            return x.name;
        }

        function buildPlayerStatObjects(groups, games){
            for(var gr=0; gr<groups.length;gr++){
                var groupPlayers = [];
                for(var ga=0; ga<games.length; ga++){
                    if(groups[gr].groupID === games[ga].groupID){
                        groupPlayers = groupPlayers.concat(games[ga].team1.map(getName).concat(games[ga].team2.map(getName)));
                    }
                }
                var uniqueGroupPlayers = groupPlayers.distinct();
                for (var i=0;i<uniqueGroupPlayers.length;i++){
                    groups[gr].playerStats.push({
                        name: groupPlayers[i],
                        wins: 0
                    });
                }
            }
        }

        function calcStats(groups, games){
            for(var g=0; g<groups.length;g++){
                for(var s=0; s<groups[g].playerStats.length;s++){
                    for(var i=0;i<games.length;i++){
                        if(groups[g].groupID === games[i].groupID){
                            var winners = [];
                            if(games[i].team1Score > games[i].team2Score){
                                winners = games[i].team1.map(getName);
                            } else if (games[i].team2Score > games[i].team1Score){
                                winners = games[i].team2.map(getName);
                            }
                            if(winners.length > 0){
                                for(var w=0;w<winners.length; w++){
                                    if(winners[w] === groups[g].playerStats[s].name){
                                        groups[g].playerStats[s].wins++;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        function getStats (games) {
            var groups = buildGroupObjects(games);
            buildPlayerStatObjects(groups, games);
            calcStats(groups, games);
            return groups;
        }
    }
})();