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
class Lampbead extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'lampbead';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['order_no','lampbead_model','factory_zh_name','factory_en_name'], 'required'],
        	[['order_no','lampbead_model','factory_en_name','factory_zh_name','order_no'],'string'],
        	[['created_at','number','user_id'],'number'],
        	['created_at', 'default','value'=>time()],
        	
        ];
    }


}
