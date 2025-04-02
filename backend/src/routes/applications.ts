import express from "express";
import { getAll, saveAll } from "../models/applications";

export const router = express.Router();
router.use(express.json());

router.get("/", async (req, res) => {
    const applications = await getAll();
    res.send(applications);
});

router.put("/", async (req, res) => {
    console.log(`request body:`, req.body);
    const applicationArray = req.body;
    await saveAll(applicationArray);
    res.send();
});
