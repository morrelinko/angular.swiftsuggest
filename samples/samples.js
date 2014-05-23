var app = angular.module('SampleApp', [
  'swiftsuggest'
]);

app.controller('SimpleController', function($scope, $http, $timeout) {
  $scope.moderators = [];
  $scope.selectedModerator = null;

  $scope.selectModerator = function(user, suggest) {
    $scope.selectedModerator = user;
    suggest.clearInput();
  };

  $scope.updateSuggestions = function(term) {
    $scope.users = [];
    $timeout(function() {
      users = [
        {name: 'Laju', description: 'Some description'},
        {name: 'Misan', description: 'Some description'},
        {name: 'Miskoli', description: 'Some description'},
        {name: 'LajuStick', description: 'Some description'},
        {name: 'Timeyin', description: 'Some description'}
      ];
    }, 1000).then(function() {
      $scope.moderators = users;
    });
  }
});

app.config(function() {

});