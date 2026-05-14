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

  declare color: CreationOptional<string> | null

  declare slug: string
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
    color: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '#7ba4b8',
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: 'Category',
    tableName: 'categories',
  },
)