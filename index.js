let express = require("express");
let cors = require("cors");
const { mongodb } = require("./mongodb/mongodb");
const { addNotes, searchNotes } = require("./langchain/langchain");
let app = express();
let port = 5000;

app.get("/",(req,res)=>{
    res.send("Express server is running");
});

app.use(cors(),express.json());

app.post("/addnotes", async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: "Text is required in request body" });
        }
        await addNotes(text);
        res.status(200).json({ message: "Notes embedded and saved successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to add notes" });
    }
});

app.post("/searchnotes", async (req, res) => {
    try {
        const { question } = req.body;
        if (!question) {
            return res.status(400).json({ error: "Question is required in request body" });
        }
        const results = await searchNotes(question);
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to search notes" });
    }
});

mongodb().then(()=>
app.listen(port,()=>{
    console.log(`Server is running on ${port}`);
}));