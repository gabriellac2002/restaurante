import express from "express";
import router from "./routers/router";

const app = express();
const port = 3000;

app.use(express.json({ limit: '10mb' }));
app.use("/api", router);

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});
