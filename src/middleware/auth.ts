import { getUserFromRequest, type User } from '../utils/auth';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

/**
 * Middleware to require authentication
 * Returns a 401 response if the user is not authenticated
 */
export async function requireAuth(
  request: Request
): Promise<{ user: User } | Response> {
  const user = await getUserFromRequest(request);

  if (!user) {
    return new Response(
      JSON.stringify({
        error: 'Unauthorized',
        message: 'Authentication required',
      }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  return { user };
}

/**
 * Middleware to optionally get the authenticated user
 * Does not return an error if the user is not authenticated
 */
export async function optionalAuth(request: Request): Promise<User | null> {
  return getUserFromRequest(request);
}
