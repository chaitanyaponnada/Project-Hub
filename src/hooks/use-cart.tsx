
"use client";

import type { Project } from '@/lib/placeholder-data';
import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';
import { useToast } from './use-toast';
import { useAuth } from './use-auth';
import { doc, getDoc, setDoc, onSnapshot, collection, writeBatch, serverTimestamp, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { createStripeCheckoutSession } from '@/lib/firebase-services';

interface CartItem extends Project {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  purchasedItems: CartItem[];
  addToCart: (project: Project) => void;
  buyNow: (project: Project) => void;
  removeFromCart: (projectId: string) => void;
  clearCart: () => void;
  addPurchasedItems: (items: CartItem[]) => void;
  checkoutWithStripe: () => Promise<void>;
  isCheckingOut: boolean;
  cartCount: number;
  totalPrice: number;
  googlePayButton: React.ReactNode | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);


export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [purchasedItems, setPurchasedItems] = useState<CartItem[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();
  const [googlePayButton, setGooglePayButton] = useState<React.ReactNode | null>(null);

  const totalPrice = useMemo(() => cartItems.reduce((total, item) => total + item.price * item.quantity, 0), [cartItems]);
  
  useEffect(() => {
    if (!user || cartItems.length === 0) {
      setGooglePayButton(null);
      return;
    };
    
    const onGooglePayPayment = async (paymentData: any) => {
        try {
            const paymentToken = paymentData.paymentMethodData.tokenizationData.token;

            // This is the document that the Firebase Extension will be listening to
            const paymentRef = await addDoc(collection(db, `customers/${user.uid}/payments`), {
                paymentToken: paymentToken
            });

            // Redirect to a success page, passing the payment session ID.
            // You can use this ID to listen for the payment result from the extension.
            router.push(`/checkout?gpay_session_id=${paymentRef.id}`);

        } catch (error) {
            console.error('Google Pay processing error:', error);
            toast({
                title: 'Payment Error',
                description: 'There was an issue processing your Google Pay payment.',
                variant: 'destructive',
            });
        }
    };

    const paymentsClient = new google.payments.api.PaymentsClient({ environment: 'TEST' });
    const button = paymentsClient.createButton({
      onClick: () => {
        const paymentDataRequest = {
            apiVersion: 2,
            apiVersionMinor: 0,
            allowedPaymentMethods: [
                {
                    type: 'CARD',
                    parameters: {
                        allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                        allowedCardNetworks: ['MASTERCARD', 'VISA'],
                    },
                    tokenizationSpecification: {
                        type: 'PAYMENT_GATEWAY',
                        parameters: {
                           // IMPORTANT: Replace with your actual gateway and gatewayMerchantId
                           gateway: 'braintree', // or 'adyen', 'checkout.com', 'cybersource', 'square'
                           gatewayMerchantId: 'YOUR_BRAINTREE_MERCHANT_ID', // Replace with ID from your chosen PSP
                        },
                    },
                },
            ],
            merchantInfo: {
                // IMPORTANT: Replace with your Google Pay Merchant ID
                merchantId: '12345678901234567890',
                merchantName: 'Project Hub',
            },
            transactionInfo: {
                totalPriceStatus: 'FINAL',
                totalPrice: String(totalPrice.toFixed(2)),
                currencyCode: 'INR',
                countryCode: 'IN',
            },
        };
        paymentsClient.loadPaymentData(paymentDataRequest).then(onGooglePayPayment).catch(function(err){
            console.error("Error loading payment data: ", err)
        });
      },
      allowedPaymentMethods: [{
          type: "CARD",
          parameters: {
            allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
            allowedCardNetworks: ["AMEX", "VISA", "MASTERCARD"]
          },
          tokenizationSpecification: {
            type: 'PAYMENT_GATEWAY',
            parameters: {
               gateway: 'braintree',
               gatewayMerchantId: 'YOUR_BRAINTREE_MERCHANT_ID',
            },
          }
      }],
      buttonColor: "black",
      buttonType: "pay",
      buttonSizeMode: 'fill',
    });
    
    const container = document.getElementById('google-pay-button-container');
    if (container) {
        container.innerHTML = '';
        container.appendChild(button);
    }
  
  }, [user, cartItems, totalPrice, toast, router]);


  // Fetch cart and purchased items from Firestore on user change
  useEffect(() => {
    if (!user) {
      setCartItems([]);
      setPurchasedItems([]);
      return;
    }

    const cartDocRef = doc(db, 'carts', user.uid);
    const unsubscribeCart = onSnapshot(cartDocRef, (doc) => {
      if (doc.exists()) {
        setCartItems(doc.data().items || []);
      } else {
        setCartItems([]);
      }
    });

    const purchasesDocRef = doc(db, 'purchases', user.uid);
     const unsubscribePurchases = onSnapshot(purchasesDocRef, (doc) => {
      if (doc.exists()) {
        setPurchasedItems(doc.data().items || []);
      } else {
        setPurchasedItems([]);
      }
    });

    return () => {
        unsubscribeCart();
        unsubscribePurchases();
    }
  }, [user]);

  const updateFirestoreCart = async (newCartItems: CartItem[]) => {
    if (!user) return;
    const cartDocRef = doc(db, 'carts', user.uid);
    await setDoc(cartDocRef, { items: newCartItems }, { merge: true });
  };
  
  const addPurchasedItems = async (items: CartItem[]) => {
      if (!user) return;
      
      const batch = writeBatch(db);

      // 1. Add to user's "purchases" collection
      const purchasesDocRef = doc(db, 'purchases', user.uid);
      const docSnap = await getDoc(purchasesDocRef);
      const existingItems = docSnap.exists() ? docSnap.data().items : [];
      const newItems = [...existingItems, ...items.map(({...item}) => item)];
      batch.set(purchasesDocRef, { items: newItems }, { merge: true });

      // 2. Add each item to the global "sales" collection for analytics
      const salesColRef = collection(db, 'sales');
      items.forEach(item => {
          const saleDocRef = doc(salesColRef);
          batch.set(saleDocRef, {
              id: saleDocRef.id,
              projectId: item.id,
              projectTitle: item.title,
              price: item.price,
              userId: user.uid,
              userName: user.displayName,
              userEmail: user.email,
              userPhotoURL: user.photoURL,
              purchasedAt: serverTimestamp()
          });
      });
      
      await batch.commit();
  };

  const addToCart = (project: Project) => {
    const existingItem = cartItems.find(item => item.id === project.id);
    if (existingItem) {
      toast({ title: 'Already in Cart', description: `${project.title} is already in your cart.` });
      return;
    }
    const newCartItems = [...cartItems, { ...project, quantity: 1 }];
    setCartItems(newCartItems);
    updateFirestoreCart(newCartItems);
    toast({ title: 'Added to Cart', description: `${project.title} has been added to your cart.` });
  };

  const buyNow = async (project: Project) => {
    if (!user) {
      router.push('/login?redirect=/projects/' + project.id);
      return;
    }
    await updateFirestoreCart([{ ...project, quantity: 1 }]);
    checkoutWithStripe();
  };

  const removeFromCart = (projectId: string) => {
    const newCartItems = cartItems.filter(item => item.id !== projectId);
    setCartItems(newCartItems);
    updateFirestoreCart(newCartItems);
    toast({ title: 'Item Removed', description: `Item has been removed from your cart.` });
  };

  const clearCart = () => {
    setCartItems([]);
    updateFirestoreCart([]);
  };

  const checkoutWithStripe = async () => {
    if (!user) {
      router.push('/login?redirect=/cart');
      return;
    }

    if(cartItems.length === 0) {
      toast({title: "Your cart is empty.", variant: "destructive"});
      return;
    }

    setIsCheckingOut(true);

    try {
      const checkoutSessionRef = await createStripeCheckoutSession(user.uid, cartItems);
      
      const unsubscribe = onSnapshot(checkoutSessionRef, (snap) => {
        const { error, url } = snap.data() || {};
        if (error) {
          console.error(`Stripe Checkout Error: ${error.message}`);
          toast({ title: "Payment Error", description: error.message, variant: "destructive" });
          unsubscribe();
          setIsCheckingOut(false);
        }
        if (url) {
          window.location.assign(url);
          // Don't need to unsubscribe or set isCheckingOut to false, as the page is redirecting.
        }
      });
    } catch (error) {
      console.error("Error creating Stripe checkout session:", error);
      toast({ title: "Error", description: "Could not initiate checkout.", variant: "destructive" });
      setIsCheckingOut(false);
    }
  };

  const cartCount = useMemo(() => cartItems.reduce((count, item) => count + item.quantity, 0), [cartItems]);
  

  return (
    <CartContext.Provider value={{ cartItems, purchasedItems, addToCart, buyNow, removeFromCart, clearCart, cartCount, totalPrice, addPurchasedItems, checkoutWithStripe, isCheckingOut, googlePayButton }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
