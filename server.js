require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const AWS = require("aws-sdk");
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// initialize Stream Chat SDK

const polly = new AWS.Polly({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: "us-east-1",
});

app.get("/", (req, res) => res.send("hello world"));

app.post("/speech", async (req, res) => {
    const { text, voiceId } = req.body;
    let params = {
        Text: text,
        OutputFormat: "mp3",
        VoiceId: voiceId,
    };

    polly.synthesizeSpeech(params, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).end();
        } else if (data) {
            if (data.AudioStream instanceof Buffer) {
                console.log(" goood ");
                res.status(200).send(data);
            }
        }
    });
});

const server = app.listen(process.env.PORT || 5500, () => {
    const { port } = server.address();
    console.log(`Server running on PORT ${port}`);
});
