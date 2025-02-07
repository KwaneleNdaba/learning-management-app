import Stripe from "stripe";
import dotenv from "dotenv"
import { Request ,Response} from "express";
import Course from "../models/courseModel";
import Transaction from "../models/transactionModel";
import UserCourseProgress from "../models/userCourseProgressModel";

dotenv.config();

if(!process.env.STRIPE_SECRET_KEY){
    throw new Error(
        "STRIPE_SECRET_KEY is required but was not found in the env variables"
    );
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");



export const createStripPaymentIntent = async (req: Request, res: Response): Promise<void> => {
    let { amount } = req.body;

    if (!amount || amount <= 0) {
        amount = 5000; // Default to $50.00 (5000 cents)
    } else {
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
    } catch (error) {
        console.error("Error creating Stripe payment intent:", error);
        res.status(500).json({ message: "Error creating Stripe payment intent", error });
    }
};



export const createTransaction = async (req: Request, res: Response): Promise<void> => {
  
    const {userId , courseId, amount , transactionId , paymentProvider} = req.body;
    try {
       const course = await Course.get(courseId);

       const newTransaction = new Transaction({
        dateTime : new Date().toISOString(),
        userId,
        courseId,
        transactionId,
        amount,
        paymentProvider
       })

       await newTransaction.save();

       const initialProgress = new UserCourseProgress({
        userId,
        courseId,
        enrollmentDate: new Date().toISOString(),
        overallProgress : 0,
        sections : course.sections.map((section:any) => ({
            sectionId : section.sectionId,
            chapters : section.chapters.map((chapter:any) => ({
                chapterId : chapter.chapterId,
                completed : false
            }) )
        })),
        lastAccessedTimestamp : new Date().toISOString(),

       })

       await initialProgress.save();

       await Course.update({
        courseId
       },{
        $ADD:{
            enrollments: [{userId}]
        }
       }
    )
    res.json({
        message : "Purchased Course Successfully",
        data : {
            transaction : newTransaction,
            courseProgress : initialProgress
        }
    })
    } catch (error) {
        console.error("Error creating Stripe payment intent:", error);
        res.status(500).json({ message: "Error creating transaction and enrollment", error });
    }
};