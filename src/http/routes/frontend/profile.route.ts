import { Router } from 'express'

import { frontendAuthenticate } from '@/http/middlewares/auth-middleware'
import { RecipesService } from '@/services/recipes-service'
import { SkillsService } from '@/services/skills-service'

export const profileFrontendRoute = Router()

const skillsService = new SkillsService()
const recipesService = new RecipesService()

profileFrontendRoute.get('/skills', frontendAuthenticate({ onlyAuthenticated: true, onlyAdmin: true }), async(req, res) => {
  const user = req.getUser()!.toJSON()

  const skills = await skillsService.findByUser(user.id)

  console.log(skills)

  res.render('profile/skills', {
    user,
    skills,
  })
})

profileFrontendRoute.get('/recipes', frontendAuthenticate({ onlyAuthenticated: true, onlyAdmin: true }), async(req, res) => {
  const user = req.getUser()!.toJSON()

  const recipes = await recipesService.getRecipesByUser(user.id)

  console.log(recipes)

  res.render('profile/recipes', {
    user,
    recipes,
  })
})