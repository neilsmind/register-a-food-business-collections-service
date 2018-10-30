const { Router } = require("express");

const routers = () => {
  const router = Router();

  router.get("/api/collect", (req, res) => {
    res.send("hello world");
  });

  return router;
};

module.exports = { routers };
