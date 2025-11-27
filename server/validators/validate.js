import {error} from "console"
import {body, validationResult } from "express-validator"

// body ==> req.body;

// Each api has a validation array of all fields 

// Regsiter Validation
// fullName
// age
// email
/// phone
// password

const registerValidation =[
    body("fullname")
        .trim()
        .notEmpty().withMessage("name is required")
        .isLength({min: 3, max: 25}).withMessage("message is 25 limit or min is 3"),
    body("age")
        .trim()
        .notEmpty().withMessage("please add age")
        .isInt({min: 18, max:100}).withMessage("max is 100"),
    body("email")
        .trim()
        .notEmpty().withMessage("please add email")
        .isEmail().withMessage("write valid email"),
    body("password")
        .trim()
        .notEmpty().withMessage("add strong password")
]

const loginValidation = [
    body("email")
        .trim()
        .notEmpty().withMessage("please add email")
        .isEmail().withMessage("write valid email"),
    body("password")
        .trim()
        .notEmpty().withMessage("add strong password")
        
]

function errorValidation(req,res,nest){
    const errors = validationResult(req)
    if(!error.isEmpty())
        return res.status(400).json({
    error: error.array()
})
next()
}

export {registerValidation,loginValidation,errorValidation}