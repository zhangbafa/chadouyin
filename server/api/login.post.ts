
// import { createClient } from '@supabase/supabase-js'
export default defineEventHandler(async (event) => {
  const { nickname, password } = await readBody(event)
  // const supabaseKey = process.env.SUPABASE_KEY ?? ''
  // const supabaseUrl = process.env.SUPABASE_URL ?? ''
  // const supabase = createClient(supabaseUrl, supabaseKey)

  // let { data: users, error } = await supabase.from('users')
  //   .select('*')
  //   .eq('password', password)
  //   .eq('nickname', nickname)
  // // const hashedPassword = await hashPassword('user_password')

  // if (await verifyPassword(users?.password, password)) {
  //   await setUserSession(event, {
  //     user: {
  //       name: 'John Doe'
  //     }
  //   })
  //   return {}
  // }

  // throw createError({
  //   statusCode: 401,
  //   message: '凭据错误22'
  // })
})
