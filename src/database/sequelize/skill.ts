import { 
  CreationOptional, 
  DataTypes, 
  InferAttributes, 
  InferCreationAttributes, 
  Model, 
} from 'sequelize'

import { sequelize } from './index'

export class Skill extends Model<
  InferAttributes<Skill>,
  InferCreationAttributes<Skill>
> {
  declare id: CreationOptional<number>

  declare name: string

  declare description: string | null

  declare slug: string
}

Skill.init(
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
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: 'Skill',
    tableName: 'skills',
  },
)

export class SkillUser extends Model<
  InferAttributes<SkillUser>,
  InferCreationAttributes<SkillUser>
> {
  declare skillId: number

  declare userId: number

  declare level: number
}

SkillUser.init(
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
    skillId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'skills',
        key: 'id',
      },
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'SkillUser',
    tableName: 'user_skill',
  },
)