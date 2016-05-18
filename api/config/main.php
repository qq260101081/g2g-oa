<?php
$params = array_merge(
    require(__DIR__ . '/../../common/config/params.php'),
    require(__DIR__ . '/../../common/config/params-local.php'),
    require(__DIR__ . '/params.php'),
    require(__DIR__ . '/params-local.php')
);

return [
    'id' => 'app-api',
    'basePath' => dirname(__DIR__),
    'bootstrap' => ['log'],
    'controllerNamespace' => 'api\controllers',
	'modules' => [
		'v1' => [
			'class' => 'api\modules\v1\Module'
		]
	],	
    'components' => [
    	'urlManager' => [
    		'enablePrettyUrl' => true,
	        'showScriptName' => false,
	        'enableStrictParsing' => false,
	        'rules' => [
	            [
	                'class' => 'yii\rest\UrlRule', 
	                'controller' => [
	                		'v1/user',
	                		'v1/productorder',
	                		'v1/factory',
	                		'v1/lampbead',
	                		'v1/repertory',
	                		'v1/shipping',
	                		'v1/lampbead-shipping',
	                		'v1/lampbead-category',
	                		'v1/ic',
	                		'v1/ic-category',
	                		'v1/product-model',
	                ], 
	                'pluralize'=>false	
	            ],
	        ],
    	],
    	'response' => [
    		'class' => 'yii\web\Response',
    		'format' => yii\web\Response::FORMAT_JSON,
    				
    		'on beforeSend' => function ($event) {
    			$response = $event->sender;
    			//print_r($response->getHeaders());
    			$response->getHeaders()->remove('www-authenticate'); // THIS
		        $response->formatters['html'] = 'yii\web\JsonResponseFormatter';
		        $response->data = [
		            'success' => $response->isSuccessful,
		            'data'    => $response->data,
		        	'pages'   => $response->headers
		        ];
    			$response->statusCode = 200;
    		},
    	],
        'user' => [
            'identityClass' => 'api\modules\v1\models\User',
            'enableAutoLogin' => true,
        	'enableSession' => false,
        	'loginUrl' => null
        ],
        'log' => [
            'traceLevel' => YII_DEBUG ? 3 : 0,
            'targets' => [
                [
                    'class' => 'yii\log\FileTarget',
                    'levels' => ['error', 'warning'],
                ],
            ],
        ],
        'errorHandler' => [
            'errorAction' => 'site/error',
        ],
    ],
    'params' => $params,
];
