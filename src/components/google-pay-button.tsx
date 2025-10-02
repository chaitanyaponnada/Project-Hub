
'use client';

import React from 'react';
import GooglePayButton from '@google-pay/button-react';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';

export function GooglePayButtonComponent() {
  const { totalPrice, checkoutWithToken, isCheckingOut } = useCart();
  const { toast } = useToast();

  // IMPORTANT: You need to get your Square Location ID and Merchant ID
  // from your Square Developer Dashboard.
  const SQUARE_LOCATION_ID = "REPLACE_WITH_YOUR_SQUARE_LOCATION_ID";
  const SQUARE_MERCHANT_ID = "REPLACE_WITH_YOUR_SQUARE_MERCHANT_ID";

  if (!SQUARE_LOCATION_ID.startsWith('L') || !SQUARE_MERCHANT_ID) {
    return (
        <div className="text-center p-4 bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 rounded-md">
            <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">Payment Gateway Not Configured</p>
            <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">Please replace placeholder values in `src/components/google-pay-button.tsx` to enable checkout.</p>
        </div>
    )
  }

  const paymentRequest: google.payments.api.PaymentDataRequest = {
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
            gateway: 'square',
            gatewayMerchantId: SQUARE_MERCHANT_ID, // Your Square Merchant ID
          },
        },
      },
    ],
    merchantInfo: {
      merchantId: SQUARE_MERCHANT_ID, // Your Square Merchant ID
      merchantName: 'Project Hub',
    },
    transactionInfo: {
      totalPriceStatus: 'FINAL',
      totalPrice: String(totalPrice),
      currencyCode: 'INR',
      countryCode: 'IN',
    },
  };

  const handleLoadPaymentData = (paymentData: google.payments.api.PaymentData) => {
    try {
        const paymentToken = paymentData.paymentMethodData.tokenizationData.token;
        checkoutWithToken(paymentToken);
    } catch (error) {
        console.error("Error processing payment data:", error);
        toast({
            title: "Payment Error",
            description: "Could not process payment information.",
            variant: "destructive",
        })
    }
  };

  return (
    <div className="w-full">
      <GooglePayButton
        environment="TEST" // Change to "PRODUCTION" for live payments
        paymentRequest={paymentRequest}
        onLoadPaymentData={handleLoadPaymentData}
        buttonType="checkout"
        buttonSizeMode="fill"
        existingPaymentMethodRequired={false}
        disabled={isCheckingOut}
        className="w-full"
      />
    </div>
  );
}

export { GooglePayButtonComponent as GooglePayButton }

