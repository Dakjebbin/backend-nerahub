import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
  try {
    const registerData = req.body;
    const { myname, email, username, password } = registerData;

    if (!myname || !email || !username || !password) {
      res.status(400).json({
        success: false,
        message: "All fields required",
      });
      return;
    }

    //check if email exists 
    const emailExists = await User.findOne({email}).exec();
   
    if (emailExists) {
      res.status(409).json({
        success:false,
        message: "Email Already Exists"
      })
    }

    //check if username exists
    const userExists = await User.findOne({username}).exec();
  
    if (userExists) {
      res.status(409).json({
        success:false,
        message: "user Already Exists"
      })
    }
    
    const salt = await bcrypt.genSalt(13)
    const encryptedPassword = await bcrypt.hash(password, salt)

    // using the mongodb model to create a user
    const newUser = await User.create({
      name: myname,
      email,
      username,
      password: encryptedPassword,
    });

    if (newUser) {
      res.status(201).json({
        success: true,
        message: "user registered",
        user: newUser,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "user not registered",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const login = async (req, res) => {
  const body = req.body

  if (!body.email || !body.password) {
    res.status(400).json({
      success: false,
      message: "All fields required",
    });
    return;
  }

  const userExists =  await User.findOne({email: body.email}).exec();

  if(!userExists) {
    res.status(404).json({
      success:false,
      message: "invalid Credentials"
    });

    return;
  }

  const validPassword = await bcrypt.compare(body.password, userExists?.password)
  
  if(!validPassword) {
    res.status(409).json({
      success:false,
      message: "invalid Credentials"
    });
    return;
  }

  //creating token for authentication
  const accessToken = jwt.sign({
    jesus: userExists?._id,
  },
    process.env.JWT_SECRET,
    {
        expiresIn: process.env.accessTime
    }
);

//creating refreshtoken for authentication
const refreshToken = jwt.sign({
  myjesus: userExists?._id,
},
  process.env.bobo,
  {
      expiresIn: process.env.refreshTime
  }
);

//the cookies for authentication
res.cookie("access_token", accessToken, {
  httpOnly: true,
  secure: true,
  sameSite:"none",
  maxAge: 30 * 1000,
});

res.cookie("refresh_token", refreshToken, {
  httpOnly: true,
  secure: true,
  sameSite:"none",
  maxAge: 1 * 24 * 60 * 60 * 1000,
});

res.status(200).json({
  success:true,
  message: "Login Successful",
  // loginToken: {accessToken, refreshToken}
})


};

export { register, login };
