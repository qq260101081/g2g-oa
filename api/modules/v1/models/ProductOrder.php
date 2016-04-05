<?php

namespace api\modules\v1\models;

use \Yii;

/**
 * This is the model class for table "product".
 *
 * @property integer $id
 * @property string $category_id
 * @property string $name
 * @property string $pic
 * @property string $market_price
 * @property string $price
 * @property string $sell
 * @property string $repertory
 * @property string $brand_id
 * @property string $content
 * @property string $updated_at
 */
class ProductOrder extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'product_orders';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['product_model', 'number'], 'required'],
            
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'category_id' => 'Category ID',
            'name' => 'Name',
            'pic' => 'Pic',
            'market_price' => 'Market Price',
            'price' => 'Price',
            'sell' => 'Sell',
            'repertory' => 'Repertory',
            'brand_id' => 'Brand ID',
            'content' => 'Content',
            'updated_at' => 'Updated At',
        ];
    }
}
