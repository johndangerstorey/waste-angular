'use strict';

/**
 * @ngdoc service
 * @name yololiumApp.stOauthclients
 * @description
 * # stOauthclients
 * Service in the yololiumApp.
 */
angular.module('yololiumApp')
  .service('stOauthclients', ['StApi', '$http', function stOauthclients(StApi, $http) {
    var me = this
      , apiPrefix = StApi.apiPrefix
      ;

    function fetch() {
      return $http.get(apiPrefix + '/me/clients').then(function (resp) {
        return resp.data.clients;
      });
    }

    function create(name, secret) {
      var app = { name: name };
      if (secret) {
        app.secret = secret;
      }

      return $http.post(apiPrefix + '/me/clients', app).then(function (resp) {
        return resp.data;
      });
    }

    me.fetch = fetch;
    me.create = create;
  }]);
