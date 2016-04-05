<?php

namespace api\controllers;

use Yii;
use yii\rest\ActiveController;
use yii\filters\auth\HttpBearerAuth;
use yii\web\NotFoundHttpException;

class BaseController extends ActiveController
{
	public function behaviors()
	{
		$behaviors = parent::behaviors();
		$behaviors['authenticator'] = [
				'class' => HttpBearerAuth::className(),
		];
		
		$behaviors['corsFilter'] = [
				'class' => \yii\filters\Cors::className(),
				'cors' => [
						//'Origin' => ['http://baidu.com'],
						//'Access-Control-Request-Method' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
				]
		]; 
	
		return $behaviors;
	}
}
