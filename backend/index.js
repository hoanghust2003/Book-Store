const express = require('express');
const app = express();

const mongoose = require('mongoose');

const port = process.env.PORT ||5000;
require('dotenv').config();


async function main() {
  await mongoose.connect(process.env.DB_URL);
  //routes
  app.use('/',(req, res)=>{
    res.send('Book server!')
  })
}

main().then(()=>console.log('MongoDB connect successfully!')).catch(err => console.log(err));

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})