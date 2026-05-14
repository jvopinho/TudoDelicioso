import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize'

import { createEnum, enumInfer } from '@/utils/create-enum'


import { sequelize } from './index'

export const UserRole = createEnum([
  'ADMIN',
  'STUDENT',
] as const)
export type UserRole = enumInfer<typeof UserRole>

export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  declare id: CreationOptional<number>

  declare name: string

  declare email: string

  declare passwordHash: string

  declare role: CreationOptional<UserRole>
}

User.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      defaultValue: () => Date.now(),
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(...Object.keys(UserRole) as UserRole[]),
      allowNull: false,
      defaultValue: UserRole.STUDENT,
    },
  },
  {
    sequelize,
    tableName: 'users',
  },
)