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
class Factory extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'factory';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['zh_name', 'en_name'], 'required'],
            [['zh_name','en_name'], 'string', 'max' => 60]
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'zh_name' => '中文工厂名',
            'en_name' => '英文工厂名',
        ];
    }
}
