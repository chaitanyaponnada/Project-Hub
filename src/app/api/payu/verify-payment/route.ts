
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import crypto from 'crypto';

// This is a simplified verification handler.
// In a real application, you would also verify the transaction with PayU's API
// before marking the order as complete in your database.
export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries());
    const salt = process.env.PAYU_SALT || '';
    const key = process.env.PAYU_KEY || '';

    const status = data.status;
    const txnid = data.txnid;
    
    const host = headers().get('host');
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';

    if (status === 'success') {
        const hashString = `${salt}|${data.status}|||||||||||${data.email}|${data.firstname}|${data.productinfo}|${data.amount}|${data.txnid}|${key}`;
        const generatedHash = crypto.createHash('sha512').update(hashString).digest('hex');
        
        if (generatedHash === data.hash) {
            // Hash matches, payment is likely successful.
            // Redirect to a success page.
            return NextResponse.redirect(`${protocol}://${host}/checkout?status=success&txnid=${txnid}`);
        } else {
            // Hash mismatch, potential tampering.
            return NextResponse.redirect(`${protocol}://${host}/checkout?status=cancelled&error=hash_mismatch`);
        }
    } else {
        // Payment failed or was cancelled by the user.
        return NextResponse.redirect(`${protocol}://${host}/checkout?status=cancelled&txnid=${txnid}`);
    }
}
