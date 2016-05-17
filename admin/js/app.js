'use strict';

var app = angular.module('app', [
    'ngRoute',          //$routeProvider
    'controllers',      //Our module frontend/web/js/controllers.js
    'tm.pagination'
]);

app.config(['$routeProvider', '$httpProvider',
    function($routeProvider, $httpProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'index.html',
                controller: 'MainController'
            }).
            when('/productOrderList', {
            	templateUrl: 'product-order-list.html',
            	controller: 'ProductOrderListController'
            }).
            when('/productOrderDetail/:id', {
            	templateUrl: 'product-order-detail.html',
            	controller: 'ProductOrderDetailController'
            }).
            when('/productOrderUpdate/:id', {
            	templateUrl: 'product-order-update.html',
            	controller: 'ProductOrderUpdateController'
            }).           
            when('/productOrderAdd', {
            	templateUrl: 'product-order-add.html',
            	controller: 'ProductOrderAddController'
            }).
            when('/icCategoryList', {
            	templateUrl: 'ic-category-list.html',
            	controller: 'IcCategoryListController'
            }).
            when('/icCategoryAdd', {
            	templateUrl: 'ic-category-add.html',
            	controller: 'IcCategoryAddController'
            }).
            when('/lampbeadList', {
            	templateUrl: 'lampbead-list.html',
            	controller: 'LampbeadListController'
            }).
            when('/lampbeadDetail/:id', {
            	templateUrl: 'lampbead-detail.html',
            	controller: 'LampbeadDetailController'
            }).
            when('/lampbeadAdd', {
            	templateUrl: 'lampbead-add.html',
            	controller: 'LampbeadAddController'
            }).
            when('/lampbeadUpdate/:id', {
            	templateUrl: 'lampbead-update.html',
            	controller: 'LampbeadUpdateController'
            }).
            when('/lampbeadShippingList', {
            	templateUrl: 'lampbead-shipping-list.html',
            	controller: 'LampbeadShippingListController'
            }).
            when('/icList', {
            	templateUrl: 'ic-list.html',
            	controller: 'IcListController'
            }).
            when('/icAdd', {
            	templateUrl: 'ic-add.html',
            	controller: 'IcAddController'
            }).
            when('/icLogs', {
            	templateUrl: 'ic-logs.html',
            	controller: 'IcLogsController'
            }).
            when('/repertoryList', {
            	templateUrl: 'repertory-list.html',
            	controller: 'RepertoryListController'
            }).
            when('/shippingList', {
            	templateUrl: 'shipping-list.html',
            	controller: 'ShippingListController'
            }).
            when('/shippingAdd', {
            	templateUrl: 'shipping-add.html',
            	controller: 'ShippingAddController'
            }).
            when('/productModelList', {
            	templateUrl: 'product-model-list.html',
            	controller: 'ProductModelListController'
            }).
            when('/productModelAdd', {
            	templateUrl: 'product-model-add.html',
            	controller: 'ProductModelAddController'
            }).
            when('/userUpdate/:uid', {
            	templateUrl: 'user-update.html',
            	controller: 'UserUpdateController'
            }).
            when('/userList', {
            	templateUrl: 'user-list.html',
            	controller: 'UserListController'
            }).
            when('/userAdd', {
            	templateUrl: 'user-add.html',
            	controller: 'UserAddController'
            }).
            when('/login', {
                templateUrl: 'login.html',
                controller: 'LoginController'
            }).
            otherwise({
            	templateUrl: '404.html'
            });
        $httpProvider.interceptors.push('authInterceptor');
    }
]);



app.factory('authInterceptor', ['$q', '$window', '$location','$rootScope',function ($q, $window, $location,$rootScope) {
	
    return {
        request: function (config) {
        	
            if ($window.sessionStorage.access_token != 'undefined' && $window.sessionStorage.access_token != null) {
                //HttpBearerAuth
                config.headers.Authorization = 'Bearer ' + $window.sessionStorage.access_token;
                var routeName =  $location.path() == '/' ? '/productOrderList' : $location.path();
                $rootScope.loggedUser = {
                		username:$window.sessionStorage.username,
                		userid:$window.sessionStorage.userid,
                		utype:$window.sessionStorage.type,
                };
                $location.path(routeName).replace();
                return config;
            }
            else
        	{
            	$location.path('/login').replace();
                return config;
        	}
            
        },
        responseError: function (rejection) {
            if (rejection.status === 401) {
                $location.path('/login').replace();
            }
            return $q.reject(rejection);
        }
    };
}]);