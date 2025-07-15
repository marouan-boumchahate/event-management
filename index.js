import express from 'express';
import bodyParser from 'body-parser';
import db from './db.js';

const PORT = 8080;
const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    console.log("Everything working perfectly...");
});

app.listen(PORT, () => {
    console.log(`Server is running on the port ${PORT}`)
});
