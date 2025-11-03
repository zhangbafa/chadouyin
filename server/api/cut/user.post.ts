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
    console.error(`macid:${macid}`)


    if (!macid) {
        throw createError({ statusCode: 400, statusMessage: 'Link ID is required' })
    }

    if (!config.supabaseUrl || !config.supabaseKey) {
        console.error('Supabase configuration is missing in runtimeConfig.')
        throw createError({ statusCode: 500, statusMessage: 'Server configuration error' })
    }

    const supabase = createClient(config.supabaseUrl, config.supabaseKey)
    //
    const { data, error } = await supabase
        .from('cutusers')
        .select('*')
        .eq('macid', macid)
    if (error) {
        console.error(error)
        console.error('Supabase query error:', error.message)
        throw createError({ statusCode: 500, statusMessage: 'Database query failed11' })
    }
    if (data && data.length > 0) {
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
    }
    //
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

        return { success: true, insert: data,isExpired: false, status: '未过期' }
    } catch (e: any) {
        console.error('Failed to mark link as used:', e.message)
        throw createError({ statusCode: 500, statusMessage: 'An internal error occurred' })
    }
})
