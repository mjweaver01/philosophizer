import {
  createUser,
  authenticateUser,
  getUserFromRequest,
} from '../utils/auth';

/**
 * POST /auth/signup - Create a new user account
 */
export const signup = async (req: Request) => {
  try {
    const body = (await req.json()) as { email: string; password: string };

    if (!body.email || !body.password) {
      return new Response(
        JSON.stringify({
          error: 'Missing required fields',
          message: 'Email and password are required',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return new Response(
        JSON.stringify({
          error: 'Invalid email',
          message: 'Please provide a valid email address',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate password length
    if (body.password.length < 6) {
      return new Response(
        JSON.stringify({
          error: 'Invalid password',
          message: 'Password must be at least 6 characters long',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    try {
      const user = await createUser(body.email, body.password);
      const { generateToken } = await import('../utils/auth');
      const token = generateToken(user);

      return new Response(
        JSON.stringify({
          user: {
            id: user.id,
            email: user.email,
            createdAt: user.createdAt,
          },
          token,
        }),
        {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    } catch (error: any) {
      // Handle duplicate email error
      if (error.code === '23505') {
        return new Response(
          JSON.stringify({
            error: 'Email already exists',
            message: 'An account with this email already exists',
          }),
          {
            status: 409,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error('Signup error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

/**
 * POST /auth/login - Authenticate a user
 */
export const login = async (req: Request) => {
  try {
    const body = (await req.json()) as { email: string; password: string };

    if (!body.email || !body.password) {
      return new Response(
        JSON.stringify({
          error: 'Missing required fields',
          message: 'Email and password are required',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const result = await authenticateUser(body.email, body.password);

    if (!result) {
      return new Response(
        JSON.stringify({
          error: 'Invalid credentials',
          message: 'Invalid email or password',
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        user: {
          id: result.user.id,
          email: result.user.email,
          createdAt: result.user.createdAt,
        },
        token: result.token,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

/**
 * GET /auth/me - Get current user
 */
export const me = async (req: Request) => {
  try {
    const user = await getUserFromRequest(req);

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

    return new Response(
      JSON.stringify({
        user: {
          id: user.id,
          email: user.email,
          createdAt: user.createdAt,
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Get user error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

export const auth = {
  '/auth/signup': { POST: signup },
  '/auth/login': { POST: login },
  '/auth/me': { GET: me },
};
