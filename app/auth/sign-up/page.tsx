import { AuthForm } from '@/components/auth-form';

export const metadata = {
  title: 'Create Account - Kisan App',
  description: 'Sign up to manage your farm, track expenses, and get expert advice.',
};

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-[#f0f5f0] flex items-center justify-center px-4 py-12">
      <AuthForm initialMode="sign-up" />
    </main>
  );
}
