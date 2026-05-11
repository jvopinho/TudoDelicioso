import { Router } from 'express'

import { frontendAuthenticate } from '@/http/middlewares/auth-middleware'
import { RecipesService } from '@/services/recipes-service'

export const recipesFrontendRoute = Router()

const recipesService = new RecipesService()

recipesFrontendRoute.get('/create', frontendAuthenticate({ onlyAuthenticated: true }), async(req, res) => {
  const user = req.getUser()?.toJSON()
  
  const recipes = await recipesService.getRecipes({ ascending: false })

  res.render('recipes/create', {
    // recipes,
    user,
  })
})