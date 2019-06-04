const express = require("express");
const connectDB = require("./config/db");

const app = express();

//Spajanje u databazu
connectDB();

//Middleware za parsiranje podataka
app.use(express.json({ extended: false }));

app.get("/", (req, res) => {
  res.send("API running");
});

//Definiranje Routesa
//Middleware za profile pictures
app.use("/uploads", express.static("uploads"));
//Middleware za dodavanje api/users na sve routeove za usere
app.use("/api/users", require("./routes/api/users"));

//Middleware za search
app.use("/api/search", require("./routes/api/search"));

//Middleware za dodavanje api/auth na sve routeove za authentikaciju
app.use("/api/auth", require("./routes/api/auth"));

//Middleware za dodavanje api/users na sve routeove za profil
app.use("/api/profile", require("./routes/api/profile"));

//Middleware za dodavanje api/users na sve routeove za postove
app.use("/api/posts", require("./routes/api/posts"));

//Port varijabla koja trazi dali je vec setana, ako ne uzme 5000 kao default
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
