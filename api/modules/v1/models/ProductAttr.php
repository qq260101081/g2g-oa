<?php

namespace api\modules\v1\models;

use Yii;

/**
 * This is the model class for table "product_attr".
 *
 * @property string $updated_at
 * @property integer $product_id
 * @property string $k
 * @property string $v
 */
class ProductAttr extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'product_attr';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['updated_at', 'product_id', 'k', 'v'], 'required'],
            [['updated_at', 'product_id'], 'integer'],
            [['k', 'v'], 'string', 'max' => 30]
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'updated_at' => 'Updated At',
            'product_id' => 'Product ID',
            'k' => 'K',
            'v' => 'V',
        ];
    }
}
