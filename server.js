import express from "express";
import cors from "cors";
import dns from "dns";

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

const urlArr = [
  {
    original_url: "https://danielrivasdev.co",
    short_url: 1,
  },
];

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

  const urlFiltered = urlArr.filter((url) => {
    return url.short_url === short_url;
  });

  if (urlFiltered.length && Array.isArray(urlFiltered)) {
    res.redirect(urlFiltered[0].original_url);
  } else {
    res.redirect("/");
  }
});

app.get("/api/shorturl", (req, res) => {
  console.log("ARR EXAMPLE", urlArr);
  res.send(urlArr[0]);
});

app.post("/api/shorturl", async (req, res) => {
  const { url } = req.body;
  let id = urlArr.length + 1;
  let original_url = url;
  const validUrl = url.includes("http://") || url.includes("https://");

  const searchUrlIfExist = urlArr.filter((url) => {
    return url.original_url == original_url;
  });

  console.log("SEARCH URL IF EXIST", searchUrlIfExist[0]?.original_url);
  console.log("URL RECEIVED", original_url)

  if (!validUrl) {
    res.json({
      error: "Invalid URL",
    });
  } else if (url === searchUrlIfExist[0]?.original_url) {
  console.log("ARR WITHOUT CHANGES", urlArr);

    res.json({
      original_url: url,
      short_url: searchUrlIfExist[0].short_url,
    });
  } else {
    const urlString = url.substring(url.lastIndexOf("/") + 1);

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
        console.log("ARR PUSHED", urlArr);

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
