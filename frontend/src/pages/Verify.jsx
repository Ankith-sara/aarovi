import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { CheckCircle, Loader, Package, CreditCard, AlertCircle, Sparkles } from 'lucide-react';

const Verify = () => {
    const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext);
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [verificationStatus, setVerificationStatus] = useState('verifying'); 
    const success = searchParams.get('success');
    const orderId = searchParams.get('orderId');
    const paymentMethod = searchParams.get('paymentMethod');

    const verifyRazorpayPayment = async () => {
        try {
            const response = await axios.post(
                `${backendUrl}/api/order/verifyrazorpay`,
                { orderId },
                { headers: { token } }
            );

            if (response.data && response.data.success) {
                setVerificationStatus('success');
                toast.success("Payment verified successfully!");
                setCartItems({});
                setTimeout(() => navigate('/orders'), 2000);
            } else {
                setVerificationStatus('error');
                toast.error("Payment verification failed. Redirecting to cart...");
                setTimeout(() => navigate('/cart'), 2000);
            }
        } catch (error) {
            console.error("Razorpay Verification Error:", error);
            setVerificationStatus('error');
            toast.error("Payment verification failed. Redirecting to cart...");
            setTimeout(() => navigate('/cart'), 2000);
        } finally {
            setLoading(false);
        }
    };

    const verifyCODOrder = async () => {
        try {
            const response = await axios.post(
                `${backendUrl}/api/order/verifycod`,
                { orderId },
                { headers: { token } }
            );

            if (response.data && response.data.success) {
                setVerificationStatus('success');
                toast.success("Order placed successfully!");
                setCartItems({});
                setTimeout(() => navigate('/orders'), 2000);
            } else {
                setVerificationStatus('error');
                toast.error("Order verification failed. Redirecting to cart...");
                setTimeout(() => navigate('/cart'), 2000);
            }
        } catch (error) {
            console.error("COD Verification Error:", error);
            setVerificationStatus('error');
            toast.error("Order verification failed. Redirecting to cart...");
            setTimeout(() => navigate('/cart'), 2000);
        } finally {
            setLoading(false);
        }
    };

    const verifyPayment = async () => {
        if (!token) {
            toast.error("Please login to continue");
            navigate('/login');
            return;
        }

        if (!orderId) {
            toast.error("Invalid Order ID. Redirecting...");
            setTimeout(() => navigate('/cart'), 2000);
            return;
        }

        // Route to appropriate verification based on payment method
        switch (paymentMethod?.toLowerCase()) {
            case 'razorpay':
                await verifyRazorpayPayment();
                break;
            case 'cod':
                await verifyCODOrder();
                break;
            default:
                if (success !== null) {
                    await verifyRazorpayPayment();
                } else {
                    toast.error("Invalid payment method");
                    setTimeout(() => navigate('/cart'), 2000);
                    setLoading(false);
                }
        }
    };

    useEffect(() => {
        if (token && orderId) {
            verifyPayment();
        }
    }, [token, orderId]);

    return (
        <div className='min-h-screen bg-gradient-to-b from-white to-background/20 flex items-center justify-center px-4'>
            <div className='max-w-lg w-full'>
                {/* Verification Card */}
                <div className='bg-white border border-background/20 rounded-xl shadow-lg overflow-hidden'>
                    {loading && verificationStatus === 'verifying' ? (
                        <div className="p-12">
                            <div className="flex flex-col items-center gap-6">
                                {/* Animated Badge */}
                                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-secondary to-[#8B6F47] text-white text-xs px-4 py-2 rounded-full font-bold uppercase tracking-wide shadow-lg animate-pulse">
                                    <Sparkles size={14} />
                                    <span>Processing</span>
                                </div>

                                {/* Animated Icon */}
                                <div className="relative">
                                    <div className="w-20 h-20 bg-gradient-to-br from-background/30 to-primary rounded-full flex items-center justify-center">
                                        {paymentMethod === 'cod' ? (
                                            <Package size={32} className="text-secondary animate-bounce" />
                                        ) : (
                                            <CreditCard size={32} className="text-secondary animate-bounce" />
                                        )}
                                    </div>
                                    {/* Spinning Border */}
                                    <div className="absolute inset-0 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
                                </div>

                                {/* Status Text */}
                                <div className="text-center space-y-2">
                                    <h2 className="text-2xl font-serif font-bold text-text">
                                        {paymentMethod === 'cod' 
                                            ? 'Confirming Your Order' 
                                            : 'Verifying Payment'}
                                    </h2>
                                    <p className="text-text/60 font-medium">
                                        Please wait while we process your request
                                    </p>
                                    <p className="text-text/40 text-sm font-light pt-2">
                                        Do not close or refresh this page
                                    </p>
                                </div>

                                {/* Order ID Display */}
                                {orderId && (
                                    <div className="w-full mt-4 p-4 bg-gradient-to-r from-background/10 to-primary/5 rounded-lg border border-background/20">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-semibold text-text/60 uppercase tracking-wider">Order ID:</span>
                                            <span className="font-mono font-semibold text-text text-sm">{orderId.slice(-8)}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : verificationStatus === 'success' ? (
                        <div className="p-12">
                            <div className="flex flex-col items-center gap-6">
                                {/* Success Badge */}
                                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-4 py-2 rounded-full font-bold uppercase tracking-wide shadow-lg">
                                    <CheckCircle size={14} />
                                    <span>Verified</span>
                                </div>

                                {/* Success Icon */}
                                <div className="relative">
                                    <div className="w-24 h-24 bg-gradient-to-br from-green-50 to-green-100 rounded-full flex items-center justify-center animate-scale-in">
                                        <CheckCircle size={48} className="text-green-600" />
                                    </div>
                                    {/* Success Ring */}
                                    <div className="absolute inset-0 border-4 border-green-200 rounded-full animate-ping opacity-75"></div>
                                </div>

                                {/* Success Text */}
                                <div className="text-center space-y-2">
                                    <h2 className="text-2xl font-serif font-bold text-text">
                                        Verification Complete!
                                    </h2>
                                    <p className="text-text/60 font-medium">
                                        {paymentMethod === 'cod' 
                                            ? 'Your order has been placed successfully' 
                                            : 'Your payment has been verified successfully'}
                                    </p>
                                    <p className="text-text/40 text-sm font-light pt-2">
                                        Redirecting to your orders...
                                    </p>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full mt-4">
                                    <div className="w-full bg-background/30 h-2 rounded-full overflow-hidden">
                                        <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full animate-progress"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : verificationStatus === 'error' ? (
                        <div className="p-12">
                            <div className="flex flex-col items-center gap-6">
                                {/* Error Badge */}
                                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-4 py-2 rounded-full font-bold uppercase tracking-wide shadow-lg">
                                    <AlertCircle size={14} />
                                    <span>Failed</span>
                                </div>

                                {/* Error Icon */}
                                <div className="w-24 h-24 bg-gradient-to-br from-red-50 to-red-100 rounded-full flex items-center justify-center">
                                    <AlertCircle size={48} className="text-red-600" />
                                </div>

                                {/* Error Text */}
                                <div className="text-center space-y-2">
                                    <h2 className="text-2xl font-serif font-bold text-text">
                                        Verification Failed
                                    </h2>
                                    <p className="text-text/60 font-medium">
                                        We couldn't verify your {paymentMethod === 'cod' ? 'order' : 'payment'}
                                    </p>
                                    <p className="text-text/40 text-sm font-light pt-2">
                                        Redirecting to cart...
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>

                {/* Help Text */}
                <div className="mt-6 text-center">
                    <p className="text-text/40 text-sm font-light">
                        Having trouble? <button onClick={() => navigate('/contact')} className="text-secondary hover:text-[#8B6F47] font-medium underline">Contact Support</button>
                    </p>
                </div>
            </div>

            <style jsx>{`
                @keyframes scale-in {
                    0% {
                        transform: scale(0);
                        opacity: 0;
                    }
                    50% {
                        transform: scale(1.1);
                    }
                    100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }

                @keyframes progress {
                    0% {
                        width: 0%;
                    }
                    100% {
                        width: 100%;
                    }
                }

                .animate-scale-in {
                    animation: scale-in 0.5s ease-out;
                }

                .animate-progress {
                    animation: progress 2s ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default Verify;