require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// visa-application
// 1BzuOm9aF3Wk0o6h



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mxvej.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const database = client.db('visaDB');
    const visaCollection = database.collection('visa');

    const applicationCollection = client.db('visaDB').collection('applications');
    const userCollection = client.db('visaDB').collection('users');



    app.get('/all', async (req, res) => {
      const cursor = visaCollection.find();
      const result = await cursor.toArray();
      res.send(result);
  });

  app.get('/visa/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await visaCollection.findOne(query);
    res.send(result);
})

app.get('/all/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await visaCollection.findOne(query);
  res.send(result);
})

    app.post('/all', async (req, res) => {
        const newVisa = req.body;
        console.log('Adding new Visa', newVisa)

        const result = await visaCollection.insertOne(newVisa);
        res.send(result);
    });

   
    


    // app.put('/all/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const filter = { _id: new ObjectId(id) };
    //   const options = { upsert: true };
    //   const updatedDoc = {
    //       $set: req.body
    //   }
    
    //   const result = await visaCollection.updateOne(filter, updatedDoc, options )
    
    //   res.send(result);
    // })

    app.patch("/all/:id", async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = {upsert: true};
      const updateVisa = req.body;
      const Visa = {
          $set: {
              countryName: updateVisa.countryName,
              countryImage: updateVisa.countryImage,
              visaType: updateVisa.visaType,
              processingTime: updateVisa.processingTime,
              fee: updateVisa.fee,
              validity: updateVisa.validity,
              applicationMethod: updateVisa.applicationMethod,
              
          }
      }
      

      const result = await visaCollection.updateOne(filter, Visa, options);
      res.send(result);
  })
    
    app.delete('/all/:id', async (req, res) => {
      console.log('going to delete', req.params.id)
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await visaCollection.deleteOne(query);
      res.send(result);
    });

    
app.get('/applications', async (req, res) => {
  const cursor = applicationCollection.find();
  const result = await cursor.toArray();
  res.send(result);
});
    app.post('/applications', async (req, res) => {
      const newApplication = req.body;
      console.log('Adding new Visa application', newApplication)

      const result = await applicationCollection.insertOne(newApplication);
      res.send(result);
  });

  app.get('/applications/email/:email', async (req, res) => {
  const applicationEmail = req.params.email;
  const query = { email: applicationEmail };
  const result = await applicationCollection.find(query).toArray();
  res.send(result);
});

app.get('/applications/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id : new ObjectId(id)};
  const result = await applicationCollection.findOne(query);
  res.send(result);
});

app.put('/applications/:id', async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const options = { upsert: true };
  const updatedDoc = {
      $set: req.body
  }

  const result = await applicationCollection.updateOne(filter, updatedDoc, options )

  res.send(result);
})

app.delete('/applications/:id', async (req, res) => {
  console.log('going to delete', req.params.id)
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await applicationCollection.deleteOne(query);
  res.send(result);
});





app.get('/all/email/:email', async (req, res) => {
  const visaEmail = req.params.email;
  const query = { email: visaEmail };
  const result = await visaCollection.find(query).toArray();
  res.send(result);
})



app.get('/users', async(req,res)=>{
  const cursor= userCollection.find();
  const result= await cursor.toArray();
  res.send(result);
})
app.post('/users', async(req,res)=>{
  const newUser = req.body;
  console.log('creating new user',newUser);
  const result= await userCollection.insertOne(newUser);
  res.send(result);
})
app.patch('/users',async(req,res)=>{
  const email= req.body.email;
  const filter ={email};
  const updatedDoc = {
      $set:{
          lastSignInTime: req.body?.lastSignInTime
      }
  }
  const result= await userCollection.updateOne(filter,updatedDoc);
  res.send(result);
})

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Visa applicaion server is running')
})

app.listen(port, () => {
    console.log(`Visa applicaion server is running' on: ${port}`);
})
