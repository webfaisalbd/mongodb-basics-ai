const { urlencoded } = require('express');
const express = require('express');
const mongoose = require('mongoose');

const PORT = 4000;

const app = express();
app.use(express.json());

const mongodbConnected = () => {
    mongoose.connect('mongodb://127.0.0.1:27017/schoolManagement')
        .then(() => console.log("mongodb connected"))
        .catch(error => console.log("mongodb is not connected"))
}

// make schema 
const schoolManagementSchema = new mongoose.Schema({
    studentClassName: {
        type: String,
        required: true
    },
    studentNumber: {
        type: Number,
        required: true,
        max: [40, "maximum number of student 40 in a class"],
        min: [10, "minimum number of student 10 in a class"]
    },
    studentSubject: {
        type: String,
        required: true
    },
    studentGolden: {
        type: Number,
        required: true
    }

})

// make model
const SchoolManagementModel = mongoose.model("students", schoolManagementSchema);



// get students
app.get("/students", async (req, res) => {
    try {
        const students = await SchoolManagementModel.find();
        if (students) {
            res.status(201).send(students);
        } else {
            res.status(404).send("students not found.");
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})

// get specific students
app.get('/students/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const student = await SchoolManagementModel.find({ _id: id }).select({ _id: 0 })
        if (student) {
            res.status(201).send(student);
        } else {
            res.status(404).send("student not found.");
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})

// post students
app.post('/students', async (req, res) => {
    try {
        const newData = new SchoolManagementModel({
            studentClassName: req.body.studentClassName,
            studentNumber: req.body.studentNumber,
            studentSubject: req.body.studentSubject,
            studentGolden: req.body.studentGolden
        })
        const students = await newData.save();
        res.status(201).send(students);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})

// get
app.get('/', (req, res) => {
    res.send("Welcome to localhost")
})

app.listen(PORT, async () => {
    console.log(`server is connected at http://localhost:${PORT}`);
    await mongodbConnected();
})