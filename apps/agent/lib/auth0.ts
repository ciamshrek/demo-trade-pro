import { Auth0Client } from "@auth0/nextjs-auth0/server";

// Server-side Auth0 client instance
export const auth0 = new Auth0Client({
  authorizationParameters: {
    audience: process.env.AUTH0_AUDIENCE,
    scope: process.env.API_DEFAULT_SCOPES
  }
});

/**
 * Helper to get delegated access token for the API
 * Uses the OIDC connection to get a token for the stock trading API
 */
export async function getAccessTokenForConnection({ connection }: { connection: string }): Promise<string | undefined> {
  try {

    if (!auth0.getSession()) {
      return undefined;
    }


    const token = await auth0.getAccessTokenForConnection({ connection });

    if (!token.token) {
      throw new Error("Access token is not available in Auth0 Token Vault");
    }

    return token.token;

  } catch (error) {

    console.error('Failed to get stored access token:', error);
    throw error;
  }
}
