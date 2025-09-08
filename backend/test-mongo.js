const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://ishsaxena14:ISstar0214@projectstuorg.sja8mwr.mongodb.net/?retryWrites=true&w=majority&appName=ProjectStuOrg";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    await client.close();
  }
}
run().catch(console.dir);