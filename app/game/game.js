'use strict';

angular.module('KillTheBees.game', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/game', {
    templateUrl: 'game/game.html',
    controller: 'GameCtrl'
  });
}])

.controller('GameCtrl', function($scope) {
    

    function bee(type, totalLife, hitPoints) {
        this.type = type;
        this.totalLife = totalLife;
        this.currentLife = totalLife;
        this.hitPoints = hitPoints;

        this.isAlive = true;
    }

    function beeFactory(type, totalLife, hitPoints) {
        return new bee(type, totalLife, hitPoints);
    }

    (function beeInit() {
        var i;
        $scope.gameOver = false;
        $scope.beeArr = [];

        $scope.beeArr.push(beeFactory('queen',100,8));
        for (i = 0; i < 5; i++) {
            $scope.beeArr.push(beeFactory('worker',75,10))
        }

        $scope.drones = [];
        for (i = 0; i < 8; i++) {
            $scope.beeArr.push(beeFactory('drone',50,12))
        }
    })();

    function killBeeFunc() {
        // 0 > If bees current life
            // hit another bee
        // else 
            // deduct hit
            // if currentlife now < 0
                // cL = 0
            // if bee is queen & life is 0
                // all bees current life = 0
            // show notification text
        var pickBee = Math.floor((Math.random() * $scope.beeArr.length)),
            chosenBee = $scope.beeArr[pickBee];

        if(0 >= chosenBee.currentLife) {
            killBeeFunc();
        } 
        else {
            chosenBee.currentLife -= chosenBee.hitPoints;
            if(chosenBee.currentLife <= 0) {
                chosenBee.currentLife = 0;
                chosenBee.isAlive = false;
            }

            if(chosenBee.type === 'queen' && chosenBee.currentLife === 0) {
                var allBees = $scope.beeArr.length,
                    i;
                for (i = 0; i < allBees; i++) {
                    $scope.beeArr[i].currentLife = 0;
                }
                $scope.gameOver = true;
            }
            $scope.killClick = true;
            $scope.killText = (chosenBee.type !== 'queen') ?  "a " + chosenBee.type : "the queen bee"; 
        }
    }
    $scope.killBee = killBeeFunc;

    function restartGameFunc() {
        // TODO - D.R.Y this up, replicates the game over function above
        var allBees = $scope.beeArr.length,
            i;
        for (i = 0; i < allBees; i++) {
            $scope.beeArr[i].currentLife = $scope.beeArr[i].totalLife;
        }
        $scope.gameOver = false;
    }
    $scope.restartGame = restartGameFunc;
});