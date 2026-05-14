import { sql } from '@/utils/sql'

import { sequelize } from '@/database/sequelize'
import { Recipe } from '@/database/sequelize/recipe'
import { User } from '@/database/sequelize/user'

export class AdminService {
  async findAllUsers() {
    const users = await User.findAll({
      order: [['id', 'ASC']],
    })

    return users.map(user => user.toJSON())
  }

  async getReport() {
    const skillsReport = await sequelize.query(sql`
      SELECT
        s.id,
        s.name,
        s.slug,

      COUNT(us."userId")::integer
        AS users_count,

      COALESCE(
        ROUND(AVG(us.level), 2),
        0
      ) AS average_level,

      COUNT(
        CASE
          WHEN us.level >= 8
          THEN 1
        END
      )::integer AS mastery_users_count

      FROM skills s

      LEFT JOIN user_skill us
      ON us."skillId" = s.id

      GROUP BY
        s.id,
        s.name,
        s.slug

      ORDER BY
        users_count DESC,
        average_level DESC
      `,
    { type: 'SELECT' },
    )

    const recipesCount = await Recipe.count()

    const [recipesByCategory] = await sequelize.query(sql`
      SELECT
        c.id,
        c.name,
        c.slug,

        COUNT(rc.*)::integer
          AS recipes_count

      FROM categories c

      LEFT JOIN recipe_categories rc
        ON rc."categoryId" = c.id

      GROUP BY
        c.id,
        c.name,
        c.slug

      ORDER BY
        recipes_count DESC
    `)

    return {
      skills: skillsReport,
      recipes: {
        total: recipesCount,

        byCategory: recipesByCategory,
      },
    }
  }
}