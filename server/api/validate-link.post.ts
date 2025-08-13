import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const { id } = await readBody(event)
  // 从事件上下文中获取运行时配置，这比全局 useRuntimeConfig() 更高效
  const config = useRuntimeConfig(event)

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID is required' })
  }

  // 确保 Supabase URL 和 Key 已在运行时配置中设置
  if (!config.supabaseUrl || !config.supabaseKey) {
    console.error('Supabase configuration is missing in runtimeConfig.')
    throw createError({ statusCode: 500, statusMessage: 'Server configuration error' })
  }

  const supabase = createClient(config.supabaseUrl, config.supabaseKey)

  try {
    // 我们只需要知道是否存在，所以只选择一个字段并限制为一行
    const { data, error } = await supabase
      .from('links')      // 你的表名
      .select('link')    // 你的字段名
      .eq('link', id)    // 查询条件
      .maybeSingle()     // 最多返回一行，如果没有找到也不会报错

    // 如果 Supabase 返回了除“未找到行”之外的错误，则抛出服务器错误
    if (error) {
      console.error('Supabase query error:', error.message)
      throw createError({ statusCode: 500, statusMessage: 'Database query failed' })
    }

    // 如果 data 不为 null，说明找到了匹配的行
    return { valid: !!data }
  } catch (e: any) {
    console.error('Validation logic failed:', e.message)
    throw createError({ statusCode: 500, statusMessage: 'An internal error occurred' })
  }
})
