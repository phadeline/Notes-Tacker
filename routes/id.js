const express = require("express");
const router = express.Router();
const fs = require("fs");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));



router.delete("/", (req, res) => {
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
          res.status(200).json(parsedData);
        } else {
          res.status(400).json(`${req.params.id} was not found in the data`);
        }
      }
    }
  });
});

module.exports = router;
