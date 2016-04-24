<?php
namespace api\modules\v1\controllers;
use Yii;
use api\controllers\BaseController;
use api\modules\v1\models\Repertory;
use api\modules\v1\models\User;
use yii\filters\auth\HttpBasicAuth;

class RepertoryController extends BaseController
{
	public $modelClass = 'api\modules\v1\models\Repertory';
	
	
	
	public function actions()
	{
		$actions = parent::actions();
		unset($actions['create'],$actions['index'],$actions['view'],$actions['delete'],$actions['update']);
		return $actions;
	}
	
	public function actionIndex()
	{
		$model = Repertory::find()->asArray()->all();
		
		foreach ($model as $k => $v)
		{
			$model[$k]['username'] = User::findOne($v['user_id'])->username;
		}
		
		return $model;
	}
	
	
	/* function to find the requested record/model */
	protected function findModel($id)
	{
		if (($model = Repertory::findOne($id)) !== null) {
			return $model;
		} else {
	
			$this->setHeader(400);
			echo json_encode(array('status'=>0,'error_code'=>400,'message'=>'Bad request'),JSON_PRETTY_PRINT);
			exit;
		}
	}
}