<script setup lang="ts">
import { reactive, ref } from 'vue'
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
    middleware:['validate-tik-link']
})
// 为页面添加 SEO 相关的元数据
useSeoMeta({
  title: '单个作品播放数据查询 - liveHub',
  description: '输入一个或多个作品ID，快速查询并分析视频的播放量、点赞、评论等关键数据统计。',
  ogTitle: '单个作品播放数据查询 - liveHub',
  ogDescription: '输入一个或多个作品ID，快速查询并分析视频的播放量、点赞、评论等关键数据统计。',
  twitterCard: 'summary_large_image',
})


// Define the validation schema using Zod
const schema = z.object({
    ids: z.string().min(1, '作品ID不能为空，请输入至少一个ID。')
})

// Define the type for the schema output
type Schema = z.output<typeof schema>

// Reactive state for the form
const formState = reactive<Partial<Schema>>({
    ids: ''
})

// Refs for loading state, API result, and error handling
const isLoading = ref(false)
const apiResult = ref<any>(null)
const apiError = ref<string | null>(null)

// Function to handle form submission
async function handleSubmit(event: FormSubmitEvent<Schema>) {
    // Clear previous results and errors
    apiResult.value = null
    apiError.value = null
    // Set loading state
    isLoading.value = true

    try {
        const response = await $fetch('/api/videostatistics', {
          method: 'POST',
          body: {
            ids: event.data.ids
          }
        })
        console.log(response)
        apiResult.value = response
    } catch (e: any) {
        // Handle any errors during the API call
        apiError.value = e.message || 'An unknown error occurred.'
    } finally {
        // Reset loading state
        isLoading.value = false
    }
}
</script>

<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
        <div class="w-full mx-auto">
            <header class="mb-6">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">单个作品播放数</h1>
            </header>

            <UForm :schema="schema" :state="formState" class="space-y-6" @submit="handleSubmit">
                <UFormField label="作品ID" name="ids" required>
                    <UTextarea v-model="formState.ids" placeholder="请输入一个或多个作品ID，每行一个。" :rows="6" size="lg"
                        class="w-full" />
                    <div class="tips mt-2 text-xs text-gray-500 dark:text-gray-400">
                        支持多个视频id，用逗号隔开即可，不能超过2个，单个也可以，则无需逗号
                    </div>

                </UFormField>

                <div class="flex flex-col space-y-4">
                    <UButton type="submit" :loading="isLoading" block size="lg">
                        <span v-if="isLoading">正在查询...</span>
                        <span v-else>查询</span>
                    </UButton>

                    <UButton to="/" variant="outline" block size="lg" icon="i-heroicons-arrow-left-20-solid">
                        返回首页
                    </UButton>
                </div>
            </UForm>

            <!-- Results Section v-if="apiResult || apiError" -->
            <div class="mt-8">
                <UDivider label="查询结果" class="my-4" />

                <!-- Error Display -->
                <UAlert v-if="apiError" icon="i-heroicons-exclamation-triangle" color="red" variant="soft" title="查询出错"
                    :description="apiError" />

                <!-- Success Display -->
                <div v-if="apiResult" class="space-y-3">
                    <div v-for="stat in apiResult.stats" :key="stat.label"
                        class="flex items-center justify-between w-full border-b border-gray-200 dark:border-gray-700 py-3">
                        <span class="text-xl font-semibold text-gray-900 dark:text-white">
                            {{ new Intl.NumberFormat().format(stat.value)}}</span>
                        <span class="text-sm text-gray-600 dark:text-gray-400">{{ stat.label }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
