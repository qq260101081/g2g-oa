<?php
namespace api\controllers;

use Yii;
use common\models\LoginForm;
use yii\filters\ContentNegotiator;
use yii\web\Response;
use yii\filters\AccessControl;
use yii\rest\Controller;
use yii\filters\auth\HttpBearerAuth;

/**
 * Site controller
 */
class LoginController extends Controller
{
    /**
     * @inheritdoc
     */
	
	
    public function behaviors()
    {
        $behaviors = parent::behaviors();
        $behaviors['authenticator'] = [
            'class' => HttpBearerAuth::className(),
            'only' => ['auth'],
        ];
        $behaviors['contentNegotiator'] = [
            'class' => ContentNegotiator::className(),
            'formats' => [
                'application/json' => Response::FORMAT_JSON,
                
            ],
        ];
        $behaviors['access'] = [
            'class' => AccessControl::className(),
            'only' => ['auth'],
            'rules' => [
                [
                    'actions' => ['auth'],
                    'allow' => true,
                    'roles' => ['@'],
                ],
            ],
        ];
        return $behaviors;
    }

  
    public function actionIndex()
    {
    	$model = new LoginForm();
		
        if ($model->load(Yii::$app->getRequest()->getBodyParams(), '') && $model->login()) 
        {
            return [
            	'id' => Yii::$app->user->identity->id,
            	'email' => Yii::$app->user->identity->email,
            	'access_token' => Yii::$app->user->identity->getAuthKey(),  	
            ];
        }
        else 
        {
            $model->validate();
            return $model;
        }
    }

    public function actionAuth()
    {
        $response = [
            'email' => Yii::$app->user->identity->email,
            'access_token' => Yii::$app->user->identity->getAuthKey(),
        ];

        return $response;
    }

   
}
