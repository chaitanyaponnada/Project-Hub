
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { txnid, amount, productinfo, firstname, email, phone } = await req.json();

    const key = process.env.PAYU_KEY;
    const salt = process.env.PAYU_SALT;

    if (!key || !salt) {
      throw new Error('PayU credentials are not configured in environment variables.');
    }
    
    // IMPORTANT: The success and failure URLs need to be absolute paths for redirection.
    // Ensure you update this with your actual production domain later.
    const host = req.headers.get('host');
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';

    const surl = `${protocol}://${host}/api/payu/verify-payment?status=success`;
    const furl = `${protocol}://${host}/api/payu/verify-payment?status=failure`;

    // The hash string must be in the exact format specified by PayU.
    const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${salt}`;
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');

    const payload = {
      key,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      phone,
      surl,
      furl,
      hash,
    };

    return NextResponse.json(payload);
  } catch (error: any) {
    console.error('PayU initiation failed:', error);
    return NextResponse.json({ message: 'An error occurred during payment initiation.', error: error.message }, { status: 500 });
  }
}
