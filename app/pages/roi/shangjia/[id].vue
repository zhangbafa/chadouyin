<template>
    <div class="container mx-auto p-4">
        <div class="text-center my-5">
            <!-- <h1 class="text-3xl font-bold text-primary">ROI投放计算器商家版</h1>
            <p class="text-gray-500 dark:text-gray-400 mt-2">专业计算电商投放最佳出价策略</p> -->
        </div>
        <UForm :schema="schema" :state="formState" class="space-y-4" @submit="handleSubmit">
            <div class="grid grid-cols-2 md:grid-cols-2 gap-10">
                <UFormField label="商品价格" name="price">
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

                <UFormField label="成本价" name="commissionRate">
                    <UInput v-model="formState.commissionRate" type="number" :ui="{ trailing: 'pointer-events-none' }"
                        class="w-full" size="xl" placeholder="请输入">
                        <template #trailing>
                            <div id="character-count" class="text-xs text-muted tabular-nums " aria-live="polite"
                                role="status">
<<<<<<< HEAD
                                元
=======
                                %
>>>>>>> 4cfc3dd437120d342a140997b63beb890f992cff
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

<<<<<<< HEAD
            <UButton type="submit" color="primary" block size="xl" :loading="loading">计算结果</UButton>
=======
            <UButton type="submit" color="primary" block size="xl">计算结果</UButton>
>>>>>>> 4cfc3dd437120d342a140997b63beb890f992cff

            <div class="text-center text-sm text-gray-500 dark:text-gray-400" v-if="calculateTime">
                {{ calculateTime }}
            </div>
        </UForm>
        <div class="mt-10">
            <h2 class="text-xl font-semibold  flex items-center justify-start mb-4">
                <UIcon name="i-heroicons-chevron-down" class="mr-2" />
                计算结果
            </h2>
            <div class="grid grid-cols-2 md:grid-cols-2 gap-4">
                <UCard>
                    <p class="text-sm text-gray-500 dark:text-gray-400">预估利润</p>
                    <p class="text-2xl font-bold text-orange-500 mt-3 show-number">{{ estimatedCommission.toFixed(2) }}<span
                            class="text-sm font-normal ml-1">元</span></p>
                </UCard>
                <UCard>
                    <p class="text-sm text-gray-500 dark:text-gray-400">结算利润</p>
                    <p class="text-2xl font-bold text-orange-500 mt-3 show-number">{{ estimatedSettlement.toFixed(2) }}<span
                            class="text-sm font-normal ml-1">元</span></p>
                </UCard>
                <UCard>
                    <p class="text-sm text-gray-500 dark:text-gray-400">毛利润率</p>
                    <p class="text-2xl font-bold mt-3 show-number">{{ yongjinlv.toFixed(2) || '-' }}
                        <span class="text-sm font-normal ml-1">%</span>
                    </p>
                </UCard>
                <UCard>
                    <p class="text-sm text-gray-500 dark:text-gray-400">纯利润率</p>
                    <p class="text-2xl font-bold mt-3 show-number">{{ chunlirunlv.toFixed(2) || '-' }}
                        <span class="text-sm font-normal ml-1">%</span>
                    </p>
                </UCard>
                <UCard>
                    <p class="text-sm text-gray-500 dark:text-gray-400">预估ROI</p>
                    <p class="text-2xl font-bold mt-3 show-number">{{ estimatedBreakEvenROI.toFixed(2) }}</p>
                </UCard>
                <UCard>
                    <p class="text-sm text-gray-500 dark:text-gray-400">保本ROI</p>
                    <p class="text-2xl font-bold mt-3 show-number">{{ estimatedSettlementBreakEvenROI.toFixed(2) }}</p>
                </UCard>                
            </div>
            <div class="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4 mb-2 text-center">
                <UCard>
                    <div class="text-center">
                        <p class="text-base font-normal ">建议目标ROI出价</p>
                        <p class="mt-2 text-4xl font-bold tracking-tight show-number text-orange-500">
                            {{ recommendROI.toFixed(2) }}
                        </p>
                    </div>
                </UCard>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
                <UCard :ui="{ body: 'p-0 sm:p-6' }">
                    <template #header>
                        <p class="text-lg font-semibold ">千川全域目标ROI出价</p>
                    </template>
                    <div class="space-y-2">
                        <div class="flex justify-between border-b border-gray-200 p-4"
                            v-for="(price, index) in roiPrices" :key="'roi-' + index">
                            <span>ROI*{{ (0.5 + index * 0.1).toFixed(1) }}倍：</span>
                            <span class="font-semibold text-orange-500 show-number text-xl">{{ price.toFixed(2) ||
                                '-'
                            }}</span>
                        </div>
                    </div>
                </UCard>
                <UCard :ui="{ body: 'p-0 sm:p-6' }">
                    <template #header>
                        <p class="text-lg font-semibold ">按纯佣金倍数出价</p>
                    </template>
                    <div class="space-y-2">
                        <div class="flex justify-between border-b border-gray-200 p-4"
                            v-for="(price, index) in chujiaPrices" :key="'chujia-' + index">
                            <span>{{ (0.8 + index * 0.1).toFixed(1) }}倍出价：</span>
                            <span class="font-semibold text-orange-500 show-number text-xl">{{ price.toFixed(2)
                            }}</span>
                        </div>
                    </div>

                </UCard>
            </div>
            <div class="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
                <p><b> 注：投放出价按纯佣金去除退款率计算而得。</b></p>
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
    refundRate: z.number('必须输入大于0的数字').positive('必须输入大于0的数字'),
    platformFee: z.number('必须输入大于0的数字').positive('必须输入大于0的数字'),
});
// Define the type for the schema output
type Schema = z.output<typeof schema>
const formState = reactive<Partial<Schema>>({
    price: undefined,
    commissionRate: undefined,
    refundRate: 5,
    platformFee: 5
})

// 添加loading状态
const loading = ref(false)

// 计算结果
const results = ref({
    calculated: false,
    estimatedCommission: 0,
    estimatedSettlement: 0,
    yongjinlv: 0,
    chunlirunlv: 0,
    estimatedBreakEvenROI: 0,
    estimatedSettlementBreakEvenROI: 0,
    roiPrices: Array(8).fill(0),
    chujiaPrices: Array(8).fill(0),
    calculateTime: '',
    recommendROI: 0
})

// 为了兼容现有模板，创建响应式引用
const estimatedCommission = computed(() => results.value.estimatedCommission)
const estimatedSettlement = computed(() => results.value.estimatedSettlement)
const yongjinlv = computed(() => results.value.yongjinlv)
const chunlirunlv = computed(() => results.value.chunlirunlv)
const estimatedBreakEvenROI = computed(() => results.value.estimatedBreakEvenROI)
const estimatedSettlementBreakEvenROI = computed(() => results.value.estimatedSettlementBreakEvenROI)
const roiPrices = computed(() => results.value.roiPrices)
const chujiaPrices = computed(() => results.value.chujiaPrices)
const calculateTime = computed(() => results.value.calculateTime)
const recommendROI = computed(() => results.value.recommendROI)



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
        const data = await $fetch('/api/roi/shangjia', {
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