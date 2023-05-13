const { Router } = require("express");
const router = Router();
const jwt = require('jsonwebtoken');
const orderDAO = require('../daos/order');

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

router.post("/", async (req, res, next) => {
    try {
        let total = 0;
        let repeatObj = {};
        for(let i of req.body.items) {
            let item = await orderDAO.getItemById(i);
            if (!item) {
                res.sendStatus(400);
            }
            if (i in repeatObj) {
                repeatObj[i] = repeatObj[i] + 1;
            } else {
                repeatObj[i] = 1;
            }
            total = total + item.price;
        }
        const repeated = Object.values(repeatObj).some(item => item > 1);
        if (repeated && req.userData.roles.includes('admin')) {
            const orderData = {
                userId: req.userData._id,
                items: req.body.items,
                total: total
            }
            const savedOrder = await orderDAO.createOrder(orderData);
            res.json(savedOrder);
        } else if (!repeated && !req.userData.roles.includes('admin')) {
            const orderData = {
                userId: req.userData._id,
                items: req.body.items,
                total: total
            }
            const savedOrder = await orderDAO.createOrder(orderData);
            res.json(savedOrder);
        } else {
            res.sendStatus(403);
        }
    } catch(e) {
        res.status(500).send(e.message);
    }
});

// router.use(function (req, res, next) {
//     if (req.userData.roles.includes('admin')) {
//         next();
//     } else {
//         res.sendStatus(403);
//     }
// });

// router.get("/:id", async (req, res, next) => {
//     try {
//         const item = await itemDAO.getById(req.params.id);
//         res.json(item);
//     } catch(e) {
//         res.status(500).send(e.message);
//     }
// });

// router.get("/", async (req, res, next) => {
//     try {
//         const items = await itemDAO.getAll();
//         res.json(items);
//     } catch(e) {
//         res.status(500).send(e.message);
//     }
// });

module.exports = router;