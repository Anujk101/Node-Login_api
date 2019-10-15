const express = require('express');
const User = require('./models/Managers');
const jwt = require('jsonwebtoken');
const verify = require('./middleware/authenticate');
const { registerValidation , loginValidation , resetValidation ,byIdValidation} = require('./middleware/Validatons');
const hp = require('./helper');
const { mailer } = require('./middleware/mailer');

var app = express();
var users = User.user();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());



const port = 1001;

app.post('/login', (req, res) => {
    console.log(req.body);
    //const error = loginValidation(req.body);
    //if(error) return res.send(error).status(400);
    //else{
    users.findOne({
        where: {
            email: req.body.email,
            password: req.body.password,

        },
    })
        .then(data => {
            if (data) {
                console.log(data.type);

                const token = jwt.sign({ _roll_id: data.roll_id, _id: data.id }, 'secret', { expiresIn: '600s' })
                res.header('auth-token', token).send(token);
                console.log(token);
            }
            else {
                res.sendStatus(403)
            }
        })
        .catch(err => {
            console.error("unable to connect " + err);
            res.sendStatus(500);
        })
    //}

})

app.post('/register', verify, (req, res) => {
    const error = registerValidation(req.body);


    if (error) { return res.status(400).send(error) }
    else {
        try {
            if (req.user._roll_id === hp.superAdmin) {
                if (req.body.roll === hp.Admin) {
                    users.create({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password,
                        roll_id: req.body.roll,
                        created_by: req.user._id
                    })
                        .then(() => {
                            res.send("Admin Registered");
                        })
                        .catch(error => {
                            res.send(error.errors[0].message).status(403)
                        })

                }
                else {
                    res.status(400).send("superAdmin Are Not Allow to Registor User");
                }

            }
            else if (req.user._roll_id === hp.Admin) {
                if (req.body.roll === hp.User) {
                    users.create({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password,
                        roll_id: req.body.roll,
                        created_by: req.user._id
                    })
                        .then(() => {
                            res.status(200).send("User  Registerd");
                        })
                        .catch(error => {
                            res.send(error[0]).status(403)
                        })

                }
                else {
                    res.status(403).send("Admin  Are Allowed to Register User only!!");
                }

            }
        } catch (error) {
            res.send(error[0]).status(400)
        }
    }

})

app.get('/get-users', verify, (req, res) => {
    if (req.user._roll_id === hp.Admin) {
        users.findAll({
            email, name, roll_id, id,
            where: {
                roll_id: hp.User
            }, attributes: ['id', 'name', 'email', 'roll_id', 'created_by'],
        })
            .then(data => {
                if (data) {
                    res.send(data).status(200)
                }
                else {
                    res.send("No User Found").status(200);
                }
            })
    }
    else {
        res.send("You Dont Have Access to this Page !!!").status(403);
    }

})

app.get('/get-admins', verify, (req, res) => {
    if (req.user._roll_id === hp.superAdmin) {
        users.findAll({
            where: {
                roll_id: 2
            }, attributes: ['id', 'name', 'email', 'roll_id', 'created_by'],
        })
            .then(data => {
                if (data) {
                    res.status(200).send(data);
                }
                else {
                    res.send("No Admin Found").status(200)
                }
            })
    }
    else {
        res.send("You Dont Have Access to this Page !!!").status(403);
    }
})

app.get('/get-userby-admin', verify, (req, res) => {
    if (req.user._roll_id === hp.superAdmin) {
        const error = byIdValidation(req.query.id);
        if(error) return res.send(error).status(400);
        else{
        users.findAll({
            where: {
                created_by: req.query.id
            },
        })
            .then(data => {


                if (data) {
                    return res.status(200).send(data);
                }
                else {
                    return res.status(400).send("Admin Not Found by this ID")
                }
            })
        }


    }
    else {
        res.status(400);
    }



})

app.post('/reset-password', verify, (req, res) => {
    
    if (req.user._roll_id === hp.superAdmin || req.user._roll_id === hp.Admin || req.user._roll_id === hp.User) {
        const error = resetValidation(req.body);
        if(error) return res.send(error).status(400)
        else{
        try {
            users.update({ password: req.body.password }, { where: { id: req.user._id }, })
                .then(data => {
                    res.send("Password Updated").status(200);
                })
                .catch(error => {
                    console.log(error);

                    res.send("something Went Wrong").status(400);
                })
        } catch (error) {
            res.send(error.name).status(403);

        }
    }
    }
    else {
        res.send("You dont have Access To this Page !!!")
    }
})

app.post('/forgot-password', (req, res) => {
    const code = mailer(req.body);


    res.status(code)

})



app.listen(port, console.log("Server is running on :" + port));