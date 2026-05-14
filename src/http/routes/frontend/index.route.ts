import { Application, Router } from 'express'

import { AdminController } from '@/controllers/admin-controller'
import { AuthController } from '@/controllers/auth-controller'
import { ProfileController } from '@/controllers/profile-controller'
import { RecipesController } from '@/controllers/recipes-controller'

const recipesController = new RecipesController()
const adminController = new AdminController()
const authController = new AuthController()
const profileController = new ProfileController()

const recipesFrontendRoute = Router()
  .get('/create', recipesController.viewCreate.bind(recipesController) as Application)
  .get('/search', recipesController.viewSearch.bind(recipesController) as Application)
  .get('/:recipe_id', recipesController.viewRecipe.bind(recipesController) as Application)
  .get('/:recipe_id/edit', recipesController.viewEdit.bind(recipesController) as Application)

const adminFrontendRoute = Router()
  .get('/users', adminController.viewUsers.bind(adminController) as Application)
  .get('/recipes', adminController.viewRecipes.bind(adminController) as Application)
  .get('/categories', adminController.viewCategories.bind(adminController) as Application)
  .get('/skills', adminController.viewSkills.bind(adminController) as Application)
  .get('/report', adminController.viewReport.bind(adminController) as Application)

const profileFrontendRoute = Router()
  .get('/skills', profileController.viewSkills.bind(profileController) as Application)
  .get('/recipes', profileController.viewRecipes.bind(profileController) as Application)

export const frontendRoute = Router()
  .use('/recipes', recipesFrontendRoute)
  .use('/admin', adminFrontendRoute)
  .use('/profile', profileFrontendRoute)
  .get('/', authController.viewHome.bind(authController) as Application)
  .get('/login', authController.viewLogin.bind(authController) as Application)
  .get('/403', authController.view403.bind(authController) as Application)
  .get('/404', authController.view404.bind(authController) as Application)
