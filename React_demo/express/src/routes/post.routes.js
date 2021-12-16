module.exports = (express, app) => {
  const controller = require("../controllers/post.controller.js");
  const router = express.Router();

  // Select all posts.
  router.get("/", controller.all);
  router.get("/self/:username", controller.self);
  router.get("/select/:post_id", controller.one);
  // Create a new post.
  router.post("/", controller.create);
  router.post("/update", controller.update);
  // Add routes to server, use route.
  //app.use(path, router)
  app.use("/api/posts", router);
};
