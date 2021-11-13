import express from "express";
import cors from "cors";
import dns from "dns";

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

const urlArr = [];

app.use(cors());
app.use(cors({ optionsSuccessStatus: 200 }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const __dirname = process.cwd();

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/api/shorturl/:short_url", async (req, res) => {
  const short_url = parseInt(req.params.short_url);
  console.log("short_id: ", short_url)

  const urlFiltered = urlArr.filter((url) => {
    console.log("URL PARAM. SHORTURL", url.short_url)
    return url.short_url === short_url
  });
  console.log(urlFiltered);
  
  if(urlFiltered.length && Array.isArray(urlFiltered)) {
      res.redirect(urlFiltered[0].original_url);
  } else {
      res.redirect("/");
  }

});

app.post("/api/shorturl", async (req, res) => {
  const { url } = req.body;
  let id = urlArr.length + 1
  console.log("LENGTH Arr", id)

  const validUrl = url.includes("http://") || url.includes("https://");

  if (!validUrl) {
    res.json({
      error: "Invalid URL",
    });
  } else {
    const urlString = url.substring(url.lastIndexOf("/") + 1);

    console.log("URLs: ", url, urlString);

    dns.lookup(urlString, (err, address, family) => {
      if (err) {
        res.json({
          error: "invalid URL",
        });
      } else {
        urlArr.push({
            original_url: url,
            short_url: id,
        });
        console.log('URL ARRAY', urlArr);

        res.json({
          original_url: url,
          short_url: id,
        });
      }
    });
  }
});

app.listen(PORT, HOST, () => {
  console.log(`Server running on port ${PORT}`);
});
