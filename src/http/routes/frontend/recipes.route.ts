import { Router } from 'express'

import { timeAgo } from '@/utils/time-utils'

import { frontendAuthenticate } from '@/http/middlewares/auth-middleware'
import { RecipesService } from '@/services/recipes-service'

export const recipesFrontendRoute = Router()

const recipesService = new RecipesService()

recipesFrontendRoute.get('/:recipe_id', frontendAuthenticate({ onlyAuthenticated: false }), async(req, res) => {
  const user = req.getUser()?.toJSON()
  
  const recipe = await recipesService.getRecipeById(parseInt(req.params.recipe_id! as string))

  console.log(recipe)

  const similarRecipes = await recipesService.getRandomRecipes(3)

  const comments = [
    {
      author: 'Jane Doe',
      content: 'Essa receita é incrível! Meus amigos adoraram.',
      ago: timeAgo(new Date().getTime() - 3600 * 1000 * 5), // 5 horas atrás
    },
    {
      author: 'Alice Johnson',
      content: 'Adorei essa receita! O sabor ficou incrível e a textura perfeita.',
      ago: timeAgo(new Date().getTime() - 3600 * 1000 * 1), // 1 hora atrás
    },
    {
      author: 'John Smith',
      content: 'Fiz essa receita no fim de semana e foi um sucesso! Muito fácil de seguir.',
      ago: timeAgo(new Date().getTime() - 3600 * 1000 * 24 * 2), // 2 dias atrás
    },
  ]

  res.render('recipes/main', {
    recipe,
    user,
    similarRecipes,
    comments,
  })
})

recipesFrontendRoute.get('/create', frontendAuthenticate({ onlyAuthenticated: true }), async(req, res) => {
  const user = req.getUser()?.toJSON()
  
  const recipes = await recipesService.getRecipes({ ascending: false })

  res.render('recipes/create', {
    // recipes,
    user,
  })
})