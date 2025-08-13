export default defineNuxtRouteMiddleware(async (to) => {
  // 我们只关心 /roi/ 路径下且带有 id 参数的路由
  if (!to.path.startsWith('/tik/') || !to.params.id) {
    return
  }

  const { id } = to.params

  // 确保 id 是一个字符串，而不是数组
  if (id!='facai') {
    return abortNavigation(createError({ statusCode: 400, message: 'Invalid ID format', fatal: true }))
  }
})
