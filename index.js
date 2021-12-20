const express = require('express')
var cors = require('cors')
const { MongoClient } = require('mongodb');

require('dotenv').config()
const ObjectId=require("mongodb").ObjectId;
const app = express()
const port =process.env.PORT ||5000

app.use(cors())
app.use(express.json())


//user:mydbuser1
//pass:2cKuKzwaTjiLcbcl


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5d0ua.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  async function run(){

try{
  await client.connect()
  
  const database=client.db("bornnali")
  const collection=database.collection("users")
  
//this is get api
app.get("/users",async(req,res)=>{
const cursor=collection.find({})
const users=await cursor.toArray()
res.send(users)

})
//this is get id api
app.get("/users/:id",async(req,res)=>{
const id=req.params.id;
const query={_id:ObjectId(id)}
const user=await collection.findOne(query)
res.send(user)
})




  //This is post api
  app.post("/users",async(req,res)=>{
const newUers=req.body;
console.log(newUers)
const result=await collection.insertOne(newUers)
console.log(result)
res.json(result)


  })

  //this is PUt api
  app.put("/users/:id",async(req,res)=>{
const id=req.params.id;
const user=req.body;
const filter={_id:ObjectId(id)}
const options = { upsert: true };
const updateDoc = {
  $set: {
    name:user.name,
    email:user.email
  },
};
const result = await collection.updateOne(filter, updateDoc, options);
res.json(result)
console.log(result)

  })
 
  //this is delete method
  
  app.delete("/users/:id",async(req,res)=>{
    const id=req.params.id;
    console.log(id)
    const query={_id:ObjectId(id)};
    console.log(query)
    const result =await collection.deleteOne(query);
    console.log("deleting id",result)
    

    
})
  

}
finally{
  // await client.close()
}

 }
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log("This is listening Port",port)
})