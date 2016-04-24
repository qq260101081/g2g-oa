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

controllers.controller('ProductOrderListController', [
	'$scope','$http','$window', '$location',
	function($scope, $http, $window, $location) {
		$http.get(webRoot+'api/web/v1/productorder', $scope.order).success(
        function (data) {
           $scope.orders = data.data;
           angular.forEach($scope.orders, function(v,k){
        	   if(v.progress) 
        	   {       		  
        		  var arr = v.progress.split('-');
        		  angular.forEach(arr, function(vv){
        			  $scope.orders[k][vv] = vv;
        		  });
        	   }
           });   
           
        }).error(
            function (data) {
            	console.log(data);
                angular.forEach(data, function (error) {
                    $scope.error[error.field] = error.message;
                });
            }
        );
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
			
			$http.post(webRoot+'api/web/v1/productorder', $scope.order).success(
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
 		    {id:'3', zh_name:"英飞凌 ic", en_name:"YF"}
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

controllers.controller('LampbeadListController', [
'$scope','$http','$window', '$location',
function($scope, $http, $window, $location) {
	$http.get(webRoot+'api/web/v1/lampbead', $scope.order).success(
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

controllers.controller('LampbeadDetailController', [
'$scope','$http','$window', '$location', '$routeParams',
function($scope, $http, $window, $location, $routeParams) {
	
	$http.get(webRoot+'api/web/v1/lampbead/'+$routeParams.id).success(
      function (data) {
         $scope.order = data.data;
         console.log($scope.order);
      }).error(
          function (data) {
          	console.log(data);
              angular.forEach(data, function (error) {
                  $scope.error[error.field] = error.message;
              });
          }
      );
}]);

controllers.controller('RepertoryListController', [
'$scope','$http','$window', '$location', '$routeParams',
function($scope, $http, $window, $location, $routeParams) {
	
	$http.get(webRoot+'api/web/v1/repertory').success(
      function (data) {
         $scope.repertory = data.data;
      }).error(
          function (data) {
          	console.log(data);
              angular.forEach(data, function (error) {
                  $scope.error[error.field] = error.message;
              });
          }
      );
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
'$scope','$http','$window', '$location', '$routeParams',
function($scope, $http, $window, $location, $routeParams) {
	
	$http.get(webRoot+'api/web/v1/shipping').success(
      function (data) {
         $scope.shipping = data.data;
      }).error(
          function (data) {
          	console.log(data);
              angular.forEach(data, function (error) {
                  $scope.error[error.field] = error.message;
              });
          }
      );
	
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
'$scope','$http','$window', '$location', '$routeParams',
function($scope, $http, $window, $location, $routeParams) {
	$http.get(webRoot+'api/web/v1/user').success(
      function (data) {
         $scope.users = data.data;
         $scope.factores = {};
         $http.get(webRoot+'api/web/v1/factory').success(
	      function (factory) {
	    	 angular.forEach(factory.data, function (v) {
	    		 $scope.factores[v.en_name] = v.zh_name;
             });
	      });
      }).error(
          function (data) {
          	console.log(data);
              angular.forEach(data, function (error) {
                  $scope.error[error.field] = error.message;
              });
          }
      );
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