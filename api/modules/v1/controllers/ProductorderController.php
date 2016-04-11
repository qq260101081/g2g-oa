<?php
namespace api\modules\v1\controllers;
use Yii;
use api\controllers\BaseController;
use api\modules\v1\models\ProductOrder;
use api\modules\v1\models\User;

class ProductorderController extends BaseController
{
	public $modelClass = 'api\modules\v1\models\ProductOrder';
	
	public function actions()
	{
		$actions = parent::actions();
		unset($actions['create'],$actions['view'],$actions['delete'],$actions['update']);
		return $actions;
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
		$p = 1;
		$orderNo = ProductOrder::find()->select('order_no')->where(['<','created_at',strtotime("today")+86400])->one();
		if($orderNo)
		{
			$p = explode('-', $orderNo->order_no)[1]+1;
		}
			
		$model = new $this->modelClass;
		$model->attributes = Yii::$app->request->post();
		$model->order_no = 'G2G' . date('Ymd') . $model->attributes['factory_en_name'] . 'P-' . $p;
		$model->order_time = strtotime($model->attributes['order_time']);
		$model->plan_delivery_time = strtotime($model->attributes['plan_delivery_time']);
		$model->user_id = Yii::$app->user->identity->id;
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
		if (($model = ProductOrder::findOne($id)) !== null) {
			return $model;
		} else {
	
			$this->setHeader(400);
			echo json_encode(array('status'=>0,'error_code'=>400,'message'=>'Bad request'),JSON_PRETTY_PRINT);
			exit;
		}
	}
}