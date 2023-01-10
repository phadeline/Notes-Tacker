const express = require("express");
const router = express.Router();
const fs = require("fs");
const uuid = require("uuid");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/", (req, res) => {
  fs.readFile(`./db/db.json`, `utf-8`, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.send(data);
      console.info(`${req.method} request received to get notes`);
    }
  });
});

router.post("/", (req, res) => {
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

router.delete("/:id", (req, res) => {
  console.log(req.params.id);
  fs.readFile(`./db/db.json`, `utf-8`, (err, data) => {
    if (err) {
      console.log(err);
      return;
    } else {
      //turns data into an object
      parsedData = JSON.parse(data);
      console.log(parsedData);
      const foundData = parsedData.findIndex(
        (data) => data.id == req.params.id
      );
      if (foundData === -1) {
        res.status(400).json(`${req.params.id} was not found in the data`);
        return;
      } else {
        parsedData.splice(foundData, 1);

        fs.writeFile(`./db/db.json`, JSON.stringify(parsedData), (err) =>
          err ? console.err(err) : console.info("notes have been updated!")
        );
        res.status(200).json(parsedData);
        return;
      }

      //finds the note that matches the one the user wants to delete
    }
  });
});

module.exports = router;
