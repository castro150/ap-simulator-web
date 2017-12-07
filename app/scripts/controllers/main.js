'use strict';

/**
 * @ngdoc function
 * @name apSimulatorWebApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the apSimulatorWebApp
 */
angular.module('apSimulatorWebApp')
  .controller('MainCtrl', ['Upload', '$http', '$sce', function(Upload, $http, $sce) {
    var ctrl = this;

    ctrl.model = {};
    ctrl.model.airplanesName = [];
    ctrl.model.fail = '1';
    ctrl.model.time = new Date();
    ctrl.model.time.setHours(1);
    ctrl.model.time.setMinutes(0);
    ctrl.model.time.setSeconds(0);
    ctrl.model.time.setMilliseconds(0);
    ctrl.model.otimized = false;
    ctrl.model.src = $sce.trustAsResourceUrl('http://127.0.0.1:5000/map?random=' + (new Date()).getTime() + Math.floor(Math.random() * 1000000));

    ctrl.sendFile = function() {
      ctrl.model.disableButton = true;
      Upload.upload({
        url: 'http://127.0.0.1:5000/file',
        data: {
          file: ctrl.model.file
        },
      }).then(function(response) {
        ctrl.model.airplanesName = response.data.aeronaves.map(function(airplane) {
          return airplane.tail;
        });
        ctrl.model.plane = ctrl.model.airplanesName[0];
        ctrl.model.disableButton = false;
        ctrl.model.otimized = true;
      }, function(response) {
        if (response.status > 0) {
          ctrl.errorMsg = response.status + ': ' + response.data;
        }
        ctrl.model.disableButton = false;
      });
    };

    ctrl.otimize = function() {
      ctrl.model.disableButton = true;
      $http.post('http://127.0.0.1:5000/failure', {
        airplane: ctrl.model.plane,
        failure: ctrl.model.fail,
        time: ctrl.model.time
      }).then(function(response) {
        ctrl.model.airplanesName = response.data.aeronaves.map(function(airplane) {
          return airplane.tail;
        });
        ctrl.model.plane = ctrl.model.airplanesName[0];
        var iframe = document.getElementById('map');
        iframe.src = iframe.src + '?random=' + (new Date()).getTime() + Math.floor(Math.random() * 1000000);
        ctrl.model.disableButton = false;
      }, function(response) {
        if (response.status > 0) {
          ctrl.errorMsg = response.status + ': ' + response.data;
        }
        ctrl.model.disableButton = false;
      });
    };

    ctrl.export = function() {
      $http.get('http://127.0.0.1:5000/export').then(function(response) {
        var link = document.createElement('a');
        link.download = 'data.json';
        var data = 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(response.data));
        link.href = 'data:' + data;
        link.click();
      });
    };
  }]);
