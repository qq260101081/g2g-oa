'use strict';

var controllers = angular.module('controllers', []);
var webRoot = '/g2goa/';

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
            
            $http.post(webRoot+'api/web/login', $scope.userModel).success(
                function (data) {
                	if(data.success == true)
                	{
                		$window.sessionStorage.username = $scope.userModel.username;
                        $window.sessionStorage.userid = data.data.id;
                        $window.sessionStorage.type = data.data.type;
                        $window.sessionStorage.access_token = data.data.access_token;
                        $location.path('/productOrderList').replace();
                	}
                	else
                	{
                		angular.forEach(data.data, function (error) {
                            $scope.error = error.message;
                        });
                	}
                	                    
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

controllers.controller('ProductOrderListController', ['$scope', '$http','$location', 'BusinessService', function ($scope, $http, $location, BusinessService) {

    var GetLists = function () {

        var postData = {
            pageIndex: $scope.paginationConf.currentPage,
            pageSize: $scope.paginationConf.itemsPerPage
        }

        BusinessService.list(webRoot+'api/web/v1/productorder', postData).success(function (response) {
            $scope.paginationConf.totalItems = response.pages['x-pagination-total-count'][0];
            $scope.orders = response.data;
            angular.forEach(response.data, function(v,k){
         	   if(v.progress) 
         	   {       		  
         		  var arr = v.progress.split('-');
         		  angular.forEach(arr, function(vv){
         			  $scope.orders[k][vv] = vv;
         		  });
         	   }
            });   
        });

    }

    //配置分页基本参数
    $scope.paginationConf = {
        currentPage: 1,
        itemsPerPage: 5
    };

    /***************************************************************
    当页码和页面记录数发生变化时监控后台查询
    如果把currentPage和itemsPerPage分开监控的话则会触发两次后台事件。 
    ***************************************************************/
    $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', GetLists);
    
 // update progress
	$scope.productOrderProgress = function(id, progress){
		angular.forEach($scope.orders, function (v,k) {
			if(v.id == id && $scope.orders[k][progress] == undefined) 
				$scope.orders[k][progress] = progress;
			else
				$scope.orders[k][progress] = '';
        });
		$http.put(webRoot+'api/web/v1/productorder/'+id, {'progress':progress}).success(
	            function (data) {
	            	$location.path('/productOrderList').replace();
	            }).error(
	                function (data) {
	                	
	                	
	                    angular.forEach(data, function (error) {
	                        $scope.error[error.field] = error.message;
	                    });
	                }
	         );
	}
}]);


//业务类
app.factory('BusinessService', ['$http', function ($http) {
    var list = function (url, postData) {
        return $http.get(url+'?page='+postData.pageIndex+'&pageSize='+postData.pageSize);
    }

    return {
        list: function (url, postData) {
            return list(url, postData);
        }
    }
}]);

controllers.controller('ProductOrderAddController', [
	'$scope','$http','$window', '$location',
  	function($scope, $http, $window, $location) {
		$http.get(webRoot+'api/web/v1/factory').success(function(data){
			$scope.fatores = data.data;
		});
		
		$http.get(webRoot+'api/web/v1/product-model').success(function(data){
			$scope.productModel = data.data;
		});
		
		$http.get(webRoot+'api/web/v1/lampbead?page=0&pageSize=0&where=repertory').success(function(data){
			$scope.lampbead = data.data;
		});
	   
		$scope.selectFatory = function(factory_name) {
		    $scope.factory_name = factory_name;
		}
		$scope.selectProductModel = function(product_name) {
		    $scope.product_model = product_name;
		}
		$scope.selectLampbead = function(order_no) {
		    $scope.lamp_bead_code = order_no;
		}
		
		$scope.addorder = function()
		{   
			angular.forEach(this.fatores, function (v) {

	            if(v.zh_name == $scope.factory_name) $scope.order.factory_en_name = v.en_name;
	        });
			
			$http.post(webRoot+'api/web/v1/productorder', $scope.order).success(
	            function (data) {
	            	if(data.success)
	            	{
	            		$location.path('/productOrderList');
	            	}
	            	else
	            	{
	            		alert(data.message + ' 库存数量：'+data.number);
	            	}
	            });
		}
		
  	}
]);

controllers.controller('ProductOrderDetailController', [
'$scope','$http','$window', '$location', '$routeParams',
function($scope, $http, $window, $location, $routeParams) {
	
	$http.get(webRoot+'api/web/v1/productorder/'+$routeParams.id).success(
      function (data) {
         $scope.order = data.data;
         $scope.order.state = data.data.status;
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
		$http.put(webRoot+'api/web/v1/productorder/'+$scope.order.id, $scope.neworder).success(
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
	$http.get(webRoot+'api/web/v1/productorder/'+$routeParams.id).success(
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


controllers.controller('LampbeadAddController', [
 	'$scope','$http','$window', '$location',
   	function($scope, $http, $window, $location) {
 		
 		$scope.fatores = [
 		    {id:'1', zh_name:"源磊灯珠", en_name:"YL"},
 		    {id:'2', zh_name:"天电灯珠", en_name:"TD"},
 		    {id:'3', zh_name:"巴瑞德灯珠", en_name:"RD"},
 		];
 		    
 		$scope.lampbeadModel = [
 		    {id:'1', name:'2835 -0.2W-3V三安芯片 10*30'},
 			{id:'2', name:'T28351-SR-R39A-G0-IS 2.0V-2.2V三安芯片 14mil'},
 			{id:'3', name:'3030 -1W-3V三安芯片17*34Mil双并'},
 			{id:'4', name:'9V-3030  芯片尺寸：32BB,9V高压'},
 			{id:'5', name:'3014 -0.2W三安芯片10*30Mil（25-27LM)'},
 			{id:'6', name:'BCR450'},	
 		 ];
 		
 		$scope.factory_zh_name = '源磊灯珠';
 	    $scope.factory_en_name = 'YL';
 	    $scope.lampbead_model  = '2835 -0.2W-3V三安芯片 10*30';
 		$scope.selectFatory = function(obj) {
 		    $scope.factory_zh_name = obj.zh_name;
 		    $scope.factory_en_name = obj.en_name;
 		}
 		$scope.selectLampbeadModel = function(obj) {
 		    $scope.lampbead_model = obj.name;
 		}
 		
 		
 		$scope.addLampbead = function()
 		{
 			$scope.order.factory_zh_name = $scope.factory_zh_name;
 			$scope.order.factory_en_name = $scope.factory_en_name;
 			$scope.order.lampbead_model = $scope.lampbead_model;
 			$http.post(webRoot+'api/web/v1/lampbead', $scope.order).success(
 	            function (data) {
 	            	$location.path('/lampbeadList');
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

controllers.controller('LampbeadListController', ['$scope','$http','$window', '$location', 'BusinessService',function($scope, $http, $window, $location, BusinessService) {
	var GetLists = function () {
        var postData = {
            pageIndex: $scope.paginationConf.currentPage,
            pageSize: $scope.paginationConf.itemsPerPage
        }
        BusinessService.list(webRoot+'api/web/v1/lampbead', postData).success(function (response) {
            $scope.paginationConf.totalItems = response.pages['x-pagination-total-count'][0];
            $scope.lamps = response.data;
        });
    };
    //配置分页基本参数
    $scope.paginationConf = {
        currentPage: 1,
        itemsPerPage: 5
    };
    $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', GetLists);

  	}
  ]);


controllers.controller('LampbeadDetailController', [
'$scope','$http','$window', '$location', '$routeParams',
function($scope, $http, $window, $location, $routeParams) {
	
	$http.get(webRoot+'api/web/v1/lampbead/'+$routeParams.id).success(
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
}]);

controllers.controller('LampbeadShippingListController', ['$scope','$http','$window', '$location', 'BusinessService',function($scope, $http, $window, $location, BusinessService) {
	var GetLists = function () {
        var postData = {
            pageIndex: $scope.paginationConf.currentPage,
            pageSize: $scope.paginationConf.itemsPerPage
        }
        BusinessService.list(webRoot+'api/web/v1/lampbeadShipping', postData).success(function (response) {
            $scope.paginationConf.totalItems = response.pages['x-pagination-total-count'][0];
            $scope.lamps = response.data;
        });
    };
    //配置分页基本参数
    $scope.paginationConf = {
        currentPage: 1,
        itemsPerPage: 5
    };
    $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', GetLists);

  	}
  ]);

controllers.controller('IcListController', ['$scope','$http','$window', '$location', 'BusinessService',function($scope, $http, $window, $location, BusinessService) {
	var GetLists = function () {
        var postData = {
            pageIndex: $scope.paginationConf.currentPage,
            pageSize: $scope.paginationConf.itemsPerPage
        }
        BusinessService.list(webRoot+'api/web/v1/ic', postData).success(function (response) {
            $scope.paginationConf.totalItems = response.pages['x-pagination-total-count'][0];
            $scope.ic = response.data;
        });
    };
    //配置分页基本参数
    $scope.paginationConf = {
        currentPage: 1,
        itemsPerPage: 5
    };
    $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', GetLists);

  	}
  ]);

controllers.controller('IcAddController', [
  	'$scope','$http','$window', '$location',
    	function($scope, $http, $window, $location) {
  		
	  		$scope.ic = {ic_name:"BCR450",fatory_name:"英飞凌 ic"};  		
	  		
	  		$scope.addIc = function()
	  		{
	  			$http.post(webRoot+'api/web/v1/ic', $scope.ic).success(
	  	        function (data) {
	  	            	$location.path('/icList');
	  	        });
	  		}
    	}
  ]);

controllers.controller('IcCategoryListController', ['$scope','$route','$http','$window', '$location', 'BusinessService',function($scope,$route, $http, $window, $location, BusinessService) {
	var GetLists = function () {
        var postData = {
            pageIndex: $scope.paginationConf.currentPage,
            pageSize: $scope.paginationConf.itemsPerPage
        }
        BusinessService.list(webRoot+'api/web/v1/ic-category', postData).success(function (response) {
            $scope.paginationConf.totalItems = response.pages['x-pagination-total-count'][0];
            $scope.icCategory = response.data;
        });
    };
    //配置分页基本参数
    $scope.paginationConf = {
        currentPage: 1,
        itemsPerPage: 5
    };
    $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', GetLists);
    $scope.deleteCategory = function(id){
		$http.delete(webRoot+'api/web/v1/ic-category/'+id).success(
		        function (data) {
		            	$location.path('/icCategoryList');
		            	$route.reload();
		        });
	}
  	}
  ]);

controllers.controller('IcCategoryAddController', [
 	'$scope','$http','$window', '$location',
   	function($scope, $http, $window, $location) {
  		$scope.addIcCategory = function()
  		{
  			$http.post(webRoot+'api/web/v1/ic-category', $scope.ic).success(
  	        function (data) {
  	            	$location.path('/icCategoryList');
  	        });
  		}
   	}
 ]);


controllers.controller('RepertoryListController', [
'$scope','$http','$window', '$location', '$routeParams','BusinessService',
function($scope, $http, $window, $location, $routeParams, BusinessService) {
	var GetLists = function () {
        var postData = {
            pageIndex: $scope.paginationConf.currentPage,
            pageSize: $scope.paginationConf.itemsPerPage
        }
        BusinessService.list(webRoot+'api/web/v1/repertory', postData).success(function (response) {
            $scope.paginationConf.totalItems = response.data.pages['total_count'];
            $scope.repertory = response.data.data;
        });
    };
    //配置分页基本参数
    $scope.paginationConf = {
        currentPage: 1,
        itemsPerPage: 5
    };
    $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', GetLists);
    
}]);

controllers.controller('ShippingAddController', [
'$scope','$http','$window', '$location', '$routeParams',
function($scope, $http, $window, $location, $routeParams) {
	
	$http.get(webRoot+'api/web/v1/repertory').success(
      function (data) {
    	  $scope.pnumber = {};
         var tmpArr = $scope.repertory = [];
         angular.forEach(data.data, function (v,k) {
        	 var id = v.id;
        	 if($scope.pnumber[id] == undefined)
        		 $scope.pnumber[id] = {number:v.number*1 - v.shipment_number*1};
        	 else
        		 $scope.pnumber[id] = {number: number[id].number + (v.number*1 - v.shipment_number*1)};
        	 
             if(v.shipment_number*1 < v.number*1 && tmpArr.indexOf(v.product_name) == -1) {
            	 
            	 tmpArr.push(v.product_name);
            	 $scope.repertory = [
               	     {id:v.id, product_name:v.product_name, number:v.number,shipment_number:v.shipment_number,order_no:v.order_no},
               	 ];
             }
         });
      }).error(
          function (data) {
          	console.log(2222);
              angular.forEach(data, function (error) {
                  $scope.error[error.field] = error.message;
              });
          }
      );
	
	$scope.addShipping = function(pnumber)
	{ 
		if(pnumber < $scope.number) {
			$scope.error = '出货库存数量不够';
			return;
		}
		var data = {};
		data['number'] = $scope.number;
		data['product_name'] = $scope.product_name.product_name;
	    data['shipping_type'] = $scope.shipping_type==undefined ? 'sea' : $scope.shipping_type;
	    
		$http.post(webRoot+'api/web/v1/shipping', data).success(
        function (res) {
        	$location.path('/shippingList');
        }).error(
            function (res) {
                angular.forEach(res, function (error) {
                    $scope.error[error.field] = error.message;
                });
            }
        );
	}
	
}]);

controllers.controller('ShippingListController', [
'$scope','$http','$window', '$location', '$routeParams','BusinessService',
function($scope, $http, $window, $location, $routeParams, BusinessService) {
	var GetLists = function () {
        var postData = {
            pageIndex: $scope.paginationConf.currentPage,
            pageSize: $scope.paginationConf.itemsPerPage
        }
        BusinessService.list(webRoot+'api/web/v1/shipping', postData).success(function (response) {
            $scope.paginationConf.totalItems = response.data.pages['total_count'];
            $scope.shipping = response.data.data;
        });
    };
    //配置分页基本参数
    $scope.paginationConf = {
        currentPage: 1,
        itemsPerPage: 5
    };
    $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', GetLists);
    //出货确认
    $scope.changeStatus = function(id, check){
		$http.put(webRoot+'api/web/v1/shipping/'+id, {status:check}).success(
            function (data) {
            	$location.path('/shippingList');
            }).error(
                function (data) {
                	 	
                    angular.forEach(data, function (error) {
                        $scope.error[error.field] = error.message;
                    });
                }
         );
	}
    
}]);

controllers.controller('ProductModelListController', ['$scope','$route','$http','$window', '$location', 'BusinessService',function($scope,$route, $http, $window, $location, BusinessService) {
	var GetLists = function () {
        var postData = {
            pageIndex: $scope.paginationConf.currentPage,
            pageSize: $scope.paginationConf.itemsPerPage
        }
        BusinessService.list(webRoot+'api/web/v1/product-model', postData).success(function (response) {
            $scope.paginationConf.totalItems = response.pages['x-pagination-total-count'][0];
            $scope.pmodel = response.data;
        });
    };
    //配置分页基本参数
    $scope.paginationConf = {
        currentPage: 1,
        itemsPerPage: 5
    };
    $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', GetLists);
    $scope.deleteProductModel = function(id){
		$http.delete(webRoot+'api/web/v1/product-model/'+id).success(
        function (data) {
            	$location.path('/productModelList');
            	$route.reload();
        });
	}
  	}
  ]);

controllers.controller('ProductModelAddController', [
	'$scope','$http','$window', '$location',
  	function($scope, $http, $window, $location) {
		$http.get(webRoot+'api/web/v1/ic-category').success(function (response) {
            $scope.ics = response.data;
        });
		$scope.selectIc = function(ic_name){
			$scope.pmodel.ic = ic_name;
		}
 		$scope.addProductModel = function()
 		{
 			$http.post(webRoot+'api/web/v1/product-model', $scope.pmodel).success(
 	        function (data) {
 	            $location.path('/productModelList');
 	        });
 		}
  	}
]);

controllers.controller('UserUpdateController', [
'$scope','$http','$window', '$location', '$routeParams',
function($scope, $http, $window, $location, $routeParams) {
	$http.get(webRoot+'api/web/v1/user/'+$routeParams.uid).success(
      function (data) {
         $scope.user = data.data;
      }).error(
          function (data) {
          	console.log(data);
              angular.forEach(data, function (error) {
                  $scope.error[error.field] = error.message;
              });
          }
      );
	
	$scope.userUpdate = function(user){
		$http.put(webRoot+'api/web/v1/user/'+$routeParams.uid, $scope.user).success(
            function (data) {
            	if(data.success == true) alert('修改成功');
            	//$location.path('/shippingList');
            }).error(
                function (data) {
                	 	
                    angular.forEach(data, function (error) {
                        $scope.error[error.field] = error.message;
                    });
                }
         );
	}
}]);

controllers.controller('UserListController', [
'$scope','$http','$window', '$location', '$routeParams','BusinessService',
function($scope, $http, $window, $location, $routeParams,BusinessService) {
	
	var GetLists = function () {
        var postData = {
            pageIndex: $scope.paginationConf.currentPage,
            pageSize: $scope.paginationConf.itemsPerPage
        }
        BusinessService.list(webRoot+'api/web/v1/user', postData).success(function (response) {
            $scope.paginationConf.totalItems = response.pages['x-pagination-total-count'][0];
            $scope.users = response.data;
        });
    };
    //配置分页基本参数
    $scope.paginationConf = {
        currentPage: 1,
        itemsPerPage: 5
    };
    $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', GetLists);
    
}]);

controllers.controller('UserAddController', [
'$scope','$http','$window', '$location', '$routeParams',
function($scope, $http, $window, $location, $routeParams) {
	
	$http.get(webRoot+'api/web/v1/factory').success(
	  function (factory) {
		  $scope.en_name = 'g2g';
		  $scope.factores = factory.data;
		  $scope.factores.unshift({en_name:'g2g', zh_name:'G2G'});
	});
	$scope.changeBelong = function(en_name){
		$scope.user.belong = en_name;
	}
	$scope.userAdd = function(){
		if($scope.user.type == undefined) $scope.user.type = 'factory';
		if($scope.user.status == undefined) $scope.user.status = 'active';
		if($scope.user.belong == undefined) $scope.user.belong = 'g2g';
		$http.post(webRoot+'api/web/v1/user', $scope.user).success(
	      function (data) {
	    	  if(data.success == true) 
	    	  {
	    		  $location.path('/userList');
	    	  }
	    	  else
	    	  {
	    		  angular.forEach(data.data, function (error) {
	                  $scope.error = error.message;
	                  return $scope.error;
	              });
	    	  }
	    });
	}
	
}]);

controllers.controller('LampbeadShippingListController', [
'$scope','$http','$window', '$location', '$routeParams','BusinessService',
function($scope, $http, $window, $location, $routeParams,BusinessService) {
	
	var GetLists = function () {
        var postData = {
            pageIndex: $scope.paginationConf.currentPage,
            pageSize: $scope.paginationConf.itemsPerPage
        }
        BusinessService.list(webRoot+'api/web/v1/lampbead-shipping', postData).success(function (response) {
            $scope.paginationConf.totalItems = response.pages['x-pagination-total-count'][0];
            $scope.lampShipping = response.data;
        });
    };
    //配置分页基本参数
    $scope.paginationConf = {
        currentPage: 1,
        itemsPerPage: 5
    };
    $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', GetLists);
    
}]);
controllers.controller('IcLogsController', [
'$scope','$http','$window', '$location', '$routeParams','BusinessService',
function($scope, $http, $window, $location, $routeParams,BusinessService) {
	
	var GetLists = function () {
        var postData = {
            pageIndex: $scope.paginationConf.currentPage,
            pageSize: $scope.paginationConf.itemsPerPage
        }
        BusinessService.list(webRoot+'api/web/v1/ic-logs', postData).success(function (response) {
            $scope.paginationConf.totalItems = response.pages['x-pagination-total-count'][0];
            $scope.icShipping = response.data;
        });
    };
    //配置分页基本参数
    $scope.paginationConf = {
        currentPage: 1,
        itemsPerPage: 5
    };
    $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', GetLists);
    
}]);


