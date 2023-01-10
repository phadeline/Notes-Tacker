const express = require("express");
const app = express()

const notesRouter = require("./notes")
const idRouter = require("./id")

app.use("/notes", notesRouter );
// app.use("/notes/:id", idRouter);

module.exports = app;