
'use server'

import { z } from 'zod'
import { cookies } from 'next/headers';
import admin from '@/lib/firebaseAdmin';

const schema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export async function signin(prevState: { errors?: { email?: string[], password?: string[], _form?: string[] } } | null, formData: FormData) {
  const validatedFields = schema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  // This is a simplified example and not recommended for production
  // You should use a proper authentication library to handle sign-in
  try {
    const user = await admin.auth().getUserByEmail(validatedFields.data.email);
    // In a real app, you'd verify the password here.
    // For this example, we'll just create a session cookie if the user exists.
    const sessionCookie = await admin.auth().createSessionCookie(user.uid, { expiresIn: 60 * 60 * 24 * 5 * 1000 });
    cookies().set('session', sessionCookie, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    return { message: 'Success!' };
  } catch (error) {
    if (error instanceof Error) {
      return {
        errors: { _form: [error.message] },
      };
    }
    return {
      errors: { _form: ['An unknown error occurred'] },
    }
  }
}
