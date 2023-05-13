const { Router } = require("express");
const router = Router();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const userDAO = require('../daos/user');

router.post("/signup", async (req, res, next) => {
    if (!req.body.password || JSON.stringify(req.body.password) === '' ) {
        res.status(400).send('password is required');
    } else {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const user = {
                email: req.body.email,
                password: hashedPassword,
                roles: ['user']
            };
            const savedUser = await userDAO.createUser(user, user.email);
            if (savedUser === 'exists') {
                res.status(409).send('email already exists');
            } else {
                res.json(savedUser);
            }
        } catch(e) {
            res.status(500).send(e.message);
        }
    }
});

router.post("/", async (req, res, next) => {
    if (!req.body.password || JSON.stringify(req.body.password) === '' ) {
        res.status(400).send('password is required');
    } else {
        try {
            const userData = await userDAO.getUser(req.body.email);
            const result = await bcrypt.compare(req.body.password, userData.password);
            if (!result) {
                res.status(401).send("password doesn't match");
            } else {
                const user = {
                    _id: userData._id.toString(),
                    email: userData.email,
                    roles: userData.roles
                }
                const secret = "secret123";
                const token = jwt.sign(user, secret);
                res.json({ token: token });
            }
        } catch(e) {
            res.status(401).send(e.message);
        }
    }
});

router.post("/logout", async (req, res, next) => {
    res.sendStatus(404);
});

router.use(function (req, res, next) {
    if (!req.headers.authorization) {
        res.sendStatus(401);
    } else {
        const tokenString = req.headers.authorization.slice(7);
        const secret = "secret123";
        if (tokenString) {
            jwt.verify(tokenString, secret, (err, userData) => {
                if (err) {
                    res.sendStatus(401);
                } else {
                    req.userData = userData;
                    next();
                }
            });
        } else {
            res.sendStatus(401);
        }
    }
});

router.post("/password", async (req, res, next) => {
    if (!req.body.password || JSON.stringify(req.body.password) === '' ) {
        res.status(400).send('password is required');
    } else {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const success = await userDAO.updateUserPassword(req.userData._id, hashedPassword);
            res.sendStatus(success ? 200 : 401);
        } catch(e) {
            res.status(500).send(e.message);
        }
    }
});

module.exports = router;