const { MongoClient } = require("mongodb");
const express = require("express");
const cors = require("cors");

const connectionString = process.env.MONGODB_URI;

if (!connectionString) {
    console.error('MONGODB_URI is not set');
}

const app = express();

const corsOptions = {
    origin: 'https://shubham-gaikwad.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: true,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.options('*', cors(corsOptions)); // Preflight request handling

// POST request handler for '/clientresponse'
app.post('/clientresponse', async (req, res) => {
    console.log('Received request:', req.body);
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
        console.error('Error inserting record:', err); // Log the error for debugging
        res.status(500).send({ error: err.message });
    } finally {
        await client.close();
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server started: http://localhost:${port}`);
});
