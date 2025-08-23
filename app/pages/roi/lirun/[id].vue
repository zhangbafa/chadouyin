<template>
    <div class="container mx-auto p-4">
        <div class="text-center my-5">
            <!-- <h1 class="text-3xl font-bold text-primary">投放利润计算器</h1>
            <p class="text-gray-500 dark:text-gray-400 mt-2">专业计算电商投放最佳出价策略</p> -->
        </div>
        <UForm :schema="schema" :state="formState" class="space-y-4" @submit="handleSubmit">
            <div class="grid grid-cols-2 md:grid-cols-2 gap-10">
                <UFormField label="广告消耗" name="price">
                    <UInput v-model="formState.price" type="number" :ui="{ trailing: 'pointer-events-none' }"
                        class="w-full" size="xl" placeholder="请输入">
                        <template #trailing>
                            <div id="character-count" class="text-xs text-muted tabular-nums " aria-live="polite"
                                role="status">
                                元
                            </div>
                        </template>
                    </UInput>
                </UFormField>

                <UFormField label="成交金额" name="price6">
                    <UInput v-model="formState.price6" type="number" :ui="{ trailing: 'pointer-events-none' }"
                        class="w-full" size="xl" placeholder="请输入">
                        <template #trailing>
                            <div id="character-count" class="text-xs text-muted tabular-nums " aria-live="polite"
                                role="status">
                                元
                            </div>
                        </template>
                    </UInput>
                </UFormField>
                <UFormField label="佣金率" name="commissionRate">
                    <UInput v-model="formState.commissionRate" type="number" :ui="{ trailing: 'pointer-events-none' }"
                        class="w-full" size="xl">
                        <template #trailing>
                            <div id="character-count" class="text-xs text-muted tabular-nums " aria-live="polite"
                                role="status">
                                %
                            </div>
                        </template>
                    </UInput>
                </UFormField>
                <UFormField label="退货率" name="refundRate">
                    <UInput v-model="formState.refundRate" type="number" :ui="{ trailing: 'pointer-events-none' }"
                        class="w-full" size="xl">
                        <template #trailing>
                            <div id="character-count" class="text-xs text-muted tabular-nums " aria-live="polite"
                                role="status">
                                %
                            </div>
                        </template>
                    </UInput>
                </UFormField>
                <UFormField label="平台费" name="platformFee">
                    <UInput v-model="formState.platformFee" type="number" :ui="{ trailing: 'pointer-events-none' }"
                        class="w-full" size="xl">
                        <template #trailing>
                            <div id="character-count" class="text-xs text-muted tabular-nums " aria-live="polite"
                                role="status">
                                %
                            </div>
                        </template>
                    </UInput>
                </UFormField>
            </div>

            <UButton type="submit" color="primary" block size="xl" :loading="loading">计算结果</UButton>

            <div class="text-center text-sm text-gray-500 dark:text-gray-400" v-if="calculateTime">
                {{ calculateTime }}
            </div>
        </UForm>
        <div class="mt-10">
            <h2 class="text-xl font-semibold flex items-center justify-start mb-4">
                <UIcon name="i-heroicons-chevron-down" class="mr-2" />
                计算结果
            </h2>
            <div class="grid grid-cols-2 md:grid-cols-2 gap-4">
                <UCard>
                    <p class="text-sm text-gray-500 dark:text-gray-400">预估利润</p>
                    <p class="text-3xl font-bold text-orange-500 mt-3 show-number">{{ estimatedSettlement.toFixed(2) }}<span
                            class="text-sm font-normal ml-1">元</span></p>
                </UCard>
                <UCard>
                    <p class="text-sm text-gray-500 dark:text-gray-400">结算利润</p>
                    <p class="text-3xl font-bold text-orange-500 mt-3 show-number">{{ estimatedBreakEvenROI.toFixed(2) }}<span
                            class="text-sm font-normal ml-1">元</span></p>
                </UCard>

            </div>
            <div class="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
                <p><b> 注：商家在ROI商家版计算佣金率，商家平台费按实际填写(如：5%)。</b></p>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
definePageMeta({
    layout:'roi',
    middleware: 'validate-roi-link'
})
const schema = z.object({
    price: z.number('必须输入大于0的数字').positive('必须输入大于0的数字'),
    commissionRate: z.number('必须输入大于0的数字'),
    price6: z.number('必须输入大于0的数字').positive('必须输入大于0的数字'),
    refundRate: z.number('必须输入大于0的数字').positive('必须输入大于0的数字'),
    platformFee: z.number('必须输入大于0的数字').positive('必须输入大于0的数字'),
});
type Schema = z.output<typeof schema>
const formState = reactive<Partial<Schema>>({
    price: undefined,
    commissionRate: undefined,
    price6: undefined,
    refundRate: 5,
    platformFee: 5
})

// 添加loading状态
const loading = ref(false)

// 计算结果
const results = ref({
    calculated: false,
    estimatedSettlement: 0,
    estimatedBreakEvenROI: 0,
    calculateTime: ''
})

// 为了兼容现有模板，创建响应式引用
const estimatedSettlement = computed(() => results.value.estimatedSettlement)
const estimatedBreakEvenROI = computed(() => results.value.estimatedBreakEvenROI)
const calculateTime = computed(() => results.value.calculateTime)

const handleSubmit = async (event: FormSubmitEvent<Schema>) => {
    loading.value = true
    try {
        // 1. 验证表单数据
        const validationResult = schema.safeParse(formState)
        if (!validationResult.success) {
            console.error("表单验证失败：", validationResult.error)
            loading.value = false
            return
        }

        // 2. 调用服务端 API 进行计算
        const data = await $fetch('/api/roi/lirun', {
            method: 'POST',
            body: validationResult.data
        })

        // 3. 更新结果
        results.value = data
        
    } catch (error) {
        console.error("计算出错：", error)
        // 显示用户友好的错误信息
        if (error.statusCode === 400) {
            console.error("输入数据有误，请检查填写的信息")
        } else if (error.statusCode === 500) {
            console.error("服务器计算错误，请稍后重试")
        } else {
            console.error("网络连接错误，请检查网络后重试")
        }
    } finally {
        loading.value = false
    }
}

</script>

<style scoped>
.container {
    max-width: 100%;
}
</style>