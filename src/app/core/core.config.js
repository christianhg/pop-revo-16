(function () {
  'use strict';

  angular
    .module('poprevo.core')
    .config(config);

  function config($urlRouterProvider) {
    $urlRouterProvider.otherwise("/");
  }
})();
