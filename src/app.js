const express = require('express');
require('dotenv').config(); // load environment variables from .env file

const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});