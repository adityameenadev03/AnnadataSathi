import { auth } from '@/lib/auth/server';

export default auth.middleware({
  // Redirects unauthenticated users to sign-in page
  loginUrl: '/sign-in',
});

export const config = {
  matcher: [
    // Protected routes requiring authentication
    '/account/:path*',
    // Add more protected routes here, e.g.:
    // '/dashboard/:path*',
  ],
};
