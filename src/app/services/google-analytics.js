(function() {
  'use strict';

  angular
    .module('poprevo')
    .factory('googleAnalytics', googleAnalytics);

  function googleAnalytics(Analytics) {
    var service = {
      initialize: initialize
    };

    return service;

    function initialize() {
    }
  }
})();
