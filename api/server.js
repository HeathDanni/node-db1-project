const express = require("express");

const db = require("../data/dbConfig.js");

const server = express();

server.use(express.json());

server.get("/accounts", async (req, res, next) => {
    try {
        const accounts = await db.select("*").from("accounts")
        res.json(accounts)
    } catch (err) {
        next(err)
    }
})

server.get("/accounts/:id", async (req, res, next) => {
    try {
        const account = await db.select("*")
                            .from("accounts")
                            .where("id", req.params.id)
                            .limit(1)
        res.json(account)
    } catch (err) {
        next(err)
    }
})

server.post("/accounts", async (req, res, next) => {
    try {
        const payload = {
            name: req.body.name,
            budget: req.body.budget
        }

        const [id] = await db.insert(payload)
                        .into("accounts")
        const account = await db("accounts")
                            .first()
                            .where("id", id)
        res.status(201).json(account)
    } catch (err) {
        next(err)
    }
})

server.put("/accounts/:id", async (req, res, next) => {
    try {
        const payload = {
            name: req.body.name,
            budget: req.body.budget
        }
        await db("accounts")
            .where("id", req.params.id)
            .update(payload)

        const account = await db("accounts").where("id", req.params.id).first()
        res.json(account)

    } catch (err) {
        next(err)
    }
})

server.delete("/accounts/:id", async (req, res, next) => {
    try {
        await db("accounts").where("id", req.params.id).del()
        res.status(204).end()
    } catch (err) {
        next(err)
    }
})

module.exports = server;
