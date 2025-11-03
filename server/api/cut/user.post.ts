import { createClient } from '@supabase/supabase-js'
import dayjs from 'dayjs'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event)
    // 获取当前日期
    const currentDate = dayjs()

    // 计算 30 天后的日期
    const futureDate = currentDate.add(30, 'day')
    const body = await readBody(event)

    const macid = body.macid
    if (!macid) {
        throw createError({ statusCode: 400, statusMessage: 'Link ID is required' })
    }

    if (!config.supabaseUrl || !config.supabaseKey) {
        console.error('Supabase configuration is missing in runtimeConfig.')
        throw createError({ statusCode: 500, statusMessage: 'Server configuration error' })
    }

    const supabase = createClient(config.supabaseUrl, config.supabaseKey)

    try {
        const { data, error } = await supabase
            .from('cutusers')
            .insert([
                { macid: macid, indate: futureDate },
            ])
            .select()


        if (error) {
            console.error('Supabase update error:', error.message)
            throw createError({ statusCode: 500, statusMessage: 'Failed to update link status' })
        }

        return { success: true, insert: data }
    } catch (e: any) {
        console.error('Failed to mark link as used:', e.message)
        throw createError({ statusCode: 500, statusMessage: 'An internal error occurred' })
    }
})
