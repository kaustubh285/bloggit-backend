import express from "express";
import bodyParser from "body-parser";
import { MongoClient } from "mongodb";

const app = express();

app.use(bodyParser.json());

// const articleInfo = {
//   "learn-react": {
//     upvotes: 0,
//     comments: [],
//   },
//   "learn-node": {
//     upvotes: 0,
//     comments: [],
//   },
//   "my-thoughts-on-resumes": {
//     upvotes: 0,
//     comments: [],
//   },
// };

app.get("/api/article/:name", async (req, res) => {
  try {
    const articleName = req.params.name;
    const client = await MongoClient.connect("mongodb://127.0.0.1:27017/", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const db = client.db("mybloggit");

    const articleInfo = await db
      .collection("articles")
      .findOne({ name: articleName });

    res.status(200).json(articleInfo);
    client.close();
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
});

app.post("/api/article/:name/upvote", async (req, res) => {
  const articleName = req.params.name;

  const client = await MongoClient.connect("mongodb://127.0.0.1:27017/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db("mybloggit");

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
  client.close();
});

app.post("/api/article/:name/add-comment", (req, res) => {
  const { username, text } = req.body;
  const articleName = req.params.name;

  articleInfo[articleName].comments.push({ username, text });
  res.status(200).send(articleInfo[articleName]);
});

app.listen(8001, () => console.log("Listening on post 8001"));
