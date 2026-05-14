import { AppResponse, AuthenticatedRequest } from '@/@types/express'
import { PasswordAdapter } from '@/adapters/password-adapter'
import { User } from '@/database/sequelize/user'
import { AuthMiddleware, SessionMiddleware } from '@/http/middlewares/auth-middleware'
import { BodyMiddleware } from '@/http/middlewares/body-middleware'
import { UpdateUserDTO } from '@/schemas/user-dto'
import { AdminService } from '@/services/admin-service'
import { CategoriesService } from '@/services/categories-service'
import { RecipesService } from '@/services/recipes-service'
import { SkillsService } from '@/services/skills-service'

export class AdminController {
  private adminService = new AdminService()

  private categoriesService = new CategoriesService()

  private skillsService = new SkillsService()

  private recipesService = new RecipesService()

  @AuthMiddleware({ onlyAuthenticated: true, onlyAdmin: true })
  @BodyMiddleware(UpdateUserDTO)
  async updateUser(req: AuthenticatedRequest, res: AppResponse) {
    const userId = parseInt(req.params.user_id! as string)
    const { email, name, password } = req.body as UpdateUserDTO

    const user = await User.findByPk(userId)

    if(!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' })
    }

    if(email) {
      user.set('email', email)
    }

    if(name) {
      user.set('name', name)
    }

    if(password) {
      const passwordHash = await PasswordAdapter.hashPassword(password)

      user.set('passwordHash', passwordHash)
    }

    await user.save()

    res.json(user.toJSON())
  }

  @SessionMiddleware({ onlyAuthenticated: true, onlyAdmin: true })
  async viewUsers(req: AuthenticatedRequest, res: AppResponse) {
    const user = req.getUser()?.toJSON()
    const users = await this.adminService.findAllUsers()

    res.render('admin/users', {
      user,
      users,
    })
  }

  @SessionMiddleware({ onlyAuthenticated: true, onlyAdmin: true })
  async viewRecipes(req: AuthenticatedRequest, res: AppResponse) {
    const user = req.getUser()?.toJSON()
    const recipes = await this.recipesService.getRecipes()

    res.render('admin/recipes', {
      user,
      recipes,
    })
  }

  @SessionMiddleware({ onlyAuthenticated: true, onlyAdmin: true })
  async viewCategories(req: AuthenticatedRequest, res: AppResponse) {
    const user = req.getUser()?.toJSON()
    const categories = await this.categoriesService.findAllCategories()

    res.render('admin/categories', {
      user,
      categories,
    })
  }

  @SessionMiddleware({ onlyAuthenticated: true, onlyAdmin: true })
  async viewSkills(req: AuthenticatedRequest, res: AppResponse) {
    const user = req.getUser()?.toJSON()
    const skills = await this.skillsService.findAll()

    res.render('admin/skills', {
      user,
      skills,
    })
  }

  @SessionMiddleware({ onlyAuthenticated: true, onlyAdmin: true })
  async viewReport(req: AuthenticatedRequest, res: AppResponse) {
    const user = req.getUser()?.toJSON()
    const report = await this.adminService.getReport()

    console.log(report)
    console.log(report.recipes)

    res.render('admin/report', {
      user,
      report,
    })
  }
}