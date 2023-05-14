import { NextFunction, Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import User from '../models/user';
import nodemailer from 'nodemailer';
import type { JwtPayload } from "jsonwebtoken"
import { authenticateToken, getTokenFromHeader } from '../utilities/authentication';
import { JWT_SECRET, SMTP_EMAIL, SMTP_PASSWORD } from '../utilities/secrets';

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

router.post("/me", authenticateToken ,async (req, res) => {
  try {
    const id =  req.user?.id;
    const user = await User.findById(id);
    const token = req.header("x-auth-token");

    const response = {
      token,
      ...user?._doc
    }

    res.json(response);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

//forgot password
router.post('/request-change-password', async function(req: Request, res: Response, next: NextFunction){
  const email = req.body.email;

  if (!email) {
    res.status(400).json({'msg' : 'Email is required.', 'is_sent': false });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(400)
      .json({ msg: "User with this email does not exist!", 'is_sent': false  });
  }

  try {

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: SMTP_EMAIL,
          pass: SMTP_PASSWORD,
        }
      });

      const security_code = String(100000 + Math.floor(Math.random() * 900000));
      user.security_code = security_code;
      await user.save();

      const mailOptions = {
        from: SMTP_EMAIL,
        to: user.email,
        subject: 'HogMaster - Security code for changing password',
        html: `Here is the security code: ${security_code}.`
      };

      transporter.sendMail(mailOptions, function(e, info){
        if (e) {
          res.status(500).json({ error: e.message, 'is_sent': false  });
        } else {
          res.json({'is_sent': true , 'msg': `A security code has been sent to ${email}.`});
        }
      });

  } catch (e: any) {
    res.status(500).json({ error: e.message , 'is_sent': false  });
  }
});
//change password

router.post('/request-update-password', async function(req: Request, res: Response, next: NextFunction){
  const email = req.body.email;
  const security_code = req.body.security_code;
  const password = req.body.password;
  const password_confirm = req.body.password_confirm;

  if (!security_code) {
    res.status(400).json({'msg' : 'Security code is required.'});
  }

  if (!email) {
    res.status(400).json({'msg' : 'Email is required.'});
  }

  if (!password) {
    res.status(400).json({'msg' : 'Password is required.'});
  }

  if (!password_confirm) {
    res.status(400).json({'msg' : 'Password confirmation is required.'});
  }

  if (password.length < 6) {
      res.status(400).json({'msg' : 'Password should be minimum of 6 characters.'});
  }

  if (password_confirm.length < 6) {
    res.status(400).json({'msg' : 'Password confirmation should be minimum of 6 characters.'});
  }

  if (password != password_confirm) {
    res.status(400).json({'msg' : 'Password did not match.'});  
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(400)
      .json({ msg: "User with this email does not exist!" });
  }

  if (user.security_code != security_code) {
    res.status(400).json({'msg' : 'Security code is invalid.'});    
  }

  try {

      user.security_code = '';
      const hashedPassword = await bcryptjs.hash(password, 8);
      user.password = hashedPassword;
      await user.save();


      res.json('Password has been successulfy update. You can now login using the new password.');
      
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/update-password', authenticateToken, async function(req: Request, res: Response, next: NextFunction){

  const old_password = req.body.old_password;
  const password = req.body.password;
  const password_confirm = req.body.password_confirm;

  if (!old_password) {
    res.status(400).json({'msg' : 'Old password is required.'});
  }

  const secret = JWT_SECRET;  
  const token = getTokenFromHeader(req);

  const verified  = jwt.verify(token, secret) as JwtPayload;

  if (!verified) return  res.status(400).json({'msg' : 'Invalid token.'});

  const user = await User.findById(verified.id);

  if (!user) {
    return res.status(400).json({'msg' : 'Invalid token.'});
  }

  const isMatch = await bcryptjs.compare(old_password, user.password);

  if (!isMatch) {
    return res.status(400).json({ msg: "Incorrect password." });
  }

  if (!password) {
    return res.status(400).json({'msg' : 'New password is required.'});
  }

  if (!password_confirm) {
    return res.status(400).json({'msg' : 'Password confirmation is required.'});
  }

  if (password.length < 6) {
    return res.status(400).json({'msg' : 'Password should be minimum of 6 characters.'});
  }

  if (password_confirm.length < 6) {
    return res.status(400).json({'msg' : 'Password confirmation should be minimum of 6 characters.'});
  }

  if (password != password_confirm) {
    return res.status(400).json({'msg' : 'Password did not match.'});  
  }

  try {

      user.security_code = '';
      const hashedPassword = await bcryptjs.hash(password, 8);
      user.password = hashedPassword;
      await user.save();

      res.json('Password has been successulfy update. You can now login using the new password.');
      
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});


router.get('/get',  function (req: Request, res: Response, next: NextFunction) {

  return res.json('accessible');
});



export const AuthRoutes: Router = router;

