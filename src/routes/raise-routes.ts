
import { Request, Response, Router } from 'express';
import { authentication } from '../utilities/authentication';

const router: Router = Router();

router.post('/', authentication.required, function (req: Request, res: Response, next) {
  User.findById(req.payload.id).then(function (user) {
    if (!user) {
      return res.sendStatus(401);
    }

    const article = new Article(req.body.article);

    article.author = user;

    return article.save().then(function () {
      console.log(article.author);
      return res.json({article: article.toJSONFor(user)});
    });
  }).catch(next);
});