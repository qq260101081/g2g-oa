'use strict';

var app = angular.module('app', [
    'ngRoute',          //$routeProvider
    'controllers'       //Our module frontend/web/js/controllers.js
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
            when('/productOrderAdd', {
            	templateUrl: 'product-order-add.html',
            	controller: 'ProductOrderAddController'
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

app.factory('authInterceptor', function ($q, $window, $location) {
	
    return {
        request: function (config) {
            if ($window.sessionStorage.access_token != 'undefined' && $window.sessionStorage.access_token != null) {
                //HttpBearerAuth
                config.headers.Authorization = 'Bearer ' + $window.sessionStorage.access_token;
                var routeName =  $location.path() == '/' ? '/productOrderList' : $location.path();
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
});