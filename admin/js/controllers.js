'use strict';

var controllers = angular.module('controllers', []);

controllers.controller('MainController', ['$scope', '$location', '$window',
    function ($scope, $location, $window) {
		
        $scope.loggedIn = function() {
            return Boolean($window.sessionStorage.access_token);
        };

        $scope.logout = function () {
            delete $window.sessionStorage.access_token;
            delete $window.sessionStorage.username;
            delete $window.sessionStorage.userid;
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
                    $window.sessionStorage.type = data.data.type;
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
		
		$scope.fatores = [
		    {id:'1', zh_name:"广州力侬照明技术有限公司", en_name:"LN"},
		    {id:'2', zh_name:"深圳市美耐斯光电有限公司", en_name:"MY"},
		    {id:'3', zh_name:"中山市泰然光电科技有限公司", en_name:"TP"},
		    {id:'3', zh_name:"东莞市红富照明科技有限公司", en_name:"ST"}
		];
		    
		$scope.productModel = [
		    {id:'1', name:'AURORA I GENIV（LNMS5NW3ALE65G-CC12）'},
			{id:'2', name:'AURORA R（LNMD5R4ALE65G-D12）'},
			{id:'3', name:'AURORA MINI White（LNMS7W2F26-D12）'},
			{id:'4', name:'G2G NOX White（LNMS7NW3ALE65G-D12-NOX）'},
			{id:'5', name:'G2G SparX（LNMS8W4AON262H-CC12）'},
			{id:'6', name:'G2G ArRay PRO 3.6W（LNMS8W6AON260I-CC12）'},
			{id:'7', name:'G2G ArRay SF 1.0W（LNMS5NW3ALE65G-CC12）'},
			{id:'8', name:'G2G TRIDENT DF'},
			{id:'9', name:'G2G ArRay MINI 1.2W（LNMS5NW3ALE65G-CC12）'},
			{id:'10', name:'AURORA EX（LNMS2W3N79-DC12）'},
			{id:'11', name:'AURORA MINI Red（LNMS7R2F26-D12）'},
			{id:'12', name:'G2G NOX Warm White（LNMS7WW3ALE65G-D13-NOX）'},
			{id:'13', name:'G2G SparX GENII（LNMS5NW3ALE65G-CC12）'},
			{id:'14', name:'G2G ArRay ECO 1.8W（LNMS5NW3ALE65G-CC12）'},
			{id:'15', name:'AURORA SV'},
			{id:'16', name:'SV Red'},
			{id:'17', name:'G2G ArRay MINI 1.0W（LNMS5NW3ALE65G-CC12）'}
		 ];
		
		$scope.factory_zh_name = '广州力侬照明技术有限公司';
	    $scope.factory_en_name = 'LN';
	    $scope.product_model   = 'AURORA I GENIV（LNMS5NW3ALE65G-CC12）';
		$scope.selectFatory = function(obj) {
		    $scope.factory_zh_name = obj.zh_name;
		    $scope.factory_en_name = obj.en_name;
		}
		$scope.selectProductModel = function(obj) {
		    $scope.product_model = obj.name;
		}
		
		
		$scope.addorder = function()
		{
			$scope.order.factory_zh_name = $scope.factory_zh_name;
			$scope.order.factory_en_name = $scope.factory_en_name;
			$scope.order.product_model = $scope.product_model;
			
			$http.post('/g2goa/api/web/v1/productorder', $scope.order).success(
	            function (data) {
	            	$location.path('/productOrderList');
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

controllers.controller('ProductOrderDetailController', [
'$scope','$http','$window', '$location', '$routeParams',
function($scope, $http, $window, $location, $routeParams) {
	
	$http.get('/g2goa/api/web/v1/productorder/'+$routeParams.id).success(
      function (data) {
         $scope.order = data.data;
//         if($scope.order.factory_plan_delivery_time)
//         {
//        	 var date = new Date($scope.order.factory_plan_delivery_time*1000);
//             $scope.order.factory_plan_delivery_time = date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate();
//         }else{
//        	 $scope.order.factory_plan_delivery_time = '';
//         }
         if($scope.order.factory_plan_delivery_time<1) $scope.order.factory_plan_delivery_time = '';
      }).error(
          function (data) {
          	console.log(data);
              angular.forEach(data, function (error) {
                  $scope.error[error.field] = error.message;
              });
          }
      );
	$scope.neworder={};
	$scope.factoryReply = function()
	{
		$http.put('/g2goa/api/web/v1/productorder/'+$scope.order.id, $scope.neworder).success(
            function (data) {
            	$location.path('/productOrderList');
            }).error(
                function (data) {
                	
                	
                    angular.forEach(data, function (error) {
                        $scope.error[error.field] = error.message;
                    });
                }
         );
	}
	
}]);

controllers.controller('ProductOrderUpdateController', [
'$scope','$http','$window', '$location', '$routeParams',
function($scope, $http, $window, $location, $routeParams) {
	$scope.fatores = [
	    {id:'1', zh_name:"广州力侬照明技术有限公司", en_name:"LN"},
		{id:'2', zh_name:"深圳市美耐斯光电有限公司", en_name:"MY"},
		{id:'3', zh_name:"中山市泰然光电科技有限公司", en_name:"TP"},
		{id:'3', zh_name:"东莞市红富照明科技有限公司", en_name:"ST"}
	];
	$http.get('/g2goa/api/web/v1/productorder/'+$routeParams.id).success(
          function (data) {
             $scope.order = data.data;
             
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

