<script setup lang="ts">
import { UButton, ULink } from '#components'

const links = [
  {
    title: 'GitHub',
    description: '查询抖音作品播放量（单个版本）',
    url: 'tik/videostatistics',
    icon: 'i-simple-icons-github'
  },
  {
    title: 'V2EX',
    description: '查询抖音作品播放量（单个版本）',
    url: 'https://v2ex.com',
    icon: 'i-heroicons-chat-bubble-left-right'
  },
  {
    title: '稀土掘金',
    description: '增加抖音视频播放量',
    url: 'https://juejin.cn',
    icon: 'i-heroicons-fire'
  }
]

definePageMeta({
  // middleware: ['authenticated']
})

const { user, clear: clearSession, loggedIn } = useUserSession()

async function logout() {
  await clearSession()
  await navigateTo('/login')
}

function login(){
  navigateTo('/login')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <div class="container mx-auto px-4 py-8 sm:py-12">
      <header class="text-center mb-8 sm:mb-12">
        <!-- <h1 class="text-4xl sm:text-5xl font-bold tracking-tight">链接中心</h1>
        <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">一些精选的常用链接和资源</p> -->
        <div v-if="loggedIn">          
          <ULink style="margin-right: 20px;">欢迎,{{ user || 'zhang' }}</ULink>
          <UButton @click="logout">注销</UButton>    
        </div>
        <div v-else>          
          <UButton @click="login">登录</UButton>    
        </div>
      </header>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        <NuxtLink v-for="link in links" :key="link.url" :to="link.url" class="block">
          <UCard
            class="h-full transition-all duration-300 ease-in-out hover:transform hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-gray-800/50"
            :ui="{ ring: 'dark:ring-gray-700', background: 'dark:bg-gray-800' }">
            <div class="flex items-start space-x-4">
              <!-- <UIcon :name="link.icon" class="text-3xl flex-shrink-0 text-gray-700 dark:text-gray-300 mt-1" /> -->
              <div>
                <!-- <h3 class="text-lg font-semibold">{{ link.title }}</h3> -->
                <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">{{ link.description }}</p>
              </div>
            </div>
          </UCard>
        </NuxtLink>
      </div>

      <footer class="text-center mt-12 text-gray-500 text-xs">
        <p>LiveHub &copy; 2025</p>
      </footer>
    </div>
  </div>
</template>