<?php

namespace api\modules\v1\models;

use Yii;

/**
 * This is the model class for table "brands".
 *
 * @property string $id
 * @property string $name
 * @property string $user_id
 * @property string $created_at
 */
class Brands extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'brands';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['name', 'user_id', 'created_at'], 'required'],
            [['user_id', 'created_at'], 'integer'],
            [['name'], 'string', 'max' => 60]
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'name' => 'Name',
            'user_id' => 'User ID',
            'created_at' => 'Created At',
        ];
    }
}
