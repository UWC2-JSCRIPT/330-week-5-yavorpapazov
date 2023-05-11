const { Router } = require("express");
const router = Router();
const jwt = require('jsonwebtoken');
const itemDAO = require('../daos/item');

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

router.get("/:id", async (req, res, next) => {
    try {
        const item = await itemDAO.getById(req.params.id);
        res.json(item);
    } catch(e) {
        res.status(500).send(e.message);
    }
});

router.get("/", async (req, res, next) => {
    try {
        const items = await itemDAO.getAll();
        res.json(items);
    } catch(e) {
        res.status(500).send(e.message);
    }
});

router.use(function (req, res, next) {
    if (req.userData.roles.includes('admin')) {
        next();
    } else {
        res.sendStatus(403);
    }
});

router.post("/", async (req, res, next) => {
    try {
        const savedItem = await itemDAO.createItem(req.body);
        res.json(savedItem);
    } catch(e) {
        res.status(401).send(e.message);
    }
});

router.put("/:id", async (req, res, next) => {
    try {
        const success = await itemDAO.updateById(req.params.id, req.body);
        res.sendStatus(success ? 200 : 400);
    } catch(e) {
        res.status(500).send(e.message);
    }
});

module.exports = router;