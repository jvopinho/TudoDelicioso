import { AppRequest, AppResponse } from '@/@types/express'
import { Category } from '@/database/sequelize/category'
import { AuthMiddleware } from '@/http/middlewares/auth-middleware'
import { BodyMiddleware } from '@/http/middlewares/body-middleware'
import { CreateCategoryDTO } from '@/schemas/category-dto'

export class CategoriesController {
  @AuthMiddleware({ onlyAuthenticated: true, onlyAdmin: true })
  @BodyMiddleware(CreateCategoryDTO)
  async createCategory(req: AppRequest, res: AppResponse) {
    const { name } = req.body as CreateCategoryDTO

    const category = new Category({
      name,
    })

    await category.save()

    res.json(category.toJSON())
  }
}