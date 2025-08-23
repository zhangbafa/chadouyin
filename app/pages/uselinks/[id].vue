<script setup lang="ts">
import { useToast } from '#imports'
definePageMeta({
  middleware:['validate-use-links']
})
// 使用 useAsyncData 来获取数据，这在服务器端和客户端都能很好地工作
const { data: links, pending, error, refresh } = await useAsyncData(
  'unused-links', 
  () => $fetch('/api/links/unused'),
  { lazy: true } // lazy: true 表示在客户端导航时，不会阻塞页面渲染
)

// 用于跟踪正在更新的链接 ID，以便只显示对应按钮的加载状态
const updatingIds = ref(new Set<number>())

// 初始化 Toast 通知
const toast = useToast()

// 点击“使用”按钮时调用的函数
const markAsUsed = async (id: number, linkText: string) => { // 增加 linkText 参数
  updatingIds.value.add(id) // 将当前 ID 加入 Set，显示加载状态
  try {
    await $fetch('/api/links/use', {
      method: 'POST',
      body: { id }
    })
    
    // 成功更新后，从本地列表中移除该项，而不是刷新整个列表
    if (links.value) {
      links.value = links.value.filter(link => link.id !== id)
    }

    // 复制 linkText 到剪贴板
    if (navigator.clipboard && linkText) {
      const text = `https://cdy.wolewan.com/roi/daren/${linkText}`
      await navigator.clipboard.writeText(text)
      toast.add({ title: '链接已复制到剪贴板', icon: 'i-heroicons-check-circle', color: 'green' })
    } else {
      toast.add({ title: '复制失败', description: '您的浏览器不支持剪贴板操作或链接为空。', icon: 'i-heroicons-exclamation-circle', color: 'red' })
    }

  } catch (err: any) {
    console.error('Failed to mark link as used:', err)
    toast.add({ title: '操作失败', description: err.data?.message || '更新链接状态失败。', icon: 'i-heroicons-exclamation-circle', color: 'red' })
  } finally {
    updatingIds.value.delete(id) // 从 Set 中移除 ID，结束加载状态
  }
}
</script>

<template>
  <div class="p-4 sm:p-6 lg:p-8">
    <div class="max-w-4xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">可用链接列表</h1>
        <UButton 
          icon="i-heroicons-arrow-path" 
          :loading="pending" 
          @click="refresh"
        >
          刷新
        </UButton>
      </div>

      <!-- 加载状态 -->
      <div v-if="pending && !links?.length" class="text-center py-10">
        <p>正在加载数据...</p>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="p-4 text-red-700 bg-red-100 rounded-lg">
        <p>加载数据时出错：{{ error.message }}</p>
      </div>

      <!-- 数据为空 -->
      <div v-else-if="!links?.length" class="text-center py-10">
        <p>没有可用的链接了。</p>
      </div>

      <!-- 数据列表 -->
      <div v-else class="space-y-3">
        <UCard v-for="link in links" :key="link.id" :ui="{ body: { padding: 'px-4 py-3 sm:p-4' } }">
          <div class="flex justify-between items-center">
            <p class="text-gray-800 dark:text-gray-200 font-mono truncate pr-4" :title="link.link">
              {{ link.link }}
            </p>
            <UButton 
              @click="markAsUsed(link.id, link.link)" 
              :loading="updatingIds.has(link.id)" 
              variant="soft"
            >
              使用
            </UButton>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>
