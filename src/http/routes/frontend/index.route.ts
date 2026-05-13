import { Router } from 'express'
import { Op, Sequelize } from 'sequelize'

import { Recipe } from '@/database/sequelize/recipe'
import { frontendAuthenticate } from '@/http/middlewares/auth-middleware'
import { RecipesService } from '@/services/recipes-service'

import { recipesFrontendRoute } from './recipes.route'

export const frontendRoute = Router()
  .use('/recipes', recipesFrontendRoute)

const recipesService = new RecipesService()

frontendRoute.get('/', frontendAuthenticate({ onlyAuthenticated: false }), async(req, res) => {
  const user = req.getUser()?.toJSON()
  
  const recipes = await recipesService.getRecipes({ ascending: false })

  const randomRecipes = await Recipe.findAll({
    where: {
      thumbnail: {
        [Op.and]: {
          [Op.not]: null,
          [Op.ne]: '',
        },
      },
    },

    order: Sequelize.literal('RANDOM()'),

    limit: 4,
  })

  console.log(randomRecipes)

  res.render('home', {
    recipes,
    user,
    randomRecipes,
  })
})

frontendRoute.get('/login', (req, res) => {
  res.render('login', {
    user: null,
  })
})