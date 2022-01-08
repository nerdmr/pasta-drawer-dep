import express from "express";
import cors from "cors";
import { getLinkPreview, getPreviewFromContent } from "link-preview-js";

const app = express();
const port = 3000;

app.use(cors({
    origin: '*'
  }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/preview", async (req, res) => {
  if (!req.query?.url) {
    res.status(400);
    res.send("error");
    return;
  }

  // pass the link directly
  try {
    const data = await getLinkPreview(req.query.url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36"
        }
    });
    res.status(200);
    res.send(data);
  } catch (err) {
    res.status(400);
    res.send(`error fetching url: ${err}`);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
