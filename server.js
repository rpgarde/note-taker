const express = require('express');
const fs = require('fs');

const PORT = process.env.PORT || 3001;
const app = express();
const path = require('path')
const uuid = require('./helpers/uuid');

app.use(express.static('public'));

app.get('/', (req, res) => res.send('Click to get started'));

//middleware to parse json 
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/notes',(req,res)=>{
    res.sendFile(path.join(__dirname, 'public/notes.html'))
})

// Get reads database file
app.get('/api/notes',(req,res)=>{
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      // Convert string into JSON object
      const parsedNotes = JSON.parse(data);
      // parsed notes is the response
      res.json(parsedNotes)
    }
  });
})

// Post takes current note and adds it to the database file
app.post('/api/notes',(req,res)=>{
  // desructure body 
  const { title, text } = req.body;
  // use UUID helper to create ID
  const newNote = {title, text, id:uuid()};
  res.json(newNote);

  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      // Convert string into JSON object
      const parsedNotes = JSON.parse(data);
      // Add a new note
      parsedNotes.push(newNote);
      // Write updated reviews back to the file
      fs.writeFile(
        './db/db.json',
        JSON.stringify(parsedNotes),
        (writeErr) =>
          writeErr
            ? console.error(writeErr)
            : console.info('Successfully updated notes!')
      );
    }
  });
})

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);