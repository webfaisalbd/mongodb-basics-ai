const express = require('express');
const mongoose = require('mongoose');

const app = express();

const PORT = 3246;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

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
    createdAt: {
        type: Date,
        default: Date.now
    }
})
// create product model 
const Product = mongoose.model("products", productsSchema);


const connectDB = async () => {
    await mongoose.connect('mongodb://localhost:27017/testCustomers')
        .then(() => console.log('mongodb is connected')
        )
        .catch(() => {
            console.log("mongodb is not connected");
            console.log(error);
        })
}

app.get('/', (req, res) => {
    res.send("Get All the products.")
})

app.post('/products', async (req, res) => {
    try {
        // get data form request body
        const title = req.body.title;
        const price = req.body.price;
        const description = req.body.description;

        // const newProduct = new Product({
        //     title: title,
        //     price: price,
        //     description: description
        // });

        // const productData = await newProduct.save();

        const productData = await Product.insertMany([
            {
                title: "iphone 5",
                price: 550,
                description: "this is iphone 5"
            },
            {
                title: "iphone 6",
                price: 660,
                description: "this is iphone 6"
            }
        ])

        // const newProduct = new Product({
        //     title: req.body.title,
        //     price: req.body.price,
        //     description: req.body.description,
        // });

        res.status(201).send(productData)
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

app.listen(PORT, async () => {
    console.log(`server is running at http://localhost:${PORT}`);
    await connectDB();
})