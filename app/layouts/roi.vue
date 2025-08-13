<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()

// 定义基础的导航项
const baseItems: NavigationMenuItem[] = [
  {
    label: '达人',
    to: '/roi/daren',
  },
  {
    label: '商家',
    to: '/roi/shangjia'
  },
  {
    label: '视频号',
    to: '/roi/shipinhao'
  },
  {
    label: '利润计算',
    to: '/roi/lirun'
  }
]

// 创建一个计算属性，根据当前路由动态生成最终的导航项
const items = computed(() => {
  // 从当前路由参数中获取 id
  const id = route.params.id

  // 确保 id 存在且为字符串
  if (id && typeof id === 'string') {
    return baseItems.map(item => ({
      ...item,
      // 将 id 作为 path 的一部分进行拼接
      to: `${item.to}/${id}`
    }))
  }

  // 如果 id 不存在，则返回原始的链接
  return baseItems
})
</script>

<template>
  <UNavigationMenu color="primary" variant="link" :items="items" class="w-full flex justify-center bg-gray-100" />
  <slot />
</template>
