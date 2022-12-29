const express = require('express');
const mongoose = require('mongoose');

const app = express();

const PORT = 3246;

// mongoose.connect('mongodb://localhost:27017/testCustomers')
//     .then(() => console.log('mongodb is connected')
//     )
//     .catch(() => {
//         console.log("mongodb is not connected");
//         console.log(error);
//     })


// create product schema 
const productsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: Number,
    description: String,
    createdAt : {
        type: Date,
        default: Date.now
    }
})

const Product = mongoose.model("products", productsSchema);

const mongoDB = async () => {
    await mongoose.connect('mongodb://localhost:27017/testCustomers')
        .then(() => console.log('mongodb is connected')
        )
        .catch(() => {
            console.log("mongodb is not connected");
            console.log(error);
        })
}

app.get('/', (req, res) => {
    res.send("<h2>Get All the data</h2>")
})

app.listen(PORT, async () => {
    console.log(`server is running at http://localhost:${PORT}`);
    await mongoDB();
})