import express from "express";
import bodyParser from "body-parser";
import { MongoClient } from "mongodb";

const app = express();

app.use(bodyParser.json());

const withDB = async (operations, res) => {
  try {
    const client = await MongoClient.connect("mongodb://127.0.0.1:27017/", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const db = client.db("mybloggit");

    await operations(db);

    client.close();
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

// GET req to fetch article details
app.get("/api/article/:name", async (req, res) => {
  withDB(async (db) => {
    const articleName = req.params.name;

    const articleInfo = await db
      .collection("articles")
      .findOne({ name: articleName });

    res.status(200).json(articleInfo);
  }, res);
});

// POST req to increase upvotes for an article
app.post("/api/article/:name/upvote", async (req, res) => {
  withDB(async (db) => {
    const articleName = req.params.name;

    const articleInfo = await db
      .collection("articles")
      .findOne({ name: articleName });

    await db.collection("articles").updateOne(
      { name: articleName },
      {
        $set: {
          upvotes: articleInfo.upvotes + 1,
        },
      }
    );

    const updatedArticleInfo = await db
      .collection("articles")
      .findOne({ name: articleName });

    res.status(200).json(updatedArticleInfo);
  }, res);
});

app.post("/api/article/:name/add-comment", (req, res) => {
  withDB(async (db) => {
    const articleName = req.params.name;
    const { username, text } = req.body;
    const articleInfo = await db
      .collection("articles")
      .findOne({ name: articleName });

    await db.collection("articles").updateOne(
      { name: articleName },
      {
        $set: {
          comments: articleInfo.comments.concat({ username, text }),
        },
      }
    );

    const updatedArticleInfo = await db
      .collection("articles")
      .findOne({ name: articleName });

    res.status(200).json(updatedArticleInfo);
  }, res);
});

app.listen(8001, () => console.log("Listening on post 8001"));
