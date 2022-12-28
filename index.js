const express = require('express');

const app = express();

const PORT = 4537;

app.get('/', (req,res)=> {
    res.send("<h2>Welcome to local host</h2>");
})

app.listen(PORT, ()=> {
    console.log(`Server is running at http://localhost:${PORT}`);
})