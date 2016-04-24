<?php
namespace api\modules\v1\controllers;
use Yii;
use api\controllers\BaseController;
use api\modules\v1\models\Shipping;
use api\modules\v1\models\User;
use yii\filters\auth\HttpBasicAuth;
use api\modules\v1\models\Repertory;

class ShippingController extends BaseController
{
	public $modelClass = 'api\modules\v1\models\Shipping';
	
	
	
	public function actions()
	{
		$actions = parent::actions();
		unset($actions['create'],$actions['index'],$actions['view'],$actions['delete'],$actions['update']);
		return $actions;
	}
	
	public function actionIndex()
	{
		$model = Shipping::find()->asArray()->all();
	
		foreach ($model as $k => $v)
		{
			$model[$k]['username'] = User::findOne($v['user_id'])->username;
		}
	
		return $model;
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
		$model->user_id = Yii::$app->user->identity->id;
		$model->save();
		return $model;
	}
	
	public function actionUpdate($id)
	{
		//审核确认出货
		$status = Yii::$app->request->post()['status'];
		$model = $this->findModel($id);
		$model->status = $status;
		$model->check_uid = Yii::$app->user->identity->id;
		//扣除库存
		if($model->save())
		{
			$number = 0;
			do 
			{
				$repertory = Repertory::findBySql("select * from ".Repertory::tableName()." where shipment_number < number and product_name="."'$model->product_name'")
				->orderBy('id asc')->one();
				//print_r($repertory);die;
				if($repertory->number >= $model->number)
				{
					$repertory->shipment_number += $model->number;
				}
				else 
				{
					$repertory->shipment_number = $repertory->number;
				}
				$repertory->shipmented_at = time();
				$repertory->save();
				$number += $repertory->number;
			}
			while($number < $model->number);
		}
		return $model;
	}
	
	/* function to find the requested record/model */
	protected function findModel($id)
	{
		if (($model = Shipping::findOne($id)) !== null) {
			return $model;
		} else {
	
			$this->setHeader(400);
			echo json_encode(array('status'=>0,'error_code'=>400,'message'=>'Bad request'),JSON_PRETTY_PRINT);
			exit;
		}
	}
}