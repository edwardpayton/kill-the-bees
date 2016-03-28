'use strict';

describe('KillTheBees.game module', function() {

  beforeEach(module('KillTheBees.game'));

  describe('Bee Service', function(){

    it('should create a queen bee', inject(function($controller) {
      var beeService = $servce('beeService');
      expect(beeService.makeBee('queen',100,8).to.have.property('type','queen'));
    }));

  });
});