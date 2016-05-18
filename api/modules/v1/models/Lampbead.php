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
            [['order_no','username','remaining'], 'required'],
        	[['order_no'],'string'],
        	[['created_at','number'],'number'],
        	['created_at', 'default','value'=>time()],
        	
        ];
    }


}
