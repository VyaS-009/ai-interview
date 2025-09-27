
'use server'

import { z } from 'zod'
import admin from '@/lib/firebaseAdmin';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})

export async function signup(prevState: { errors?: { name?:string[], email?: string[], password?: string[], _form?: string[] } } | null, formData: FormData) {
  const validatedFields = schema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  try {
    await admin.auth().createUser({
      email: validatedFields.data.email,
      password: validatedFields.data.password,
      displayName: validatedFields.data.name,
    });
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
