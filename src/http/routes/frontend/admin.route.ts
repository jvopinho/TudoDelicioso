import { Router } from 'express'

import { frontendAuthenticate } from '@/http/middlewares/auth-middleware'
import { AdminService } from '@/services/admin-service'
import { CategoriesService } from '@/services/categories-service'
import { RecipesService } from '@/services/recipes-service'
import { SkillsService } from '@/services/skills-service'

export const adminFrontendRoute = Router()

const adminService = new AdminService()
const categoriesService = new CategoriesService()
const skillsService = new SkillsService()
const recipesService = new RecipesService()

adminFrontendRoute.get('/users', frontendAuthenticate({ onlyAuthenticated: true, onlyAdmin: true }), async(req, res) => {
  const user = req.getUser()?.toJSON()

  const users = await adminService.findAllUsers()

  res.render('admin/users', {
    user,
    users,
  })
})

adminFrontendRoute.get('/recipes', frontendAuthenticate({ onlyAuthenticated: true, onlyAdmin: true }), async(req, res) => {
  const user = req.getUser()?.toJSON()

  const recipes = await recipesService.getRecipes()

  res.render('admin/recipes', {
    user,
    recipes,
  })
})

adminFrontendRoute.get('/categories', frontendAuthenticate({ onlyAuthenticated: true, onlyAdmin: true }), async(req, res) => {
  const user = req.getUser()?.toJSON()

  const categories = await categoriesService.findAllCategories()

  res.render('admin/categories', {
    user,
    categories,
  })
})

adminFrontendRoute.get('/skills', frontendAuthenticate({ onlyAuthenticated: true, onlyAdmin: true }), async(req, res) => {
  const user = req.getUser()?.toJSON()

  const skills = await skillsService.findAll()

  res.render('admin/skills', {
    user,
    skills,
  })
})

adminFrontendRoute.get('/report', frontendAuthenticate({ onlyAuthenticated: true, onlyAdmin: true }), async(req, res) => {
  const user = req.getUser()?.toJSON()

  const report = await adminService.getReport()

  console.log(report)
  console.log(report.recipes)

  res.render('admin/report', {
    user,
    report,
  })
})