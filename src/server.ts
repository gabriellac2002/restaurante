import express from "express";
import router from "./routers/router";
import multer, { StorageEngine } from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const storage: StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const id = uuidv4();
    cb(null, id + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

var cors = require("cors");
const app = express();
app.use('/uploads', express.static('uploads'));
app.use(cors());


const port = 3000;

app.use(express.json({ limit: "10mb" }));
app.use(upload.any());
app.use("/api", router);

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});
