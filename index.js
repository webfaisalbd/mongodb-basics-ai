const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 4000;

// product schema 
const productsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "title must be provided"],
        minlength: [3, "minimum length should be 3"],
        maxlength: [30, "maximum length should be 10"],
        trim: true,
        unique: true,
        index: true
    },
    price: {
        type: Number,
        required: [true, "price must be provided"],
        min: [100, "price must at least 100 euro"],
        max: 10000
    },
    description: String,
    rating: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
})
// product model 
const Product = mongoose.model("Products", productsSchema)

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/school')
        console.log("mongodb is connected");
    } catch (error) {
        console.log("mongodb is not connected");
        console.log(error.message);
        process.exit(1);
    }
}


app.get('/', (req, res) => {
    res.send("Welcome to localhost");
})

// app.get('/products', async (req, res) => {
//     try {
//         const price = req.query.price;
//         if (price) {
//             const products = await Product.find({ price: { $lt: price } });
//         }
//         else {
//             const products = await Product.find();
//         }
//         if (products) {
//             res.status(200).send(products);
//         }
//         else {
//             res.status(404).send({ message: "products not found" });
//         }

//     } catch (error) {
//         res.status(500).send({ message: error.message })
//     }
// })

app.get('/products', async (req, res) => {

    try {
        const price = req.query.price;

        let products;

        if (price) {
            products = await Product.find({ price: { $gt: price } }).sort({ price: -1 });
        }
        else {
            products = await Product.find();
        }

        if (products) {
            res.status(200).send({
                success: true,
                data: products
            });
        }
        else {
            res.status(404).send("products not found");
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }


})

app.get('/products/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findOne({ _id: id }).select({
            _id: 0,
            title: 1
        });
        if (product) {
            res.status(200).send(product);
        }
        else {
            res.status(404).send({ message: "specific product not found" });
        }

    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

// delete 
app.delete('/products/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.deleteOne({ _id: id })
        // const product = await Product.findByIdAndDelete({ _id: id })
        if (product) {
            res.status(200).send(product);
        }
        else {
            res.status(404).send("product not found.");
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})

// update 
app.put('/products/:id', async (req, res) => { 
    try {
        const id = req.params.id;

        const title = req.body.title;
        const price = req.body.price;
        const description = req.body.description;

        const product = await Product.updateOne(
            { _id: id },
            // const product = await Product.findByIdAndUpdate({_id: id},{
            {
                $set: {
                    title: title,
                    price: price,
                    description: description
                }
            },
            { new: true }
        );
        if (product) {
            res.status(200).send(product);
        }
        else {
            res.status(404).send("product is not updated.")
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})

// post 
app.post('/products', async (req, res) => {
    try {
        const newProduct = new Product({
            title: req.body.title,
            price: req.body.price,
            description: req.body.description,
            rating: req.body.rating
        })
        const productData = await newProduct.save();

        res.status(201).send(productData);

    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

app.listen(PORT, async () => {
    console.log(`server running at port http://localhost:${PORT}`);
    await connectDB();
})