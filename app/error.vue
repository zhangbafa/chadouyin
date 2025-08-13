<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError
})

// 根据错误代码生成更友好的提示信息
const errorTitle = computed(() => {
  if (props.error?.statusCode === 404) {
    return `页面未找到`
  }
  return `发生错误`
})

const errorMessage = computed(() => {
  if (props.error?.statusCode === 404) {
    return `抱歉，我们无法找到您要访问的页面。它可能已被移动、删除或不存在。`
  }
  return props.error?.statusMessage || '服务器遇到了一些问题，请稍后重试。'
})

// Nuxt 提供的标准方法，用于清除错误并重定向
const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
    <div class="text-center p-8 max-w-md w-full">
      <div class="flex justify-center items-center mb-4">
        <span class="text-9xl font-bold text-primary">{{ error?.statusCode }}</span>
      </div>
      <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">{{ errorTitle }}</h1>
      <p class="mt-2 text-gray-600 dark:text-gray-400">
        {{ errorMessage }}
      </p>
      <div class="mt-8">
        <UButton 
          @click="handleError" 
          size="lg" 
          variant="solid"
          icon="i-heroicons-arrow-right-20-solid"
          trailing
        >
          返回首页
        </UButton>
      </div>
    </div>
  </div>
</template>