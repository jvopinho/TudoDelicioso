
import { AppRequest, AppResponse } from '@/@types/express'
import { Category } from '@/database/sequelize/category'
import { AuthMiddleware } from '@/http/middlewares/auth-middleware'
import { BodyMiddleware } from '@/http/middlewares/body-middleware'
import { CreateCategoryDTO, UpdateCategoryDTO } from '@/schemas/category-dto'

export class CategoriesController {
  @AuthMiddleware({ onlyAuthenticated: true, onlyAdmin: true })
  @BodyMiddleware(CreateCategoryDTO)
  async createCategory(req: AppRequest, res: AppResponse) {
    const { name, color, slug } = req.body as CreateCategoryDTO

    const slugExists = await Category.findOne({ where: { slug } })

    if(slugExists) {
      return res.status(409).json({ message: 'Já existe uma categoria com esse slug' })
    }

    console.log(req.body)

    const category = new Category({
      name,
      color,
      slug,
    })

    await category.save()

    res.status(201).json(category.toJSON())
  }

  @AuthMiddleware({ onlyAuthenticated: true, onlyAdmin: true })
  @BodyMiddleware(UpdateCategoryDTO)  
  async updateCategory(req: AppRequest, res: AppResponse) {
    const categoryId = parseInt(req.params.category_id as string, 10)
    const { name, color, slug } = req.body as UpdateCategoryDTO

    const category = await Category.findByPk(categoryId)

    if(!category) {
      return res.status(404).json({ message: 'Categoria não encontrada' })
    }

    if(slug && slug !== category.slug) {
      const slugExists = await Category.findOne({ where: { slug } })

      if(slugExists) {
        return res.status(409).json({ message: 'Já existe uma categoria com esse slug' })
      }

      category.set('slug', slug)
    }

    if(name) category.set('name', name)
    if(color !== undefined) category.set('color', color)

    await category.save()

    res.json(category.toJSON())
  }
}