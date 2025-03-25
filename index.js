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



    app.post('/all', async (req, res) => {
        const newVisa = req.body;
        console.log('Adding new Visa', newVisa)

        const result = await visaCollection.insertOne(newVisa);
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
