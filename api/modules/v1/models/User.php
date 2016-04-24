<?php

namespace api\modules\v1\models;

use Yii;
use yii\db\ActiveRecord;
use yii\web\IdentityInterface;


/**
 * This is the model class for table "{{%users}}".
 *
 * @property integer $id
 * @property string $username
 * @property string $emali
 * @property string $create_at
 */
class User extends ActiveRecord implements IdentityInterface
{
	public static function findIdentityByAccessToken($token, $type = null)
	{
		return static::findOne([
			'auth_key' => $token
		]);
	}
	
	 public function getId()
	{
		return $this->id;
	}
	
	public function getAuthKey()
	{
		return $this->auth_key;
	}
	
	public function validateAuthKey($authKey)
	{
		return $this->auth_key === $authKey;
	}
	
	public static function findIdentity($id)
	{
		return static::findOne($id);
	}
	
    
    public static function tableName()
    {
        return '{{%user}}';
    }
    
	public function rules()
     {
         return [
            [['username','password_hash','status','type','belong'], 'required'],
         	[['username','email'], 'unique'],
        	[['auth_key','belong','email','mobile','password_hash','status','tel','type','username'],'string'],
        	[['created_at','id','updated_at'],'number'],
        	['updated_at', 'default','value'=>time()],
        	
        ];
     }
    
    
    
	/* public function attributeLabels()
     {
         return [
             'id' => Yii::t('app', 'ID'),
             'username' => Yii::t('app', 'Username'),
             'status' => Yii::t('app', 'status'),
             'flag' => Yii::t('app', 'flag')
         ];
     } */
}
