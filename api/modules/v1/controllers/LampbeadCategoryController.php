<?php
namespace api\modules\v1\controllers;

use Yii;
use api\controllers\BaseController;
use yii\data\ActiveDataProvider;
use api\modules\v1\models\LampbeadCategory;

class LampbeadCategoryController extends BaseController
{
	public $modelClass = 'api\modules\v1\models\LampbeadCategory';
	
	public function actions()
	{
		$actions = parent::actions();
		unset($actions['index'],$actions['create'],$actions['view'],$actions['update']);
		return $actions;
	}
	
	public function actionIndex($page=0, $pageSize=0)
	{
		$model = $this->modelClass;
		if(!$page || !$pageSize)
		{
			return $model::find()->all();
		}
		else 
		{
			return new ActiveDataProvider([
					'query' => $model::find()->orderBy('id desc'),
					'pagination' => [
							'pageSize' => $pageSize,
					],
			]);
		}
	}
	
	public function actionView($id)
	{
		$model = $this->findModel($id);
		$user = User::findOne($model->user_id);
		
		$data = $model->attributes;
		$data['username'] = $user->username;
		
		return $data;
	}
	public function actionCreate()
	{
		$model = new $this->modelClass;
		$model->attributes = Yii::$app->request->post();
		$model->save();
	}
	
	public function actionUpdate($id)
	{
		$model = $this->findModel($id);
		if($model->factory_plan_delivery_time < 1)
			$model->factory_plan_delivery_time = (isset(Yii::$app->request->post()['factory_plan_delivery_time'])&&Yii::$app->request->post()['factory_plan_delivery_time'])?strtotime(Yii::$app->request->post()['factory_plan_delivery_time']):0;		
		if(!$model->factory_remark)
			$model->factory_remark = isset(Yii::$app->request->post()['factory_remark']) ? Yii::$app->request->post()['factory_remark']:'';
		
		if((!isset(Yii::$app->request->post()['factory_plan_delivery_time']) && (!isset(Yii::$app->request->post()['factory_remark']))))
			$model->status = 'ordered';
		$model->save();
	}
	
	/* function to find the requested record/model */
	protected function findModel($id)
	{
		if (($model = LampbeadCategory::findOne($id)) !== null) {
			return $model;
		} else {
	
			$this->setHeader(400);
			echo json_encode(array('status'=>0,'error_code'=>400,'message'=>'Bad request'),JSON_PRETTY_PRINT);
			exit;
		}
	}
}