const express = require("express");
const { login, getPurchases, buyCourse } = require("../Controllers/UserContoller");
const router = express.Router();

router.post("/login", login);
router.get("/:email/purchases", getPurchases);
router.post("/:email/buy", buyCourse);

module.exports = router;
