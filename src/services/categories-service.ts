import { Category } from '@/database/sequelize/category'

export class CategoriesService {
  async findAllCategories() {
    const categories = await Category.findAll({
      order: [['id', 'ASC']],
    })

    return categories.map(category => category.toJSON())
  }

  async findCategoryById(id: number) {
    const category = await Category.findByPk(id)

    if(!category) {
      return null
    }

    return category.toJSON()
  }
}