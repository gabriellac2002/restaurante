import express from "express";
import bodyParser from "body-parser";
import router from "./routers/router";

const app = express();
const port = 3000;

app.use(express.json());
app.use("/api", router);

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});
