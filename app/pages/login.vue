<script setup lang="ts">
const { loggedIn, user, fetch: refreshSession } = useUserSession()
const credentials = reactive({
  email: '',
  password: '',
})
async function login() {
  $fetch('/api/login', {
    method: 'POST',
    body: credentials
  })
  .then(async () => {
    // 在客户端刷新会话并重定向到主页
    await refreshSession()
    await navigateTo('/')
  })
  .catch((e) => console.log(e))
}
</script>

<template>
  <form @submit.prevent="login">
    <input v-model="credentials.email" type="text" placeholder="电子邮件" />
    <input v-model="credentials.password" type="text" placeholder="密码" />
    <button type="submit">登录</button>
  </form>
</template>
