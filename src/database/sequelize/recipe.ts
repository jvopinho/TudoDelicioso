import { 
  CreationOptional, 
  DataTypes, 
  InferAttributes, 
  InferCreationAttributes, 
  Model, 
} from 'sequelize'

import { createEnum, enumInfer } from '@/utils/create-enum'

import { sequelize } from './index'

export const Difficulty = createEnum([
  'EASY',
  'MEDIUM',
  'HARD',
] as const)
export type Difficulty = enumInfer<typeof Difficulty>

export class Recipe extends Model<
  InferAttributes<Recipe>,
  InferCreationAttributes<Recipe>
> {
  declare id: CreationOptional<number>

  declare title: string

  declare description?: string

  declare instructions: string[]

  declare externalUrl?: string

  declare thumbnail?: string

  declare prepTime?: number

  declare ingredients: string[]

  declare servings?: number

  declare tip?: string

  declare difficulty?: Difficulty
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
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: false,
    },
    externalUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    thumbnail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    prepTime: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ingredients: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: false,
      defaultValue: [],
    },
    servings: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    tip: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    difficulty: {
      type: DataTypes.ENUM(...Object.values(Difficulty)),
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

