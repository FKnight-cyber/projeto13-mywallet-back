import { Router } from "express";
import { getRecords,addRecord } from "../controllers/recordsController.js";
import authentication from "../middlewares/authentication.js";
import recordSchema from "../middlewares/recordSchema.js";

const recordsRouter = Router();

recordsRouter.get("/initialpage", authentication, getRecords);
recordsRouter.post("/add", authentication,recordSchema, addRecord);

export default recordsRouter;