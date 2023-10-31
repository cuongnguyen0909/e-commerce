const express = require('express');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8888;

//express co the doc hieu data client gui len theo kieu json
app.use(express.json())
//express co the doc hieu data client gui len theo kieu array, object, ...
app.use(express.urlencoded({ extended: true }));

app.use('/', (req, res) => {
    res.send(`Server is running on ${port}`);
})

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
})