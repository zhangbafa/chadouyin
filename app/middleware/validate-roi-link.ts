export default defineNuxtRouteMiddleware(async (to) => {
  // 我们只关心 /roi/ 路径下且带有 id 参数的路由
  if (!to.path.startsWith('/roi/') || !to.params.id) {
    return
  }

  const { id } = to.params

  // 确保 id 是一个字符串，而不是数组
  if (Array.isArray(id)) {
    return abortNavigation(createError({ statusCode: 400, message: 'Invalid ID format', fatal: true }))
  }

  try {
    const { valid } = await $fetch('/api/validate-link', {
      method: 'POST',
      body: { id }
    })

    if (!valid) {
      // 如果 API 返回校验失败，中断导航并显示 404 错误页
      return abortNavigation(
        createError({ statusCode: 404, statusMessage: 'Page Not Found', fatal: true })
      )
    }
    // 如果 valid 为 true，则什么也不做，正常继续导航

  } catch (error) {
    console.error('Validation request failed:', error)
    // 如果 API 调用本身出错（例如服务器500错误），也中断导航并显示错误页
    return abortNavigation(
      createError({ statusCode: 500, statusMessage: 'Could not validate page', fatal: true })
    )
  }
})
