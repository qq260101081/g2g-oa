<?php

namespace api\modules\v1\models;

use Yii;

/**
 * This is the model class for table "factory".
 *
 * @property string $id
 * @property string $zh_name
 * @property string $en_name
 */
class Shipping extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'shipping_logs';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['user_id', 'number', 'product_name', 'shipping_type', 'number'], 'required'],
        	[['created_at','number','user_id'],'number'],
        	['created_at', 'default','value'=>time()],
        ];
    }

    
}
