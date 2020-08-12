import express from "express";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json());

const articleInfo = {
  "learn-react": {
    upvotes: 0,
  },
  "learn-node": {
    upvotes: 0,
  },
  "my-thoughts-on-resumes": {
    upvotes: 0,
  },
};

app.post("/api/:name/upvote", (req, res) => {
  const articleName = req.params.name;

  articleInfo[articleName].upvotes += 1;

  res
    .status(200)
    .send(
      `Upvote for ${articleName} is now ${articleInfo[articleName].upvotes}`
    );
});

// app.get("/hello", (req, res) => res.send("hello!"));
// app.get("/user/:name", (req, res) => res.send(`hello ${req.params.name}`));
// app.post("/hello", (req, res) => res.send(`hello ${req.body.name}`));

app.listen(3001, () => console.log("Listening on post 3001"));
