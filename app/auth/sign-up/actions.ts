'use server';

import { auth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';

export async function signUpWithEmail(
  _prevState: { error: string } | null,
  formData: FormData
) {
  const email = formData.get('email') as string;
  const name = formData.get('name') as string;
  const password = formData.get('password') as string;

  if (!email || !password || !name) {
    return { error: 'Please provide all required fields.' };
  }

  // 1. Create the user in Neon Auth
  const { data: result, error } = await auth.signUp.email({
    email,
    name,
    password,
  });

  if (error) {
    return { error: error.message || 'Failed to create account in auth service' };
  }

  // 2. Sync the user to our public.user table
  if (result?.user) {
    try {
      await prisma.user.create({
        data: {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
        },
      });
    } catch (dbError) {
      console.error("Database sync failed:", dbError);
      return { error: "Created auth account but failed to sync user to database." };
    }
  }

  redirect('/');
}
