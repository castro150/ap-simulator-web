'use strict';

/**
 * @ngdoc function
 * @name apSimulatorWebApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the apSimulatorWebApp
 */
angular.module('apSimulatorWebApp')
  .controller('MainCtrl', ['Upload', function(Upload) {
    var ctrl = this;

    ctrl.model = {};
    ctrl.model.otimized = false;

    ctrl.sendFile = function() {
      ctrl.model.disableButton = true;
      Upload.upload({
        url: 'http://localhost:5000/file',
        data: {
          file: ctrl.model.file
        },
      }).then(function(response) {
        ctrl.model.file.result = response.data;
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
      console.log(ctrl.model.plane);
      console.log(ctrl.model.fail);
      console.log(ctrl.model.time);
    }
  }]);
