const { Router } = require("express");
const router = Router();

router.use("/login", require('./users'));
router.use("/items", require('./items'));
router.use("/orders", require('./orders'));

module.exports = router;