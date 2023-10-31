const express = require('express');
require('dotenv').config();
const dbConnect = require('./config/dbConnect');
const initRoutes = require('./routes');



const app = express();
const port = process.env.PORT || 8888;

//express co the doc hieu data client gui len theo kieu json
app.use(express.json())
//express co the doc hieu data client gui len theo kieu array, object, ...
app.use(express.urlencoded({ extended: true }));

//connect to DB
dbConnect();

//su dung api
initRoutes(app);



app.listen(port, () => {
    console.log(`Server is running on ${port}`);
})