const express = require('express');
const mongoose = require('mongoose');

const app = express();

const PORT = 4000;

const mongodbConnect = () => {
    mongoose.connect('mongodb://127.0.0.1:27017/schoolManagementSystem')
        .then(() => console.log("mongodb is connected."))
        .catch(error => {
            console.log(error);
            console.log("mongodb is not connected.")
        })
}


// make schema

// make model 

// get 
app.get('/', (req,res)=> {
    res.send('Welcome to localhost.')
})

app.listen(PORT, async () => {
    console.log(`The server is running at http://localhost:${PORT}`);
    await mongodbConnect();
})
