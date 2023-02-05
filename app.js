
import express from 'express';
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import router from "./routes.js";
import bodyParser from "body-parser";
import * as path from 'path';

import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: "./config.env" });

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());

var oneWeek = 86400000*7;
app.use(express.static("./public", { maxAge: oneWeek, lastModified: true }));

app.use(cookieParser());
app.use(fileUpload())
app.use('/', router);

import "./db/conn.js";

const port = process.env.PORT || 3000;

if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname, "frontend" , "build")));

  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
  })
}

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
