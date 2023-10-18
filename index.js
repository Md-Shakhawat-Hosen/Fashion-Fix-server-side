const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

require('dotenv').config();



const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.c3eejtp.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const brandNameCollection = client.db('brandNameDB').collection('brandName');
    const productCollection = client.db('ProductsDB').collection('product')
    const cartCollection = client.db('cartDB').collection('cart')

    app.get('/brand', async(req,res)=>{
        const query = brandNameCollection.find();
        const result = await query.toArray();
        res.send(result);
    })

    app.get('/brand/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await brandNameCollection.findOne(query);
        res.send(result);
    })
    
    app.get('/products', async(req,res)=>{
        const query = productCollection.find();
        const result = await query.toArray();
        res.send(result);
    })

    app.get('/products/:id', async(req,res) =>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await productCollection.findOne(query);
        res.send(result);
    })

    app.get('/cart', async(req,res)=>{
        const query = cartCollection.find();
        const result = await query.toArray();
        res.send(result)
    })

    app.post('/brand', async(req,res)=>{
        const brandInfo = req.body;
        // console.log(brandName);
        const result = await brandNameCollection.insertOne(brandInfo)
        res.send(result);
    })


    app.post('/products', async(req,res) => {
        const brandLoad = req.body;
        const result = await productCollection.insertOne(brandLoad);

        res.send(result);
    })

    app.post('/cart', async(req,res)=>{
        const cartLoad = req.body;
        const result = await cartCollection.insertOne(cartLoad);
        res.send(result)
    })

  
    app.delete('/cart/:id', async(req,res) =>{
        const id = req.params.id;
        const query = {_id:new ObjectId(id)};
        const result = await cartCollection.deleteOne(query);
        res.send(result)
    })







    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res) => {
    res.send('Fashion store server is running');
})


app.listen(port, () => {
    console.log(`Fashion server is running on port:${port}`);
})