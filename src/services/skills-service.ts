
import { sequelize } from '@/database/sequelize'
import { Skill } from '@/database/sequelize/skill'

export class SkillsService {
  async findAll() {
    const skills = await Skill.findAll({
      order: [['id', 'ASC']],
    })

    return skills.map(skill => skill.toJSON())
  }

  async findByUser(userId: number) {
    const userSkills = await sequelize.query(
      // eslint-disable-next-line @stylistic/quotes
      /*sql*/`SELECT s.id, s.slug, s.name, s.description, COALESCE(us."level", 0) AS level FROM skills s LEFT JOIN user_skill us ON s.id = us."skillId" AND us."userId" = $1;`,
      { bind: [userId], type: 'SELECT' },
    )
    
    return userSkills as Array<{
      id: number
      slug: string
      name: string
      description: string | null
      level: number
    }>
  }
}