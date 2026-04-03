"use strict";
const pool = require("./dbConnection");

async function getCategories() {
    let queryText = "SELECT name FROM categories";
    let result = await pool.query(queryText);
    let categories = [];
    for (let i = 0; i < result.rows.length; i++) {
        categories.push(result.rows[i].name);
    }
    return categories;
}

async function getCategoryByName(categoryName) {
    let queryText = "SELECT id, name FROM categories WHERE name = $1";
    let values = [categoryName];
    let result = await pool.query(queryText, values);
    return result.rows[0];
}

async function getJokesByCategory(categoryId, limit) {
    let queryText = "SELECT setup, delivery FROM jokes WHERE category_id = $1";
    let values = [categoryId];
    if (limit) {
        queryText += " LIMIT $2";
        values.push(limit);
    }
    let result = await pool.query(queryText, values);
    return result.rows;
}

async function getRandomJoke() {
    let queryText = "SELECT setup, delivery FROM jokes ORDER BY RANDOM() LIMIT 1";
    let result = await pool.query(queryText);
    return result.rows[0];
}

async function addJoke(category_id, setup, delivery) {
    let queryText = "INSERT INTO jokes (category_id, setup, delivery) VALUES ($1, $2, $3) RETURNING *";
    let values = [category_id, setup, delivery];
    let result = await pool.query(queryText, values);
    return result.rows[0];
}

module.exports = {
    getCategories,
    getCategoryByName,
    getJokesByCategory,
    getRandomJoke,
    addJoke
};