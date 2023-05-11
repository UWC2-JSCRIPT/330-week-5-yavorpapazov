const { Router } = require("express");
const router = Router();

router.use("/login", require('./users'));
router.use("/items", require('./items'));

module.exports = router;