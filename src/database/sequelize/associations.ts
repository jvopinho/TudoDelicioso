import { Category } from './category'
import { Recipe } from './recipe'
import { User } from './user'

export function setupAssociations() {
  Recipe.belongsToMany(Category, {
    through: 'recipe_categories',
  })

  Category.belongsToMany(Recipe, {
    through: 'recipe_categories',
  })

  Recipe.belongsToMany(User, {
    through: 'recipe_users',
  })

  User.belongsToMany(Recipe, {
    through: 'recipe_users',
  })
}