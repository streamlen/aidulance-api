import express from "express";

const router = express.Router();

router.route("/users/:id").get().delete().patch();

export default router;
