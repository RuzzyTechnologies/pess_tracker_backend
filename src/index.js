const express = require("express");
const morgan = require("morgan");

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan("tiny"));

const server = app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
})

process.on("SIGTERM", () => {
  console.debug(`SIGTERM signal received: closing HTTP server`);
  server.close(() => {
    console.debug("HTTP server closed")
  })
})