"use strict";
const model = require("../models/jokebookModel");

async function fetchCategories(req, res) {
    try {
        const categories = await model.getCategories();
        res.json(categories);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
}

async function fetchCategoryJokes(req, res) {
    const category = req.params.category;
    const limitParam = req.query.limit;
    if (category) {
        try {
            const validCategory = await model.getCategoryByName(category);
            if (!validCategory) {
                return res.status(404).send("Category '" + category + "' does not exist in the jokebook");
            }
            let parsedLimit;
            if (limitParam !== undefined) {
                parsedLimit = parseInt(limitParam, 10);
            }
<<<<<<< HEAD
            const jokes = await model.getJokesByCategory(validCategory.id, parsedLimit);
=======
            const jokes = await model.getJokesByCategory(category, parsedLimit);
>>>>>>> bfc018d (Feat: implemented assignment specifications)
            res.json(jokes);
        } catch (err) {
            console.error(err);
            res.status(500).send("Server error");
        }
    } else {
        res.status(400).send("Missing required category param!");
    }
}

async function fetchRandomJoke(req, res) {
    try {
        const joke = await model.getRandomJoke();
        res.json(joke);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
}

async function createJoke(req, res) {
    const { category, setup, delivery } = req.body;
    if (category && setup && delivery) {
        try {
            const validCategory = await model.getCategoryByName(category);
            if (!validCategory) {
                return res.status(404).send("Category '" + category + "' does not exist in the jokebook");
            }
            await model.addJoke(validCategory.id, setup, delivery);
<<<<<<< HEAD
            const jokes = await model.getJokesByCategory(validCategory.id);
=======
            const jokes = await model.getJokesByCategory(category);
>>>>>>> bfc018d (Feat: implemented assignment specifications)
            res.status(201).json(jokes);
        } catch (err) {
            console.error(err);
            res.status(500).send("Server error");
        }
    } else {
        res.status(400).send("Missing required joke fields!");
    }
}

module.exports = {
    fetchCategories,
    fetchCategoryJokes,
    fetchRandomJoke,
    createJoke
};