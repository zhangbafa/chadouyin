import { createClient } from '@supabase/supabase-js'
import dayjs from 'dayjs'
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const query = getQuery(event)
  if (!config.supabaseUrl || !config.supabaseKey) {
    console.error('Supabase configuration is missing in runtimeConfig.')
    throw createError({ statusCode: 500, statusMessage: 'Server configuration error' })
  }

  const supabase = createClient(config.supabaseUrl, config.supabaseKey)

  try {
    
    const { data, error } = await supabase
      .from('cutusers')
      .select('*')
      .eq('macid', query.macid)

    if (error) {
      console.error('Supabase query error:', error.message)
      throw createError({ statusCode: 500, statusMessage: 'Database query failed' })
    }
    
    // 检查是否有数据
    if (!data || data.length === 0) {
      return {
        success: false,
        message: '用户记录不存在'
      }
    }
    
    const indate = dayjs(data[0].indate).startOf('day')
    // 获取当前日期（忽略时分秒）
    const today = dayjs().startOf('day')
    
    // 判断是否过期：当前日期 > indate → 过期
    const isExpired = today.isAfter(indate)
    return {
      success: true,
      ...data[0],
      isExpired, // 新增字段：true=过期，false=未过期（含当天）
      status: isExpired ? '已过期' : '未过期' // 可选：更直观的状态文字
    }
  } catch (e: any) {
    console.error('Failed to fetch unused links:', e.message)
    throw createError({ statusCode: 500, statusMessage: 'An internal error occurred' })
  }
})
