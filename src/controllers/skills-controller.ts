import { AppRequest, AppResponse } from '@/@types/express'
import { Skill, SkillUser } from '@/database/sequelize/skill'
import { AuthMiddleware } from '@/http/middlewares/auth-middleware'
import { BodyMiddleware } from '@/http/middlewares/body-middleware'
import { CreateSkillDTO, UpdateSkillDTO, UpdateUserSkillDTO } from '@/schemas/skill-dto'

export class SkillsController {
  @AuthMiddleware({ onlyAuthenticated: true, onlyAdmin: true })
  @BodyMiddleware(CreateSkillDTO)
  async createSkill(req: AppRequest, res: AppResponse) {
    const { name, description, slug } = req.body as CreateSkillDTO

    const slugExists = await Skill.findOne({ where: { slug } })

    if(slugExists) {
      return res.status(409).json({ message: 'Já existe uma skill com esse slug' })
    }

    const skill = new Skill({
      name,
      description: description ?? undefined,
      slug: slug,
    })

    await skill.save()

    res.status(201).json(skill.toJSON())
  }

  @AuthMiddleware({ onlyAuthenticated: true, onlyAdmin: true })
  @BodyMiddleware(UpdateSkillDTO)
  async updateSkill(req: AppRequest, res: AppResponse) {
    const skillId = parseInt(req.params.skill_id as string, 10)
    const { name, description, slug } = req.body as UpdateSkillDTO

    const skill = await Skill.findByPk(skillId)

    if(!skill) {
      return res.status(404).json({ message: 'Skill não encontrada' })
    }

    if(slug && slug !== skill.slug) {
      const slugExists = await Skill.findOne({ where: { slug } })

      if(slugExists) {
        return res.status(409).json({ message: 'Já existe uma skill com esse slug' })
      }

      skill.set('slug', slug)
    }

    if(name) skill.set('name', name)
    if(description !== undefined) skill.set('description', description)

    await skill.save()

    res.json(skill.toJSON())
  }

  @AuthMiddleware({ onlyAuthenticated: true })
  @BodyMiddleware(UpdateUserSkillDTO)
  async updateUserSkill(req: AppRequest, res: AppResponse) {
    const user = req.getUser()

    if(!user) {
      return res.status(401).json({ message: 'Não autenticado' })
    }

    const skillId = parseInt(req.params.skill_id as string, 10)
    const { level } = req.body as UpdateUserSkillDTO

    const skill = await Skill.findByPk(skillId)

    if(!skill) {
      return res.status(404).json({ message: 'Skill não encontrada' })
    }

    await SkillUser.upsert({
      userId: user.id,
      skillId,
      level,
    })

    return res.status(200).json({ message: 'Skill do usuário atualizada' })
  }
}