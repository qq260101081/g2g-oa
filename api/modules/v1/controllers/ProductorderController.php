<?php
namespace api\modules\v1\controllers;
use Yii;
use api\controllers\BaseController;
use api\modules\v1\models\ProductOrder;
use api\modules\v1\models\User;
use api\modules\v1\models\Repertory;
use yii\data\ActiveDataProvider;
use api\modules\v1\models\ProductModel;
use api\modules\v1\models\Ic;
use api\modules\v1\models\Lampbead;
use api\modules\v1\models\LampbeadShipping;
use api\modules\v1\models\IcShipping;


class ProductorderController extends BaseController
{
	public $modelClass = 'api\modules\v1\models\ProductOrder';
	
	public function actions()
	{
		$actions = parent::actions();
		unset($actions['create'],$actions['index'],$actions['view'],$actions['delete'],$actions['update']);
		return $actions;
	}
	
	public function actionIndex($page, $pageSize)
	{
		//工厂只能看到自己的订单
		if(Yii::$app->user->identity->type == 'factory')
		{
			$query = ProductOrder::find()->where(['factory_en_name'=>Yii::$app->user->identity->belong])->orderBy('id desc');
		}
		else 
		{
			$query = ProductOrder::find()->orderBy('id desc');
		}
		
		return new ActiveDataProvider([
					'query' => $query,
					'pagination' => [
							'pageSize' => $pageSize,
					],
			]);
	}
	
	public function actionView($id)
	{
		$model = $this->findModel($id);		
		$data = $model->attributes;
		return $data;
	}
	public function actionCreate()
	{
		$data = Yii::$app->request->post();
		//print_r($data);die;
		$productModel = ProductModel::find()->where(['product_name'=>$data['product_model']])->one();
		$ic = Ic::find()->where(['ic_name'=>$productModel->ic])->sum('remaining');
		
		if(!$ic)
		{
			$message = '没有找到关联的IC，请检查是否录入有IC库存！';
			$number = 0;
		}else {
			if($ic < $data['number']*$productModel->ic_number)
			{
				$message = 'IC库存不足！';
				$number = $ic;
			}
		}
		$lampbead = Lampbead::find()->where(['order_no'=>$data['lamp_bead_code']])->one();
		
		if(!$lampbead || $lampbead->remaining<($productModel->lamp_number*$data['number']+$productModel->lamp_number*$productModel->wastage_rate)) {
			$message = '灯珠库存不足！';
			$number = $lampbead->remaining;
		}
		if(isset($message))
		{
			//$this->setHeader(400);
			echo json_encode(array('status'=>false,'error_code'=>400,'number'=>$number,'message'=>$message),JSON_PRETTY_PRINT);
			exit;
		}
		//print_r($productModel);die;
		$p = 1;
		$orderNo = ProductOrder::find()->select('order_no')->where(['>','created_at',strtotime("today")])->orderBy('id desc')->one();
		if($orderNo)
		{
			$p = explode('-', $orderNo->order_no)[1]+1;
		}
		$model = new $this->modelClass;
		$model->attributes = $data;
		$model->order_no = 'G2G' . date('Ymd') . $data['factory_en_name'] . 'P-' . $p;
		$model->order_time = strtotime($model->attributes['order_time']);
		$model->plan_delivery_time = strtotime($model->attributes['plan_delivery_time']);
		$model->username = Yii::$app->user->identity->username;
		$model->ic = $productModel->ic;
		$model->ic_number = $productModel->ic_number * $data['number'];
		$model->lamp_number = $productModel->lamp_number * $data['number'] + ceil($productModel->lamp_number * $productModel->wastage_rate);
		$model->lamp_wastage_rate = $productModel->wastage_rate;
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
						if($model->save())
						{
							//扣除IC和灯珠
							$lampbead = Lampbead::find()->where(['order_no'=>$model->lamp_bead_code])->one();
							$lampbead->remaining -= $model->lamp_number;
							$lampbead->save();
							$lampbeadShipping = new LampbeadShipping();
							$lampbeadShipping->username = Yii::$app->user->identity->username;
							$lampbeadShipping->lamp_order_no = $model->lamp_bead_code;
							$lampbeadShipping->product_name = $model->product_model;
							$lampbeadShipping->number = $model->lamp_number;
							$lampbeadShipping->remark = '产品下单';
							$lampbeadShipping->save();
							$n = $model->ic_number;
							
							do {
								$icRemaining = Ic::find()->where(['ic_name'=>$model->ic])->andWhere(['>','remaining',0])->orderBy('id asc')->one();
								$n -= $icRemaining->remaining;
								if($n>0)
								{
									$icRemaining->remaining = 0;
									$icRemaining->save();
								}
								else
								{
									$icRemaining->remaining = abs($n);
									$icRemaining->save();
								}
							}while($n > 0);
								
							$icModel = new IcShipping();
							$icModel->username = Yii::$app->user->identity->username;
							$icModel->product_name = $model->product_model;
							$icModel->number = $model->ic_number;
							$icModel->save();
						}
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