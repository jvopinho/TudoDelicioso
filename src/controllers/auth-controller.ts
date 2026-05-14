import jwt from 'jsonwebtoken'

import { AppRequest, AppResponse, AuthenticatedRequest } from '@/@types/express'
import { PasswordAdapter } from '@/adapters/password-adapter'
import { User } from '@/database/sequelize/user'
import { env } from '@/env'
import { SessionMiddleware } from '@/http/middlewares/auth-middleware'
import { BodyMiddleware } from '@/http/middlewares/body-middleware'
import { SignInDTO } from '@/schemas/auth-dto'
import { CategoriesService } from '@/services/categories-service'
import { RecipesService } from '@/services/recipes-service'

export class AuthController {
  private recipesService = new RecipesService()

  private categoriesService = new CategoriesService()

  @BodyMiddleware(SignInDTO)
  async signIn(req: AppRequest, res: AppResponse) {
    const { email, password } = req.body as SignInDTO

    const user = await User.findOne({ where: { email } })

    if(!user) {
      return res.status(401).json({ message: 'Email ou senha inválidos' })
    }

    const isMatch = await PasswordAdapter.comparePassword(password, user.passwordHash)

    if(!isMatch) {
      return res.status(401).json({ message: 'Email ou senha inválidos' })
    }

    const token = jwt.sign({
      user_id: user.id,
    }, env.SESSION_JWT_SECRET)

    res.json({ access_token: token })
  }

  @SessionMiddleware({ onlyAuthenticated: false })
  async viewHome(req: AuthenticatedRequest, res: AppResponse) {
    const user = req.getUser()?.toJSON()
    
    const recipes = await this.recipesService.getRecipes({ ascending: false })
    const categories = await this.categoriesService.findAllCategories()
    const randomRecipes = await this.recipesService.getRandomRecipes(4)

    res.render('home', {
      recipes,
      user,
      randomRecipes,
      categories,
    })
  }

  @SessionMiddleware({ onlyAuthenticated: false })
  viewLogin(req: AppRequest, res: AppResponse) {
    const user = req.getUser()?.toJSON()

    res.render('login', {
      user,
    })
  }

  @SessionMiddleware({ onlyAuthenticated: false })
  view403(req: AppRequest, res: AppResponse) {
    const user = req.getUser()?.toJSON()

    res.status(403).render('403', {
      user: null,
    })
  }

  @SessionMiddleware({ onlyAuthenticated: false })
  view404(req: AppRequest, res: AppResponse) {
    const user = req.getUser()?.toJSON()

    res.status(404).render('404', {
      user: null,
    })
  }
}