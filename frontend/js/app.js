var myApp = angular.module('myApp', []);

myApp.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

myApp.controller('myCtrl', ['$scope', '$http', function($scope, $http){
    
    $scope.uploadFile = function(){
        var file = $scope.myFile;
        var fd = new FormData();
        var config = {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        };
        fd.append('file', file);
        $http.post("api/", fd, config).then(function(response) {
            $scope.descripcion = response.data[0].labelAnnotations[0].description;
           }, function(error) {
            $scope.descripcion = "me caga las piñas";
        });
    };
    
}]);