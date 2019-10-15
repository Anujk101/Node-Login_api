const joi = require('validator');

const registerValidation = (data, ) => {
    console.log(data);

    if (!joi.isEmail(data.email)) {
        return "Enter a Valid Email Address"
    }
    else if (!joi.isNumeric(data.roll)) {
        return "Role Id Should Be Numeric"
    }
    else if (!joi.isAlpha(data.name)) {
        return "Name Should Be Only In Alphabets"
    }
    else if (joi.isEmpty(data.password)) {
        return "Password Should Not be Empty"
    }
    else {
        return false;
    }
};

const loginValidation = (data, ) => {
    console.log(data);

    if (!joi.isEmail(data.email)) {
        return "Enter a Valid Email Address"
    }
    else if (joi.isEmpty(data.password)) {
        return "Password Should Not be Empty"
    }
    else {
        return false;
    }
};

const resetValidation = (data) => {
    console.log(data);


    if (joi.isEmpty(data.password)) {
        return "Password Should Not be Empty"
    }
    else if (joi.isEmpty(data.confirm - password)) {
        return "Re-Enter the Same Password"
    }
    else if (data.password !== data.confirm - password) {
        return "Password Not Match"
    }
    else {
        return false;
    }
};

const byIdValidation = (data) => {
    console.log(data);


    if (!joi.isNumeric(data)) {
        return "Id Should Be Numeric Only"
    }
    
    else {
        return false;
    }
};


module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.resetValidation = resetValidation;
module.exports.byIdValidation = byIdValidation;
