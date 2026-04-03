"use strict";

(function () {

    window.addEventListener("load", init);

    function init() {
        id("load-categories").addEventListener("click", loadCategories);

        id("category-form").addEventListener("submit", function (e) {
            e.preventDefault();
            let category = id("category-search").value.trim();
            loadCategory(category);
        });

        id("new-joke-form").addEventListener("submit", function (e) {
            e.preventDefault();
            submitNewJoke();
        });

        loadRandomJoke();
    }

    function loadRandomJoke() {
        fetch("/jokebook/random")
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                }
            })
            .then(function (joke) {
                id("random-joke").innerHTML = "<p><strong>Setup:</strong> " + joke.setup + "</p>"
                    + "<p><strong>Delivery:</strong> " + joke.delivery + "</p>";
            })
            .catch(alert);
    }

    function loadCategories() {
        fetch("/jokebook/categories")
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                }
            })
            .then(function (categories) {
                let container = id("categories");
                container.innerHTML = "";
                for (let i = 0; i < categories.length; i++) {
                    let button = document.createElement("button");
                    button.type = "button";
                    button.textContent = categories[i];
                    button.addEventListener("click", function () {
                        id("category-search").value = categories[i];
                        loadCategory(categories[i]);
                    });
                    container.appendChild(button);
                }
            })
            .catch(alert);
    }

    function loadCategory(category) {
        if (!category) {
            showStatus("Provide a category name", true);
            return;
        }
        fetch("/jokebook/category/" + category)
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                }
            })
            .then(function (jokes) {
                showStatus("Showing jokes for '" + category + "'.", false);
                renderJokes(jokes || []);
            })
            .catch(alert);
    }

    function submitNewJoke() {
        let params = new FormData(id("new-joke-form"));
        let jsonBody = JSON.stringify(Object.fromEntries(params));
        fetch("/jokebook/add", {
            method: "POST",
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json",
            },
            body: jsonBody,
        })
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                }
            })
            .then(function (jokes) {
                let category = id("new-joke-form").querySelector("[name='category']").value.trim();
                id("new-joke-form").reset();
                showStatus("Joke added to '" + category + "'.", false);
                renderJokes(jokes);
            })
            .catch(alert);
    }

    function renderJokes(jokes) {
        let container = id("joke-results");
        if (!jokes.length) {
            container.innerHTML = "<p>No jokes found.</p>";
            return;
        }
        let html = "";
        for (let i = 0; i < jokes.length; i++) {
            html += "<article class='joke-card'>"
                + "<p><strong>Setup:</strong> " + jokes[i].setup + "</p>"
                + "<p><strong>Delivery:</strong> " + jokes[i].delivery + "</p>"
                + "</article>";
        }
        container.innerHTML = html;
    }

    function showStatus(message, isError) {
        let statusEl = id("status-message");
        statusEl.textContent = message;
        statusEl.className = isError ? "status-message error" : "status-message success";
    }

    function id(idName) {
        return document.getElementById(idName);
    }

})();