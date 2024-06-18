const { MongoClient } = require("mongodb");
const express = require("express");
const cors = require("cors");

const connectionString = process.env.MONGODB_URI;

const app = express();
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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