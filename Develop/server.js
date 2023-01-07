const express = require("express");
const path = require("path");
const fs = require("fs");
const uuid = require("uuid");
const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "public/notes.html"))
);

app.get("/api/notes", (req, res) => {
  fs.readFile(`./db/db.json`, `utf-8`, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.send(data);
      console.info(`${req.method} request received to get notes`);
    }
  });
});

app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;
  const uuid4 = uuid.v4();
  if (title && text) {
    const newNote = {
      id: uuid4,
      title,
      text,
    };

    //get the existing data
    fs.readFile(`./db/db.json`, `utf-8`, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        parsedNotes = JSON.parse(data);

        //add a new note to the parsed data
        parsedNotes.push(newNote);

        //add old notes and new note to db.json file
        fs.writeFile(`./db/db.json`, JSON.stringify(parsedNotes), (err) =>
          err
            ? console.err(err)
            : console.info("all notes added successfully to file!")
        );
      }
    });
    const response = {
      status: "success",
      body: newNote,
    };
    console.log(response);
    res.status(200).json(response);
  } else {
    res.status(500).json("Error in posting review");
  }
});

app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "public/index.html"))
);

//


app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
