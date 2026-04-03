"use strict";

const express = require("express");
const controller = require("../controllers/jokebookController");

const router = express.Router();

router.get("/categories", controller.fetchCategories);
router.get("/category/:category", controller.fetchCategoryJokes);
router.get("/random", controller.fetchRandomJoke);
router.post("/add", controller.createJoke);

module.exports = router;