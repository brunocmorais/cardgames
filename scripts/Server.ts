import express from 'express';

const app = express();
app.use(express.static('.'));

const port = 3000;
app.listen(port);
console.log("Running on http://localhost:" + port);