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
        const items = req.body
        for(let i of items) {
            let item = await orderDAO.getItemById(i);
            if (!item) {
                return res.sendStatus(400);
            }
            total = total + item.price;
        }
        const orderData = {
            userId: req.userData._id,
            items: items,
            total: total
        }
        const savedOrder = await orderDAO.createOrder(orderData);
        res.json(savedOrder);
    } catch(e) {
        res.status(500).send(e.message);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        const order = await orderDAO.getOrderById(req.params.id);
        if (!order) {
            res.sendStatus(400);
        } else if (req.userData.roles.includes('admin')) {
            res.json(order);
        } else if (!req.userData.roles.includes('admin') && req.userData._id === order.userId.toString()) {
            res.json(order);
        } else {
            res.sendStatus(404);
        }
    } catch(e) {
        res.status(500).send(e.message);
    }
});

router.get("/", async (req, res, next) => {
    try {
        if (!req.userData.roles.includes('admin')) {
            const orders = await orderDAO.getAllByUserId(req.userData._id);
            const ordersNew = orders.map(item => {
                const itemsNew = item.items.map(element => element.toString());
                return {
                    items: itemsNew,
                    userId: item.userId.toString(),
                    total: item.total
                }
            })
            res.json(ordersNew);
        } else {
            const orders = await orderDAO.getAll();
            const ordersNew = orders.map(item => {
                const itemsNew = item.items.map(element => element.toString());
                return {
                    items: itemsNew,
                    userId: item.userId.toString(),
                    total: item.total
                }
            })
            res.json(ordersNew);
        }
    } catch(e) {
        res.status(500).send(e.message);
    }
});

module.exports = router;