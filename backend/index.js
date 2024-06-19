import express from 'express'
import dotenv from 'dotenv'

import productRoutes from "./routes/productRoutes.js";

dotenv.config();
const port =process.env.PORT||5000;

const app =express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/api/v1/categories/", productRoutes);


app.listen(port, ()=>{
    console.log(`Server is running on ${port}`)
})

