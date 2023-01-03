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


// delete 
app.delete('/students/:id', async (req,res)=> {
    try {
        const id = req.params.id;
        const deleted = await SchoolManagementModel.findByIdAndDelete({_id: id});
        if(deleted){
            res.status(201).send(deleted);
        }
        else {
            res.status(404).send("not deleted");
        }
    } catch (error) {
        res.status(500).send({message: error.message});
    }
})

// update 
app.put("/students/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const studentClassName = req.body.studentClassName;
        const studentNumber = req.body.studentNumber;
        const studentGolden = req.body.studentGolden;

        const student = await SchoolManagementModel.findByIdAndUpdate(
            { _id: id },
            {
                $set: {
                    studentClassName: studentClassName,
                    studentNumber: studentNumber,
                    studentGolden: studentGolden
                }
            },
            { new: true }
        )
        if (student) {
            res.status(200).send(student);
        }
        else {
            res.status(404).send("student not updated");
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})

// get all students
// app.get("/students", async (req, res) => {
//     try {
//         const students = await SchoolManagementModel.find();
//         if (students) {
//             res.status(201).send(students);
//         } else {
//             res.status(404).send("students not found.");
//         }
//     } catch (error) {
//         res.status(500).send({ message: error.message });
//     }
// })

// get specific students using params
// app.get('/students/:id', async (req, res) => {
//     try {
//         const id = req.params.id;

//         const student = await SchoolManagementModel.find({ _id: id })
//         if (student) {
//             res.status(201).send(student);
//         } else {
//             res.status(404).send("student not found.");
//         }
//     } catch (error) {
//         res.status(500).send({ message: error.message });
//     }
// })

// get specific students using query parameter,
// if there is no query parameter, then show all get students 
app.get('/students', async (req, res) => {
    try {
        const studentClassName = req.query.studentClassName;

        if (studentClassName) {
            const student = await SchoolManagementModel.find({ studentClassName: studentClassName });
            res.send(student);
        } else {
            const student = await SchoolManagementModel.find();
            res.send(student);
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