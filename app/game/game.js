'use strict';

angular.module('KillTheBees.game', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/game', {
    templateUrl: 'game/game.html',
    controller: 'GameCtrl'
  });
}])
/*
 * KillTheBees game controller
 * This is the main controller for the game
 */
.controller('GameCtrl', ['$scope','beeService','$timeout',function($scope, beeService, $timeout) {

    /*
     * beeInit function
     * initialises the game
     */
    (function beeInit() {
        var i;
        $scope.gameOver = false;
        $scope.beeArr = [];

        $scope.beeArr.push(beeService.makeBee('queen',100,8));
        for (i = 0; i < 5; i++) {
            $scope.beeArr.push(beeService.makeBee('worker',75,10))
        }

        $scope.drones = [];
        for (i = 0; i < 8; i++) {
            $scope.beeArr.push(beeService.makeBee('drone',50,12))
        }
        beeTimer();
    })();

    /* 
     * killBeeFunc function
     * picks a random bee to hit, takes off life points, if life points are 0 picks another be, if queen bee has 0 life points - ends game
     */
    function killBeeFunc() {
        var pickBee = Math.floor((Math.random() * $scope.beeArr.length)),
            chosenBee = $scope.beeArr[pickBee];

        if(0 >= chosenBee.currentLife) {
            killBeeFunc();
        } 
        else {
            chosenBee.currentLife -= chosenBee.hitPoints;
            chosenBee.hit = true;
            $timeout(function() {
                chosenBee.hit = false;
            }, 250);
            if(chosenBee.currentLife <= 0) {
                chosenBee.currentLife = 0;
                chosenBee.isAlive = false;
            }

            if(chosenBee.type === 'queen' && chosenBee.currentLife === 0) {
                beeMatch(false);
            }
            $scope.killClick = true;
            $scope.killText = (chosenBee.type !== 'queen') ?  "a " + chosenBee.type : "the queen bee"; 
        }
    }
    $scope.killBee = killBeeFunc;

    /* 
     * restartGameFunc function
     * resets the game
     */
    function restartGameFunc() {
        beeMatch(true);
    }
    $scope.restartGame = restartGameFunc;


    // HELPER FUNCTIONS
    // TODO - move these to services 

    /*
     * beeTimer function
     * stopwatch to track game play time
     */
    $scope.stopwatch = 0;
    var timer;
     
    function beeTimer() {
        timer = $timeout(function() {
            $scope.stopwatch++;   
            beeTimer();   
        }, 1000);
    };

    /*
     * beeMatch     function
     * args         Boolean     true = reset game, false = end game
     * returns      Resets or ends game
     */
    function beeMatch(bool) {
        var allBees = $scope.beeArr.length,
            i;
        for (i = 0; i < allBees; i++) {
            if(bool === true) {
                $scope.beeArr[i].currentLife = $scope.beeArr[i].totalLife;
            } else {
                $scope.beeArr[i].currentLife = 0;
            } 
        }
        $scope.gameOver = !bool;

        $timeout.cancel(timer);
        if(bool === true) {
            $scope.stopwatch = 0;
            beeTimer();
        }
    }

}])
/*
 * beeService service
 * Used for creating new bees
 * args         type = bee type, totalLife = bee types total life, hitPoints = bee types hit points
 * returns      A new bee
 */
.service('beeService', function() {
    function bee(type, totalLife, hitPoints) {
        this.type = type;
        this.totalLife = totalLife;
        this.currentLife = totalLife;
        this.hitPoints = hitPoints;

        this.isAlive = true;
        this.hit = false;
    }

    this.makeBee = function(type, totalLife, hitPoints) {
        return new bee(type, totalLife, hitPoints);
    }
});