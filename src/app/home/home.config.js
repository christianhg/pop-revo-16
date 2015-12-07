(function () {
  'use strict';

  angular
    .module('poprevo.home')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'home/home.view.html'
      });
  }
})();
