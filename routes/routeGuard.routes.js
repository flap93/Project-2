const express = require("express");
const router = express.Router();

const routeGuard = require("../configs/route-guard.config");

// router.get("/example/secret-page", routeGuard, (req, res, next) => {
//   res.render("secret.hbs");
// });

module.exports = router;