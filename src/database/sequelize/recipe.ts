import { 
  CreationOptional, 
  DataTypes, 
  InferAttributes, 
  InferCreationAttributes, 
  Model, 
} from 'sequelize'

import { sequelize } from './index'

export class Recipe extends Model<
  InferAttributes<Recipe>,
  InferCreationAttributes<Recipe>
> {
  declare id: CreationOptional<number>

  declare title: string

  declare description: string

  declare instructions: string

  declare externalUrl?: string
}

Recipe.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      defaultValue: () => Date.now(),
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    externalUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Recipe',
    tableName: 'recipes',
  },
)

export class RecipeAuthor extends Model<
  InferAttributes<RecipeAuthor>,
  InferCreationAttributes<RecipeAuthor>
> {
  declare recipeId: number

  declare userId: number
}

RecipeAuthor.init(
  {
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    recipeId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'recipes',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'AuthorRecipe',
    tableName: 'user_recipes',
  },
)

