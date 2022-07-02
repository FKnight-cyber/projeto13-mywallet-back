import { Router } from "express";
import { getRecords,addRecord, removeRecord, updateRecord } from "../controllers/recordsController.js";
import authentication from "../middlewares/authentication.js";
import recordSchema from "../middlewares/recordSchema.js";

const recordsRouter = Router();

recordsRouter.get("/initialpage", authentication, getRecords);
recordsRouter.post("/add", authentication,recordSchema, addRecord);
recordsRouter.delete("/:index", authentication, removeRecord);
recordsRouter.put("/:index", authentication, recordSchema, updateRecord);

export default recordsRouter;