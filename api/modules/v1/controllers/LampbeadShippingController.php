<?php
namespace api\modules\v1\controllers;
use Yii;
use api\controllers\BaseController;
use api\modules\v1\models\LampbeadShipping;
use api\modules\v1\models\User;
use yii\filters\auth\HttpBasicAuth;
use yii\data\ActiveDataProvider;
use api\modules\v1\models\Lampbead;

class LampbeadShippingController extends BaseController
{
	public $modelClass = 'api\modules\v1\models\LampbeadShipping';
	
	
	
	public function actions()
	{
		$actions = parent::actions();
		unset($actions['index'],$actions['create'],$actions['view'],$actions['delete'],$actions['update']);
		return $actions;
	}
	
	public function actionIndex($page, $pageSize)
	{
		return new ActiveDataProvider([
				'query' => LampbeadShipping::find()->orderBy('id desc'),
				'pagination' => [
						'pageSize' => $pageSize,
				],
		]);
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
		$lampbead = Lampbead::find()->where(['order_no' => Yii::$app->request->post()['lamp_order_no']])->one();
		if($lampbead->remaining < Yii::$app->request->post()['number'])
		{
			echo json_encode(array('status'=>false,'error_code'=>400,'number'=>$lampbead->remaining,'message'=>'灯珠库存不足'),JSON_PRETTY_PRINT);
			exit;
		}
		$lampbead->remaining -= Yii::$app->request->post()['number'];
		$model->attributes = Yii::$app->request->post();
		$model->username = Yii::$app->user->identity->username;
		if($lampbead->save()) $model->save();
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
		if (($model = LampbeadShipping::findOne($id)) !== null) {
			return $model;
		} else {
	
			$this->setHeader(400);
			echo json_encode(array('status'=>0,'error_code'=>400,'message'=>'Bad request'),JSON_PRETTY_PRINT);
			exit;
		}
	}
}