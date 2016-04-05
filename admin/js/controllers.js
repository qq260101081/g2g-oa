'use strict';

var controllers = angular.module('controllers', []);

controllers.controller('MainController', ['$scope', '$location', '$window',
    function ($scope, $location, $window) {
		$scope.loggedUser = {username:$window.sessionStorage.username,userid:$window.sessionStorage.userid};
		
        $scope.loggedIn = function() {
            return Boolean($window.sessionStorage.access_token);
        };

        $scope.logout = function () {
            delete $window.sessionStorage.access_token;
            $location.path('/login').replace();
        };
    }
]);


controllers.controller('LoginController', ['$scope','$http', '$window', '$location',
    function($scope, $http, $window, $location) {
        $scope.login = function () {
            $scope.submitted = true;
            $scope.error = {};
            
            $http.post('/g2goa/api/web/login', $scope.userModel).success(
                function (data) {
                	
                    $window.sessionStorage.username = $scope.userModel.username;
                    $window.sessionStorage.userid = data.data.id;
                    $window.sessionStorage.access_token = data.data.access_token;
                    
                    $location.path('/productOrderList').replace();
            }).error(
                function (data) {
                    angular.forEach(data, function (error) {
                        $scope.error[error.field] = error.message;
                    });
                }
            );
        };
    }
]);

controllers.controller('ProductOrderListController', [
	'$scope','$http','$window', '$location',
	function($scope, $http, $window, $location) {
		$http.get('/g2goa/api/web/v1/productorder', $scope.order).success(
        function (data) {
           $scope.orders = data.data;
           console.log(data);
        }).error(
            function (data) {
            	console.log(data);
                angular.forEach(data, function (error) {
                    $scope.error[error.field] = error.message;
                });
            }
        );
	}
]);

controllers.controller('ProductOrderAddController', [
	'$scope','$http','$window', '$location',
  	function($scope, $http, $window, $location) {
		$scope.fatory = {
			1:'广州力侬照明技术有限公司',
			2:'美耐斯光电',
			3:'TPK'
		};
		$scope.productModel = {
			1:'AURORA I GENIV（LNMS5NW3ALE65G-CC12）',
			2:'AURORA R（LNMD5R4ALE65G-D12）',
			3:'AURORA MINI White（LNMS7W2F26-D12）',
			4:'G2G NOX White（LNMS7NW3ALE65G-D12-NOX）',
			5:'G2G SparX（LNMS8W4AON262H-CC12）',
			6:'G2G ArRay PRO 3.6W（LNMS8W6AON260I-CC12）',
			7:'G2G ArRay SF 1.0W（LNMS5NW3ALE65G-CC12）',
			8:'G2G TRIDENT DF',
			9:'G2G ArRay MINI 1.2W（LNMS5NW3ALE65G-CC12）',
			10:'AURORA EX（LNMS2W3N79-DC12）',
			11:'AURORA MINI Red（LNMS7R2F26-D12）',
			12:'G2G NOX Warm White（LNMS7WW3ALE65G-D13-NOX）',
			13:'G2G SparX GENII（LNMS5NW3ALE65G-CC12）',
			14:'G2G ArRay ECO 1.8W（LNMS5NW3ALE65G-CC12）',
			15:'AURORA SV',
			16:'SV Red',
			17:'G2G ArRay MINI 1.0W（LNMS5NW3ALE65G-CC12）',
		};
		$scope.addorder = function()
		{
			$http.post('/g2goa/api/web/v1/productorder', $scope.order).success(
	            function (data) {
	            }).error(
	                function (data) {
	                	
	                    angular.forEach(data, function (error) {
	                        $scope.error[error.field] = error.message;
	                    });
	                }
	            );
		}
		
  	}
]);
