'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // // type-casting here for convenience
  // // in practice, you should validate your inputs
  const data = {
    email: formData.get('email_signin') as string,
    password: formData.get('password_signin') as string,
  }
  console.log(data);
  

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // // type-casting here for convenience
  // // in practice, you should validate your inputs
  const data = {
    email: formData.get('email_signup') as string,
    password: formData.get('password_signup') as string,
    options: {
      data: {
        name: formData.get('name_signup') as string,
      }
    }
  }
  console.log(data);
  
  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}