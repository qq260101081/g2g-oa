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
class LampbeadCategory extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return '{{%lampbead_category}}';
    }
    
   

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['lamp_code'], 'required'], 	
        ];
    }


}
