import { NextFunction, Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import User from '../models/user';
import { UserJwtPayload } from '../utilities/app';
import type { JwtPayload } from "jsonwebtoken"

const router: Router = Router();

// SIGN UP
router.post("/signup", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "User with same email already exists!" });
    }

    const hashedPassword = await bcryptjs.hash(password, 8);

    let user = new User({
      email,
      password: hashedPassword,
      name,
    });
    user = await user.save();
    res.json(user);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Sign In Route
router.post("/signin", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    console.log('user')
    console.log(user)
    if (!user) {
      return res
        .status(400)
        .json({ msg: "User with this email does not exist!" });
    }
    
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Incorrect password." });
    }

    const secret = process.env.JWT_SECRET ?? '';  
    console.log(secret)
    const token = jwt.sign({ id: user._id }, secret);
    res.json({ token, ...user?._doc });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");

    if (!token) return res.json(false);

    const secret = process.env.JWT_SECRET ?? '';  

    const verified  = jwt.verify(token, secret) as JwtPayload;
    if (!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);
    res.json(true);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/get',  function (req: Request, res: Response, next: NextFunction) {

  console.log('getter');

  // let payload = {
  //   raise_type : req.body.raise_type,
  //   name : req.body.name,
  //   user : req.payload.id,
  // };

  // let new_raise = new Raise(payload); 


});



export const AuthRoutes: Router = router;