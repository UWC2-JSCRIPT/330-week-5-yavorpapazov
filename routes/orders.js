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
        console.log(req.body._id)
        console.log(req.userData)
        let item = await orderDAO.getById(req.body._id);
        console.log(item)
        let order = {
            userId: req.userData._id,
            items: [req.body._id],
            total: item.price
        }
        console.log(order)
        const savedOrder = await orderDAO.createItem(order);
        res.json(savedOrder);
    } catch(e) {
        res.status(401).send(e.message);
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