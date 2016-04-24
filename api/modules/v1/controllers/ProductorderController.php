<?php
namespace api\modules\v1\controllers;
use Yii;
use api\controllers\BaseController;
use api\modules\v1\models\ProductOrder;
use api\modules\v1\models\User;
use api\modules\v1\models\Repertory;

class ProductorderController extends BaseController
{
	public $modelClass = 'api\modules\v1\models\ProductOrder';
	
	public function actions()
	{
		$actions = parent::actions();
		unset($actions['create'],$actions['index'],$actions['view'],$actions['delete'],$actions['update']);
		return $actions;
	}
	
	public function actionIndex()
	{
		//工厂只能看到自己的订单
		if(Yii::$app->user->identity->type == 'factory')
		{
			$model = ProductOrder::find()->where(['factory_en_name'=>Yii::$app->user->identity->belong])->orderBy('id desc')->all();
		}
		else 
		{
			$model = ProductOrder::find()->orderBy('id desc')->all();
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
		$p = 1;
		$orderNo = ProductOrder::find()->select('order_no')->where(['>','created_at',strtotime("today")])->orderBy('id desc')->one();
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
		
		if(isset(Yii::$app->request->post()['progress']))
		{
			if(!$model->progress) 
			{
				$model->progress = Yii::$app->request->post()['progress'];
			}
			else 
			{
				$arr = [];
				foreach (explode('-', $model->progress) as $v) {
					$arr[$v] = $v;
				}
				if(isset($arr[Yii::$app->request->post()['progress']])) 
					unset($arr[Yii::$app->request->post()['progress']]);
				else
					$arr[Yii::$app->request->post()['progress']] = Yii::$app->request->post()['progress'];
				$model->progress = implode('-', $arr);
			}
			$model->save();
			return $model;
			
		}
		elseif (isset(Yii::$app->request->post()['repcheck']))
		{
			if(Yii::$app->user->identity->type == 'g2g') 
			{
				$model->status = Yii::$app->request->post()['status'];
				if(Yii::$app->request->post()['status'] == 'complete')
				{
					//入库
					$repertoryModel = new Repertory();
					$repertoryModel->user_id = Yii::$app->user->identity->id;
					$repertoryModel->product_order_id = $model->id;
					$repertoryModel->number = $model->number;
					$repertoryModel->product_type = 'product';
					$repertoryModel->order_no = $model->order_no;
					$repertoryModel->price = $model->price;
					$repertoryModel->product_name = $model->product_model;
					if($repertoryModel->save())
					{
						$model->save();
					}
					
				}
				else
				{
					$model->save();
				}
				return $model;
			}
			
		}
		else
		{
			$data = Yii::$app->request->post();
			$model->status = 'ordered';
			
			if($model->factory_plan_delivery_time == 0)
			{
				if(isset($data['factory_plan_delivery_time']) && $data['factory_plan_delivery_time'])
				{
					$model->status = 'replied';
					$model->factory_plan_delivery_time = strtotime($data['factory_plan_delivery_time']);
				}
			}
			if(!$model->factory_remark)
			{
				if(isset($data['factory_remark'])) 
				{
					$model->status = 'replied';
					$model->factory_remark = $data['factory_remark'];
				}	
			}
			
			$model->save();
		}
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