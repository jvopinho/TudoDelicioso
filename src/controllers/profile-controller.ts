import { AppResponse, AuthenticatedRequest } from '@/@types/express'
import { SessionMiddleware } from '@/http/middlewares/auth-middleware'
import { RecipesService } from '@/services/recipes-service'
import { SkillsService } from '@/services/skills-service'

export class ProfileController {
  private skillsService = new SkillsService()

  private recipesService = new RecipesService()

  @SessionMiddleware({ onlyAuthenticated: true })
  async viewSkills(req: AuthenticatedRequest, res: AppResponse) {
    const user = req.getUser()!.toJSON()

    const skills = await this.skillsService.findByUser(user.id)

    console.log(skills)

    res.render('profile/skills', {
      user,
      skills,
    })
  }

  @SessionMiddleware({ onlyAuthenticated: true })
  async viewRecipes(req: AuthenticatedRequest, res: AppResponse) {
    const user = req.getUser()!.toJSON()

    const recipes = await this.recipesService.getRecipesByUser(user.id)

    console.log(recipes)

    res.render('profile/recipes', {
      user,
      recipes,
    })
  }
}
