import { Application, Router } from 'express'

import { AuthController } from '@/controllers/auth-controller'
import { CategoriesController } from '@/controllers/categories-controller'
import { RecipesController } from '@/controllers/recipes-controller'
import { SkillsController } from '@/controllers/skills-controller'
import { UsersController } from '@/controllers/users-controller'
import { uploadMiddleware } from '@/http/middlewares/storage-middleware'
import { UsersRepository } from '@/repositories/users-repository'

const usersRepository = new UsersRepository()

const authController = new AuthController(usersRepository)
const usersController = new UsersController(usersRepository)
const recipesController = new RecipesController()
const categoriesController = new CategoriesController()
const skillsController = new SkillsController()

const authRoute = Router()
  .post('/sign-in', authController.signIn.bind(authController) as Application)

const usersRoute = Router()
  .post('/', usersController.createUser.bind(usersController) as Application)
  .get('/@me', usersController.getCurrentUser.bind(usersController) as Application)
  .get('/', usersController.getAllUsers.bind(usersController) as Application)
  .patch('/:user_id', usersController.updateUser.bind(usersController) as Application)

const recipesRoute = Router()
  .post('/', recipesController.createRecipe.bind(recipesController) as Application)
  .post('/:recipe_id/upload', uploadMiddleware.single('thumbnail'), recipesController.uploadRecipeImage.bind(recipesController) as Application)
  .patch('/:recipe_id', recipesController.updateRecipe.bind(recipesController) as Application)

const categoriesRoute = Router()
  .post('/', categoriesController.createCategory.bind(categoriesController) as Application)
  .patch('/:category_id', categoriesController.updateCategory.bind(categoriesController) as Application)

const skillsRoute = Router()
  .post('/', skillsController.createSkill.bind(skillsController) as Application)
  .patch('/:skill_id', skillsController.updateSkill.bind(skillsController) as Application)
  .patch('/:skill_id/user', skillsController.updateUserSkill.bind(skillsController) as Application)

export const apiRoute = Router()
  .use('/users', usersRoute)
  .use('/auth', authRoute)
  .use('/recipes', recipesRoute)
  .use('/categories', categoriesRoute)
  .use('/skills', skillsRoute)