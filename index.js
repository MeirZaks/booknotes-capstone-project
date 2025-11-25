import express from "express";
import pg from "pg";
import axios from "axios";
import ColorThief from "colorthief";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "booknotes",
  password: "8TB=a(oV",
  port: "5432",
});
db.connect();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

let orderBy = "id";
let isASC = "ASC";

//initial page upon loading. Organizes all the data for the index.ejs file
app.get("/", async (req, res) => {
  try {
    const result = await db.query(
      `select BL.*, book_id, isbn from booklist BL join bookcover on BL.id = book_id order by ${orderBy} ${isASC}`
    );

    const allIsbns = result.rows.map((i) => i.isbn);

    const bookcovers = await getCovers(allIsbns);

    //updated_at is too long by default in the Database so it shortens it here
    //for displaying reasons.
    const updatedTimestamps = result.rows.map((i) =>
      String(i.updated_at).substring(0, 24)
    );

    res.render("index.ejs", {
      bookcovers: bookcovers,
      booklist: result.rows,
      updated_at: updatedTimestamps,
    });
  } catch (error) {
    console.log(error);
  }
});

//sorting the list upon different orders
app.post("/sort", (req, res) => {
  switch (req.body.sort_by) {
    case "title":
      orderBy = "title";
      isASC = "ASC";
      break;
    case "rating":
      orderBy = "rating";
      isASC = "DESC";
      break;
    case "recency":
      orderBy = "updated_at";
      isASC = "DESC";
      break;
  }
  res.redirect("/");
});

//get covers function to get covers with the Open Library API.
async function getCovers(isbn) {
  const bookcovers = [];
  for (var i = 0; i < isbn.length; i++) {
    bookcovers.push(`https://covers.openlibrary.org/b/isbn/${isbn[i]}-L.jpg`);
  }

  return bookcovers;
}

//loads the page of the individual book review. Uses https://github.com/lokesh/color-thief
//to take the dominant color of the cover and makes it into a backgroud gradient.
app.post("/book/:isbn", async (req, res) => {
  const result = await db.query(
    `select BL.*, book_id, isbn from booklist BL join bookcover on BL.id = book_id where isbn = '${req.body.isbn}'`
  );

  const bookcover = `https://covers.openlibrary.org/b/isbn/${req.body.isbn}-L.jpg`;

  try {
    const response = await axios.get(bookcover, {
      responseType: "arraybuffer",
    });

    const imageBuffer = Buffer.from(response.data);
    const color = await ColorThief.getColor(imageBuffer);
    const colorString = "rgb(" + color.join(", ") + ")";

    res.render("review.ejs", {
      data: result.rows[0],
      color: colorString,
    });
  } catch (error) {
    console.log(error);
    res.render("review.ejs", {
      data: result.rows[0],
      color: "rgb(255, 255, 255)",
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
