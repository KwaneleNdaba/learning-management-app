import express from "express";
import { createStripPaymentIntent, createTransaction } from "../controllers/transactionController";

const router = express.Router();

router.post("/stripe/payment-intent", createStripPaymentIntent);
router.post("/", createTransaction);


export default router;