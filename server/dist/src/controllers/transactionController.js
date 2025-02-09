"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listTransactions = exports.createTransaction = exports.createStripPaymentIntent = void 0;
const stripe_1 = __importDefault(require("stripe"));
const dotenv_1 = __importDefault(require("dotenv"));
const courseModel_1 = __importDefault(require("../models/courseModel"));
const transactionModel_1 = __importDefault(require("../models/transactionModel"));
const userCourseProgressModel_1 = __importDefault(require("../models/userCourseProgressModel"));
dotenv_1.default.config();
if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is required but was not found in the env variables");
}
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY ?? "");
const createStripPaymentIntent = async (req, res) => {
    let { amount } = req.body;
    if (!amount || amount <= 0) {
        amount = 5000; // Default to $50.00 (5000 cents)
    }
    else {
        amount = parseInt(amount, 10);
    }
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount, // Ensure this is an integer
            currency: "usd",
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: "never"
            }
        });
        res.json({
            message: "Payment intent created successfully",
            data: {
                clientSecret: paymentIntent.client_secret
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error creating Stripe payment intent", error });
    }
};
exports.createStripPaymentIntent = createStripPaymentIntent;
const createTransaction = async (req, res) => {
    const { userId, courseId, amount, transactionId, paymentProvider } = req.body;
    try {
        const course = await courseModel_1.default.get(courseId);
        const newTransaction = new transactionModel_1.default({
            dateTime: new Date().toISOString(),
            userId,
            courseId,
            transactionId,
            amount,
            paymentProvider
        });
        await newTransaction.save();
        const initialProgress = new userCourseProgressModel_1.default({
            userId,
            courseId,
            enrollmentDate: new Date().toISOString(),
            overallProgress: 0,
            sections: course.sections.map((section) => ({
                sectionId: section.sectionId,
                chapters: section.chapters.map((chapter) => ({
                    chapterId: chapter.chapterId,
                    completed: false
                }))
            })),
            lastAccessedTimestamp: new Date().toISOString(),
        });
        await initialProgress.save();
        await courseModel_1.default.update({
            courseId
        }, {
            $ADD: {
                enrollments: [{ userId }]
            }
        });
        res.json({
            message: "Purchased Course Successfully",
            data: {
                transaction: newTransaction,
                courseProgress: initialProgress
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error creating transaction and enrollment", error });
    }
};
exports.createTransaction = createTransaction;
const listTransactions = async (req, res) => {
    const { userId } = req.query;
    try {
        const transactions = userId ? await transactionModel_1.default.query("userId").eq(userId).exec()
            : await transactionModel_1.default.scan().exec();
        res.json({
            message: "Transactions retrieved successfully",
            data: transactions
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving transactions", error });
    }
};
exports.listTransactions = listTransactions;
