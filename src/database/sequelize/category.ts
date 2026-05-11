import { 
  CreationOptional, 
  DataTypes, 
  InferAttributes, 
  InferCreationAttributes, 
  Model, 
} from 'sequelize'

import { sequelize } from './index'

export class Category extends Model<
  InferAttributes<Category>,
  InferCreationAttributes<Category>
> {
  declare id: CreationOptional<number>

  declare name: string
}

Category.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      defaultValue: () => Date.now(),
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Category',
    tableName: 'categories',
  },
)