import express from "express";
import { createStripPaymentIntent, createTransaction, listTransactions } from "../controllers/transactionController";

const router = express.Router();

router.post("/stripe/payment-intent", createStripPaymentIntent);
router.post("/", createTransaction);
router.get("/", listTransactions
    
);


export default router;