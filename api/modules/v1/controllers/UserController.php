<?php

namespace api\modules\v1\controllers;

use \Yii;
use \api\controllers\BaseController;
use yii\data\ActiveDataProvider;

class UserController extends BaseController
{
	public $modelClass = 'api\modules\v1\models\User';
	 
	public function actions()
	{
		$actions = parent::actions();
		unset($actions['index'], $actions['update'], $actions['create'], $actions['delete'], $actions['view']);
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
			Yii::$app->response->statusCode = 400;
		}
		return $model;
	}
	
	
	
	public function actionIndex($page, $pageSize)
	{
		$modelClass = $this->modelClass;		
		return new ActiveDataProvider([
				'query' => $modelClass::find(),
				'pagination' => [
						'pageSize' => $pageSize,
						],
				]);
				
	}
	
	
	
	public function actionUpdate($id)
	{
		$model = $this->findModel($id);
		$data = Yii::$app->request->post();
		if(isset($data['password']))
		{
			$data['password_hash'] = Yii::$app->security->generatePasswordHash($data['password']);
			unset($data['password']);
		}
		$model->attributes = $data;
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
		// ����û��ܷ���� $action �� $model
		// ���ʱ��ܾ�Ӧ�׳�ForbiddenHttpException
		// var_dump($params);exit;
	}
	
   
}
