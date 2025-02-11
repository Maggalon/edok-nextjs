import { login, signup } from './actions'

export default function LoginPage() {
  return (
    <div className='h-screen mb-10 flex flex-col gap-4 justify-center items-center'>
        
        <form className='flex flex-col gap-4 items-center'>
          <div className='flex flex-col gap-1'>
              <label htmlFor="email_singin" className='font-bold'>Почта</label>
              <input id="email_signin" 
                  name="email_signin" 
                  type="email" 
                  required
                  className='bg-primary-100 w-72 text-lg rounded-lg p-3 focus:outline-none focus:border-2 focus:border-primary-600' />
          </div>

          <div className='flex flex-col gap-1'>
              <label htmlFor="password_signin" className='font-bold'>Пароль</label>
              <input id="password_signin" 
                  name="password_signin" 
                  type="password" 
                  required
                  className='bg-primary-100 w-72 text-lg rounded-lg p-3 focus:outline-none focus:border-2 focus:border-primary-600' />
          </div>
          
          <button formAction={login}
                  className='bg-primary-600 mt-5 text-white rounded-full w-48 py-3 text-xl'>Войти</button>
        </form>
        
        
        <div className='flex gap-2 items-center my-10'>
            <div className='w-32 h-1 bg-gray-300 rounded-full'></div>
            <div className='text-gray-400'>или</div>
            <div className='w-32 h-1 bg-gray-300 rounded-full'></div>
        </div>

        <form className='flex flex-col gap-4 items-center'>
          <div className='flex flex-col gap-1'>
              <label htmlFor="name_signup" className='font-bold'>Имя</label>
              <input id="name_signup" 
                  name="name_signup" 
                  type="name" 
                  required
                  className='bg-primary-100 w-72 text-lg rounded-lg p-3 focus:outline-none focus:border-2 focus:border-primary-600' />
          </div>

          <div className='flex flex-col gap-1'>
              <label htmlFor="email_signup" className='font-bold'>Почта</label>
              <input id="email_signup" 
                  name="email_signup" 
                  type="email" 
                  required
                  className='bg-primary-100 w-72 text-lg rounded-lg p-3 focus:outline-none focus:border-2 focus:border-primary-600' />
          </div>

          <div className='flex flex-col gap-1'>
              <label htmlFor="password_signup" className='font-bold'>Пароль</label>
              <input id="password_signup" 
                  name="password_signup" 
                  type="password" 
                  required
                  className='bg-primary-100 w-72 text-lg rounded-lg p-3 focus:outline-none focus:border-2 focus:border-primary-600' />
          </div>
          
          <button formAction={signup} 
                  className='bg-primary-600 mt-5 text-white rounded-full w-48 py-3 text-xl'>Создать аккаунт</button>
        </form>
        
    </div>
    // <form className='flex flex-col justify-center gap-2'>
    //   <label htmlFor="email">Email:</label>
    //   <input id="email" 
    //          name="email" 
    //          type="email" 
    //          required
    //          className='border-2 border-black' />
    //   <label htmlFor="password">Password:</label>
    //   <input id="password" 
    //          name="password" 
    //          type="password" 
    //          required
    //          className='border-2 border-black' />
    //   <button formAction={login}
    //           className='border-2'>Log in</button>
    //   <button formAction={signup}
    //           className='border-2'>Sign up</button>
    // </form>
  )
}