<?php

namespace api\modules\v1\models;

use \Yii;

/**
 * This is the model class for table "lampbead".
 *
 * @property integer $id
 * @property string $order_no
 * @property string $lampbead_model
 * @property string $factory_zh_name
 * @property string $factory_en_name
 * @property integer $number
 * @property integer $created_at
 */
class LampbeadShipping extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return '{{%lampbead_shipping_logs}}';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['lamp_order_no','username','product_name','number','remark'], 'required'],
        	[['created_at','number'],'number'],
        	['created_at', 'default','value'=>time()],
        	
        ];
    }


}
