import { Router } from "express";
import { getRecords,addRecord, removeRecord, updateRecord } from "../controllers/recordsController.js";
import authentication from "../middlewares/authentication.js";
import recordSchema from "../middlewares/recordSchema.js";

const recordsRouter = Router();

recordsRouter.get("https://projeto13-mywallet-front-bay.vercel.app/initialpage", authentication, getRecords);
recordsRouter.post("https://projeto13-mywallet-front-bay.vercel.app/add", authentication,recordSchema, addRecord);
recordsRouter.delete("https://projeto13-mywallet-front-bay.vercel.app/initialpage/:index", authentication, removeRecord);
recordsRouter.put("https://projeto13-mywallet-front-bay.vercel.app/initialpage/edit/:index", authentication, recordSchema, updateRecord);

export default recordsRouter;