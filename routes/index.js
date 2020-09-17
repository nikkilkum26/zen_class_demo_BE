var express = require('express');
var router = express.Router();
const bodyParser = require("body-parser");
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const url ="mongodb+srv://nikkil:fJ4xAym7Vpucf00T@zencluster.y8kfe.mongodb.net/?retryWrites=true&w=majority"
router.use(bodyParser.json());
const cors = require("cors");



router.use(cors({
  origin : "https://brave-visvesvaraya-2ac7e5.netlify.app/"
}))

/* GET home page. */
let stud = []


let teach = [{
  name: "teacher1"
}]
router.get("/", function (req, res) {

  res.send("Im working")

})
router.get("/students", async function (req, res) {
  try{
    let client = await mongoClient.connect(url);

  let db = client.db("zen");
  let list = await db.collection("students").find().toArray();
  client.close();
  res.json(list)
}
catch(err){
  console.log(err);
}



})


router.post("/students", async function (req, res) {
  try {let client = await mongoClient.connect(url);
  let db = client.db("zen");
  let insertedStudents = await db.collection("students").insertOne({ name: req.body.name })
  client.close();
  res.json({
    message: "created",
    id: insertedStudents.insertedId

  })}
  catch(err){
    console.log(err);
  }


})



router.get("/students/:id", async function (req, res) {
  try {
    let client = await mongoClient.connect(url);
    let db = client.db("students");
    let students = await db.collection("students").findOne({ _id: mongodb.ObjectID(req.params.id) })
    client.close();
    if (students) {
      res.json(students);
    }
    else {
      res.json({
        message: "No data"
      })
    }
  }
  catch (err) {
    res.json("something went wrong")
  }


})

router.put("/students/:id", async function (req, res) {
  try {
    let client = await mongoClient.connect(url);
    let db = client.db("students");
    let result = await db.collection("students")
      .findOneAndUpdate(
        { _id: mongodb.ObjectID(req.params.id) },
        {
          $set: { name: req.body.name }
        })

    client.close();

    res.json(result);
  }
  catch (err) {
    res.json("something went wrong");
    console.log(err);
  }
})

router.delete("/students/:id", async function (req, res) {
  try {
    let client = await mongoClient.connect(url);
    let db = client.db("students");
    await db.collection("students")
      .findOneAndDelete(
        { _id: mongodb.ObjectID(req.params.id) }) 
    client.close();

    res.json({
      message : "Deleted"
    });
  }
  catch (err) {
    res.json("something went wrong");
  }
})


router.get("/teachers", function (req, res) {

  res.json(teach)


})



module.exports = router;
