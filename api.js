const { MongoClient } = require("mongodb");
const express = require("express");
const cors = require("cors");

const connectionString = process.env.MONGODB_URI;

const app = express();

// CORS middleware to allow requests from 'https://shubham-gaikwad.vercel.app'
app.use(cors({
    origin: 'https://shubham-gaikwad.vercel.app'
}));

// Additional CORS headers for all routes
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://shubham-gaikwad.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// OPTIONS request handler for preflight requests to '/clientresponse'
app.options('/clientresponse', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://shubham-gaikwad.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(200).send();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// POST request handler for '/clientresponse'
app.post('/clientresponse', async (req, res) => {
    const client = new MongoClient(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const dbo = client.db("portfolio");
        const data = {
            Name: req.body.Name,
            Email: req.body.Email,
            Message: req.body.Message,
        };
        await dbo.collection("clientdetails").insertOne(data);
        console.log('Record inserted');
        res.send({ message: 'Record inserted' });
    } catch (err) {
        res.status(500).send(err.message);
    } finally {
        await client.close();
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server started: http://localhost:${port}`);
});
