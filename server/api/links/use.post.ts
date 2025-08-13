import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const { id } = await readBody(event)

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Link ID is required' })
  }

  if (!config.supabaseUrl || !config.supabaseKey) {
    console.error('Supabase configuration is missing in runtimeConfig.')
    throw createError({ statusCode: 500, statusMessage: 'Server configuration error' })
  }

  const supabase = createClient(config.supabaseUrl, config.supabaseKey)

  try {
    const { data, error } = await supabase
      .from('links')
      .update({ use: true })
      .eq('id', id)
      .select()

    if (error) {
      console.error('Supabase update error:', error.message)
      throw createError({ statusCode: 500, statusMessage: 'Failed to update link status' })
    }

    return { success: true, updated: data }
  } catch (e: any) {
    console.error('Failed to mark link as used:', e.message)
    throw createError({ statusCode: 500, statusMessage: 'An internal error occurred' })
  }
})
