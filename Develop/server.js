const express = require("express");
const path = require("path");
const fs = require("fs");
const uuid = require("uuid");

const app = express();
const PORT = process.env.PORT || 3001;

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

app.delete("/api/notes/:id", (req, res) => {
  fs.readFile(`./db/db.json`, `utf-8`, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      //turns data into an object
      parsedData = JSON.parse(data);
      console.log(typeof parsedData);

      //finds the note that matches the one the user wants to delete
      for (let i = 0; i < parsedData.length; i++) {
        //matches the id in the parameter with the id of the data
        if (parsedData[i].id === req.params.id) {
          console.log(parsedData[i].id);
          const index = parsedData.indexOf(parsedData[i]);
          console.log(index);

          newData = parsedData.splice(index, 1);

          fs.writeFile(`./db/db.json`, JSON.stringify(parsedData), (err) =>
            err ? console.err(err) : console.info("notes have been updated!")
          );
        } else {
          res.status(400).json(`${req.params.id} was not found in the data`);
        }
      }
    }
  });
});

app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "public/index.html"))
);

//

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
