<?php

namespace api\modules\v1\controllers;

use \Yii;
use \api\controllers\BaseController;

class UserController extends BaseController
{
	public $modelClass = 'api\modules\v1\models\User';
	 
	public function actions()
	{
		$actions = parent::actions();
		// 注销系统自带的实现方法
		//unset($actions['index'], $actions['update'], $actions['create'], $actions['delete'], $actions['view']);
		unset($actions['create']);
		return $actions;
	}
	
	public function actionCreate()
	{
		$model = new $this->modelClass();
		$model->load(Yii::$app->getRequest()->getBodyParams(), '');
		$model->password_hash = Yii::$app->security->generatePasswordHash(Yii::$app->getRequest()->getBodyParams()['password']);	
		$model->auth_key = Yii::$app->security->generateRandomString();
		
		if (!$model->save())
		{
			return $model->getFirstErrors()[0];
		}
		return $model;
	}
	
	
	/* 
	public function actionIndex()
	{
		$modelClass = $this->modelClass;
		$query = $modelClass::find();
		
		return new ActiveDataProvider([
				'query' => $query
		]);
	}
	
	
	
	public function actionUpdate($id)
	{
		$model = $this->findModel($id);
		$model->attributes = Yii::$app->request->post();
		if (!$model->save()) 
		{
			return $model->getFirstErrors()[0];
		}
		return $model;
	}
	
	public function actionDelete($id)
	{
		return $this->findModel($id)->delete();
	}
	
	public function actionView($id)
	{
		return $this->findModel($id);
	}
	
	protected function findModel($id)
	{
		$modelClass = $this->modelClass;
		if (($model = $modelClass::findOne($id)) !== null) {
			return $model;
		} else {
			throw new NotFoundHttpException('The requested page does not exist.');
		}
	}
	
	public function checkAccess($action, $model = null, $params = [])
	{
		// 检查用户能否访问 $action 和 $model
		// 访问被拒绝应抛出ForbiddenHttpException
		// var_dump($params);exit;
	} */
	
   
}
