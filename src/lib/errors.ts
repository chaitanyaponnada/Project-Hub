
import { auth } from './firebase';

export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';
  requestResourceData?: any;
};

export class FirestorePermissionError extends Error {
  public readonly context: SecurityRuleContext;
  public readonly user: any;

  constructor(context: SecurityRuleContext) {
    const user = auth.currentUser;
    const userInfo = user
      ? {
          uid: user.uid,
          token: {
            name: user.displayName,
            picture: user.photoURL,
            email: user.email,
            email_verified: user.emailVerified,
            phone_number: user.phoneNumber,
            // Replicating Firebase Auth token structure for consistency
            firebase: {
              identities: user.providerData.reduce((acc, provider) => {
                if (provider.providerId.includes('.com')) {
                  // @ts-ignore
                  acc[provider.providerId] = [provider.uid];
                }
                return acc;
              }, {}),
              sign_in_provider: user.providerData[0]?.providerId || 'custom',
            },
          },
        }
      : null;

    const requestDetails = {
      auth: userInfo,
      method: context.operation,
      path: `/databases/(default)/documents${context.path.startsWith('/') ? '' : '/'}${context.path}`,
      request: context.requestResourceData ? { resource: { data: context.requestResourceData } } : undefined,
    };

    const message = `FirestoreError: Missing or insufficient permissions: The following request was denied by Firestore Security Rules:\n${JSON.stringify(requestDetails, null, 2)}`;
    
    super(message);
    this.name = 'FirestorePermissionError';
    this.context = context;
    this.user = userInfo;
    
    // This is to make the error visible in the Next.js overlay
    this.stack = '';
  }
}
