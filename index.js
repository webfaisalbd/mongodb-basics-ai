const express = require('express');
const mongoose = require('mongoose');

const app = express();

const PORT = 4537;

// mongoose.connect('mongodb://localhost:27017/testProductDB')
// .then(()=> console.log("MongoDb is connected."))
// .catch((error)=> {
//     console.log("MongoDb is not connected.");
//     console.log(error);
//     process.exit(1)
// } )

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/testProductDB')
        console.log("db is connected.")
    } catch (error) {
        console.log('db is not connected');
        console.log(error);
        process.exit(1);
    }
}


app.get('/', (req, res) => {
    res.send("<h2>Welcome to local host</h2>");
})

app.listen(PORT, async () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    await connectDB();
})