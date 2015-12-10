(function () {
  'use strict';

  angular
    .module('poprevo.core')
    .config(config)
    .run(runBlock);

  function config($urlRouterProvider, AnalyticsProvider) {
    $urlRouterProvider.otherwise("/");

    AnalyticsProvider.setAccount('UA-35381607-5');
  }

  function runBlock(googleAnalytics) {
    googleAnalytics.initialize();
  }
})();
