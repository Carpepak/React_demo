const express = require("express");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const db = require("./src/database");
const graphql = require("./src/graphql");
const multer = require("multer");
let upload =multer({dest:"./imgs"});
const fs = require("fs");
// Database will be sync'ed in the background.
db.sync();

const app = express();

// Parse requests of content-type - application/json.
app.use(express.json());

// Add CORS suport.
app.use(cors());

// Add graphql route 
app.use(
    "/graphql",
    graphqlHTTP({
      schema: graphql.schema,
      rootValue: graphql.root,
      graphiql: true
    })
);
//static file directory settings
app.use("/imgs",express.static("imgs"));

app.post("/upload",upload.single('avatar'),(req,res)=>{
  let file = req.file;
  let imgurl = "./imgs/"+file.originalname
  fs.rename(file.path, imgurl, (err)=>{
  }); 
  imgurl = "http://localhost:4000/imgs/"+file.originalname
  res.json(imgurl);
})

// Add user routes.
require("./src/routes/user.routes.js")(express, app);
require("./src/routes/post.routes.js")(express, app);
require("./src/routes/profile.routes.js")(express, app);
require("./src/routes/follow.routes.js")(express, app);


// Set port, listen for requests.
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
