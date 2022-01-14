const express = require('express');
const cors = require('cors');
const port = 8000;
app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}))
require ("../server/routes/main.routes" )(app)
app.listen(port, ()=> console.log(`Listening at port ${port}`))