<?php
namespace api\modules\v1\controllers;

use \api\controllers\BaseController;
use api\modules\v1\models\Factory;

class FactoryController extends BaseController
{
	public $modelClass = 'api\modules\v1\models\Factory';
	
	public function actions()
	{
		$actions = parent::actions();
		unset($actions['create'],$actions['index'],$actions['view'],$actions['update']);
		return $actions;
	}
	
	public function actionIndex($page=0, $pageSize=0)
	{
		if(!$page || !$pageSize){
			return Factory::find()->all();
		}
		else
		{
			return new ActiveDataProvider([
					'query' => Factory::find()->orderBy('id desc'),
					'pagination' => [
							'pageSize' => $pageSize,
					],
			]);
		}
	}
	
}