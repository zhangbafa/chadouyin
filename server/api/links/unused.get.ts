import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  if (!config.supabaseUrl || !config.supabaseKey) {
    console.error('Supabase configuration is missing in runtimeConfig.')
    throw createError({ statusCode: 500, statusMessage: 'Server configuration error' })
  }

  const supabase = createClient(config.supabaseUrl, config.supabaseKey)

  try {
    // 从 'links' 表中选择 id, use, link 字段
    // 条件为 'use' 字段不为 true (即为 false 或 null)
    // 最多返回 10 条记录
    const { data, error } = await supabase
      .from('links')
      .select('id,use,link')
      .not('use', 'is', true)
      .limit(10)

    if (error) {
      console.error('Supabase query error:', error.message)
      throw createError({ statusCode: 500, statusMessage: 'Database query failed' })
    }

    return data
  } catch (e: any) {
    console.error('Failed to fetch unused links:', e.message)
    throw createError({ statusCode: 500, statusMessage: 'An internal error occurred' })
  }
})
