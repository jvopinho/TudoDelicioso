import { Category } from '@/database/sequelize/category'

export class CategoriesService {
  async findAllCategories() {
    const categories = await Category.findAll({
      order: [['id', 'ASC']],
    })

    return categories.map(category => category.toJSON())
  }
}