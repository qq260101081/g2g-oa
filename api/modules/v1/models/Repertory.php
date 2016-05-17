<?php

namespace api\modules\v1\models;

use \Yii;
/**
 * This is the model class for table "product_repertory".
 *
 * @property integer $id
 * @property integer $user_id
 * @property string $product_type
 * @property string $order_no
 * @property string $product_name
 * @property integer $number
 * @property integer $shipment_at
 * @property integer $shipmented_number
 * @property integer $created_at
 */
class Repertory extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
	
    public static function tableName()
    {
        return '{{%product_repertory}}';
    }
    
    public function getUser()
    {
    	return $this->hasOne(User::className(), ['id' => 'user_id']);
    }

    public function attributes()
    {
    	return array_merge(parent::attributes(), ['user.username']);
    }
    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['user_id','product_type','order_no','product_name','number'], 'required'],
        	[['order_no','product_type','product_name'],'string'],
        	[['created_at','shipmented_at','user_id'],'number'],
        	['created_at', 'default','value'=>time()],
        	
        ];
    }


}
