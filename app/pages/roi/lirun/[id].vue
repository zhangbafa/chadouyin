<template>
    <div class="container mx-auto p-4">
        <div class="text-center my-5">
            <h1 class="text-3xl font-bold text-primary">投放利润计算器</h1>
            <p class="text-gray-500 dark:text-gray-400 mt-2">专业计算电商投放最佳出价策略</p>
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

            <UButton type="submit" color="primary" block size="xl">计算结果</UButton>

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

// 计算结果
const estimatedSettlement = ref(0);
const estimatedBreakEvenROI = ref(0);
const calculateTime = ref('');

const handleSubmit = (event: FormSubmitEvent<Schema>) => {

    const validationResult = schema.safeParse(formState);
    if (!validationResult.success) {
        // 验证失败：可以在这里处理错误（如提示用户）
        console.error("表单验证失败：", validationResult.error);
        return;
    }

    // 2. 从验证结果中获取安全的、已确保存在的值（无需担心 undefined）
    const { price, commissionRate, refundRate, platformFee, price6 } = validationResult.data;

    // 获取当前时间
    const now = new Date();
    calculateTime.value = `计算时间：${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    // 核心算法
    const estimatedSettlement1 = price6 * (commissionRate * 0.01) * (1 - (refundRate * 0.01) - (platformFee * 0.01));  //结算预估金额
    estimatedSettlement.value = estimatedSettlement1 - price
    estimatedBreakEvenROI.value = price6 / price
};

</script>

<style scoped>
.container {
    max-width: 100%;
}
</style>