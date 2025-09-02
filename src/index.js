const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");

const limiter = require("./middleware/limiter")

const app = express();
const port = process.env.PORT || 3000;


app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Authorization"
    ]
  })
);

app.use(helmet());
app.use(morgan("tiny"));
app.use(limiter);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));


const server = app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
})

process.on("SIGTERM", () => {
  console.debug(`SIGTERM signal received: closing HTTP server`);
  server.close(() => {
    console.debug("HTTP server closed")
  })
})