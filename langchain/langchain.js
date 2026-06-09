require("dotenv").config();
let mongoose = require("mongoose");
let {GoogleGenerativeAIEmbeddings} = require("@langchain/google-genai");
let {MongoDBAtlasVectorSearch} = require("@langchain/mongodb");
let {Document} = require("@langchain/core/documents");

let addNotes = async(text)=>{
    try{
        let textCollection = mongoose.connection.db.collection("noteschunks");
        await MongoDBAtlasVectorSearch.fromDocuments([new Document({pageContent:text})],new GoogleGenerativeAIEmbeddings({model:"gemini-embedding-001",apiKey:process.env.GEMINI_KEY}),
        {
            collection:textCollection,
            indexName:"vector_index",
            textKey:"text",
            embeddingKey:"embedding"
        }
    );
    console.log("Notes embedded and saved to MongoDB");
    }
    catch(error){
        console.log(error.message);
    }
}

let searchNotes = async(question)=>{
    try{
        let textCollection=mongoose.connection.db.collection("noteschunks");
        let vectorStore = new MongoDBAtlasVectorSearch(
            new GoogleGenerativeAIEmbeddings({
                model:"gemini-embedding-001",
                apiKey:process.env.GEMINI_KEY
            }),
            {
                collection:textCollection,
                indexName:"vector_index",
                textKey:"text",
                embeddingKey:"embedding"
            }
        );
       let results =  await vectorStore.similaritySearchWithScore(question,10);
       let filtered = results.filter(([doc,score])=>score>=0.82).map(([doc,score])=>({
        text:doc.pageContent,
        score:parseFloat(score.toFixed(4))
       }));

       return filtered;
    }
    catch(error){
        console.log(error.message);
    }
}
module.exports={addNotes,searchNotes}