'use server';

import { auth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';

export async function signInWithEmail(
  _prevState: { error: string } | null,
  formData: FormData
) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // 1. Authenticate with Neon Auth
  const { data: result, error } = await auth.signIn.email({
    email,
    password,
  });

  if (error) {
    return { error: error.message || 'Failed to sign in. Try again.' };
  }

  // 2. Sync to DB if somehow missing
  if (result?.user) {
    await prisma.user.upsert({
      where: { id: result.user.id },
      update: { name: result.user.name, email: result.user.email },
      create: { 
        id: result.user.id, 
        name: result.user.name, 
        email: result.user.email 
      },
    });
  }

  redirect('/');
}
