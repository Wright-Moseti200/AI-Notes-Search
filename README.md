# AI Notes Search API

An Express.js REST API that allows users to store notes and perform semantic searches on them. This project leverages **LangChain**, **Google Generative AI (Gemini) Embeddings**, and **MongoDB Atlas Vector Search** to provide highly relevant search results based on the meaning of your notes, rather than just keyword matching.

## Features

- **Semantic Storage**: Adds notes and automatically embeds them using Google's Gemini text embeddings (`gemini-embedding-001`).
- **Vector Search**: Searches through notes using MongoDB Atlas Vector Search, retrieving the most relevant chunks based on similarity scores.
- **RESTful Endpoints**: Simple and clean API routes to manage and query your notes.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas (with Mongoose)
- **AI & Embeddings**: `@langchain/google-genai`, `@langchain/mongodb`, `@langchain/core`

## Prerequisites

Before running the application, ensure you have the following:

- **Node.js** installed on your machine.
- A **MongoDB Atlas** account (required for the Vector Search capability).
- A **Google Gemini API Key** (for text embeddings).

## Installation

1. Clone the repository or navigate to the project directory:
   ```bash
   cd AI-Notes-Search
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

## Environment Variables

Create a `.env` file in the root of the project and add the following keys:

```env
# Your MongoDB connection string
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net

# Your Google Gemini API Key
GEMINI_KEY=your_google_gemini_api_key_here
```

## MongoDB Atlas Vector Search Setup

To make the semantic search work, you need to create a **Vector Search Index** in your MongoDB Atlas cluster.

1. Ensure your database is named `NotesAI` and your collection is named `noteschunks` (the code uses these by default).
2. Go to the Atlas UI, navigate to **Atlas Search**, and create a new **Vector Search** index on the `noteschunks` collection.
3. Name the index: `vector_index`.
4. Use the following JSON configuration for the index:

```json
{
  "fields": [
    {
      "numDimensions": 768,
      "path": "embedding",
      "similarity": "cosine",
      "type": "vector"
    },
    {
      "path": "text",
      "type": "filter"
    }
  ]
}
```
*(Note: Gemini embeddings typically use 768 dimensions. Adjust the dimensions if using a different model).*

## Running the Server

Start the Express server:

```bash
node index.js
```

The server will run by default on `http://localhost:5000`.

## API Endpoints

### 1. Health Check
- **Endpoint**: `GET /`
- **Description**: Verifies if the Express server is running.
- **Response**: `Express server is running`

### 2. Add Notes
- **Endpoint**: `POST /addnotes`
- **Description**: Embeds the provided text and stores it in the MongoDB Atlas collection.
- **Body**:
  ```json
  {
    "text": "Your note content goes here."
  }
  ```
- **Success Response** (200):
  ```json
  {
    "message": "Notes embedded and saved successfully"
  }
  ```

### 3. Search Notes
- **Endpoint**: `POST /searchnotes`
- **Description**: Embeds the search question and performs a similarity search against the stored notes. Returns notes with a similarity score of `>= 0.82`.
- **Body**:
  ```json
  {
    "question": "What is my note about?"
  }
  ```
- **Success Response** (200):
  ```json
  [
    {
      "text": "Your note content goes here.",
      "score": 0.9543
    }
  ]
  ```

## License

ISC License
