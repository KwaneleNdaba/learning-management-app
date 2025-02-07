"use client"
import React from 'react'
import StripeProvider from './StripeProvider'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useCheckoutNavigation } from '@/hooks/useCheckoutNavigation';
import { useCurrentCourse } from '@/hooks/useCurrentCourse';
import { useClerk, useUser } from '@clerk/nextjs';
import CoursePreview from '@/components/CoursePreview';
import { CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCreateTransactionMutation } from '@/state/api';
import { toast } from 'sonner';

function PaymentPageContent() {
    const stripe = useStripe();
    const elements = useElements();
       const [createTransaction] = useCreateTransactionMutation(); 

    const { navigateToStep } = useCheckoutNavigation();
    const { course, courseId } = useCurrentCourse();
    const { user } = useUser();
    const { signOut } = useClerk();


    const handleSubmit = async (e:React.FormEvent) => {
     e.preventDefault();
     if(!stripe || !elements){
        toast.error("Stripe service is not available");
        return;
     }   

     const results = await stripe.confirmPayment({
        elements,
        confirmParams:{
            return_url : `${process.env.NEXT_PUBLIC_STRIPE_REDIRECT_URL}?id=${courseId}`
        },
        redirect: "if_required"
     })

     if(results.paymentIntent?.status === "succeeded"){
        const transactionData : Partial<Transaction> = {
            transactionId: results.paymentIntent.id,
            userId : user?.id,
            courseId: courseId,
            paymentProvider: "stripe",
            amount : course?.price ?? 0
        }
        await createTransaction(transactionData);
        navigateToStep(3);
     }

    }

    const handleSignOut = async () => {
        await signOut();
        navigateToStep(1)
    }

    if (!course) return null;

    return (
        <div className='payment'>
            <div className="payment__container">
                {/* Order Summary */}
                <div className="payment__preview">
                    <CoursePreview course={course} />
                </div>
                {/* Payment Form */}
                <div className="payment__form-container">
                    <form
                        id="payment-form"
                        onSubmit={handleSubmit}
                        action="" className="payment__form">
                        <div className="payment__content">
                            <h1 className="payment__title">
                                Checkout
                            </h1>
                            <p className="payment__subtitle">
                                Fill out the payment details below to compelete your purchase
                            </p>
                            <div className="payment__method">
                                <h3 className="payment__method-title">
                                    Payment Method 
                                </h3>
                                <div className="payment__card-container">
                                    <div className="payment__card-header">
                                        <CreditCard size={24} />
                                        <span className="">Credit/Debit Card</span>
                                    </div>
                                    <div className="payment__card-element">
                                        <PaymentElement/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            {/* Navigations buttons */}
            <div className="payment__actions">
                <Button
                 onClick={handleSignOut}
                className="hover:bg-white-50/10"
                variant="outline"
                type='button'
                >
                    Switch Account
                    
                </Button>
                <Button
                form='payment-form'
                type="submit"

                className="payment_-submit"
                disabled={!stripe || !elements}
                
                >
               Pay with Credit Card
                    
                </Button>
            </div>
        </div>
    )
}


const PaymentPage = () => (
    <StripeProvider>
        <PaymentPageContent />
    </StripeProvider>
)

export default PaymentPage