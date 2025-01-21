const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();
const port = 8081;

app.use(express.json());
app.use(cors());


const encours_gets = require("./src/gets/encours");
const workshops_gets = require("./src/gets/workshops");
const orders_posts = require("./src/posts/orders");
const rfids_posts = require("./src/posts/rfids");
const workshops_posts = require("./src/posts/workshops");


app.use("/encours", encours_gets);
app.use("/workshops", workshops_gets);
app.use("/orders", orders_posts);
app.use("/rfids", rfids_posts);
app.use("/workshops", workshops_posts);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
