import { User } from "../models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function signUp(req, res, next) {
  try {
    const { firstName, lastName, email, password } = req.body;
    const encryptedPassword = await bcrypt.hash(password, 10);
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(403).send({
        message: "User already exists",
      });
    }

    const user = await User.create({
      email,
      password: encryptedPassword,
      firstName,
      lastName,
    });

    const returnedUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    const token = jwt.sign(returnedUser, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    return res.status(201).json({
      message: "User created successfully",
      user: returnedUser,
      token,
    });
  } catch (err) {
    return res.status(500).json({
      message: "something went wrong",
      error: err.message,
    });
  }
}

export async function signIn(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
   
    const isPasswordsValid = await bcrypt.compare(password, user.password);
    if (!isPasswordsValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
    const returnedUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
    const token = jwt.sign(returnedUser, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    return res.status(200).json({
      message: "User logged in successfully",
      user: returnedUser,
      token,
    });
  } catch (err) {
    return res.status(500).json({
      message: "something went wrong",
      error: err.message,
    });
  }
}
