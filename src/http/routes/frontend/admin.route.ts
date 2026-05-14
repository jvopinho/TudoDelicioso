import { Router } from 'express'

import { frontendAuthenticate } from '@/http/middlewares/auth-middleware'
import { AdminService } from '@/services/admin-service'
import { CategoriesService } from '@/services/categories-service'
import { SkillsService } from '@/services/skills-service'

export const adminFrontendRoute = Router()

const adminService = new AdminService()
const categoriesService = new CategoriesService()
const skillsService = new SkillsService()

adminFrontendRoute.get('/users', frontendAuthenticate({ onlyAuthenticated: true, onlyAdmin: true }), async(req, res) => {
  const user = req.getUser()?.toJSON()

  const users = await adminService.findAllUsers()

  res.render('admin/users', {
    user,
    users,
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