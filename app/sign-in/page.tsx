import { AuthForm } from '@/components/auth-form';

export const metadata = {
  title: 'Log In - Kisan App',
  description: 'Sign in to access your farm management dashboard.',
};

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-[#f0f5f0] flex items-center justify-center px-4 py-12">
      <AuthForm initialMode="sign-in" />
    </main>
  );
}
