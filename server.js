import express from "express";
import "dotenv/config";
import { prisma } from "./lib/prisma.ts";
import userRoutes from "./routes/userRoutes.js"
import loginRoutes from "./routes/loginRoute.js"
import currentUserRoute from "./routes/currentUserRoute.js"
import productRoute from "./routes/productRoute.js"

const app = express();
const port = `${process.env.EXPRESS_PORT}`;

app.use(express.json());
app.use("/users", userRoutes);
app.use("/", loginRoutes);
app.use("/", currentUserRoute);
app.use("/", productRoute)

app.get("/", (req, res) => {
    return res.status(200).json({
        success: true, 
        msg: "Welcome to Blockfuse Vintage"
    });
});

app.use((err, req, res, next) => {
    console.error("Global error handler:", err);
    res.status(500).json({ success: false, msg: "Internal server error", reason: err.message });
});

import multer from 'multer';


// Configure where the uploaded files should be stored
const upload = multer({ dest: 'uploads/' });

// Use upload.single('your_file_field_name') as middleware
app.post('/upload', upload.single('userFile'), (req, res) => {
  // Access the file using req.file
  if (!req.file) {
    return res.status(400).send('No file was uploaded.');
  }

  console.log(req.file); 
  
  // Access properties just like you want:
  const fileName = req.file.filename;
  const originalName = req.file.originalname;
  const fileSize = req.file.size;

  res.send(`File "${originalName}" uploaded successfully!`);
});


app.listen(port, () => {
    console.log(`App is runnig on Port: ${port}`);
});