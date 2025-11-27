import express from "express";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";
import { readDB, writeDB } from "../../utils/helper.js";
import { mails, otpgenerator } from "../../utils/mailer.js";
import { encrypt } from "../../utils/token.js";
import { registerValidation,loginValidation,errorValidation  } from "../../validators/validate.js";

const router = express.Router();

// name, email, phone, pass - user entered
// id, timestamp, task[] - automatic

router.post("/register",registerValidation,errorValidation, async (req, res) => {
  try {
    let DB = await readDB();
    let { name, email, age, phone, password } = req.body;
    let duplicate = DB.find((x) => x.email === email);
    if (duplicate) {
      return res
        .status(400)
        .json({ msg: "The user is already registered! Please login." });
    }
    let ageValidity = age < 18;
    if (ageValidity) {
      return res.status(400).json({
        msg: "You are under-age. Users of only age greater than 18 can register.",
      });
    }
    let OTP = otpgenerator();
    let newData = {
      id: uuid(),
      name,
      age,
      email,
      phone,
      password: await bcrypt.hash(password, 10),
      isVerified: false,
      OTP,
      task: [],
      accountCreatedAt: new Date().toISOString(),
    };
    DB.push(newData);
    await writeDB(DB);
    await mails(name, email, OTP);

    res.status(201).json({ msg: "User registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(401).json({ msg: "Bad Request" });
  }
});

router.post("/login", async (req, res) => {
  try {
    let DB = await readDB();
    let email = req.body.email;
    let user = DB.find((x) => x.email === email);
    if (!user) {
      return res.status(404).json({ msg: "User not found!" });
    }
    if(!user.isVerified)
    {
      return res.status(400).json({msg: "You are not verified. Please verify your account!"});
    }
    if (await bcrypt.compare(req.body.password, user.password)) {
      let sessionKey = await encrypt(user);
      return res
        .status(200)
        .json({ msg: "Logged in successfully", sessionKey: sessionKey });
    }
    res.status(401).json({ msg: "Password is invalid!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

//validating otp
router.post("/validateotp", async (req, res) => {
  try {
    let DB = await readDB();
    let user = DB.find((x) => x.email == req.body.email);
    if (!user) {
      return res
        .status(400)
        .json({ msg: "User not found. Please register first" });
    }
    if (req.body.otp != user.OTP) {
      return res
        .status(401)
        .json({ msg: "Invalid OTP. Please enter correct OTP" });
    }
    user.isVerified = true;
    delete user.OTP;
    await writeDB(DB);
    res.status(200).json({ msg: "Successfully verified. You can now login!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

export default router;