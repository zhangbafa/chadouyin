<template>
    <div class="container mx-auto p-4">
        <!-- <div class="text-center my-5">
            <h1 class="text-3xl font-bold text-primary">ROI出价计算器达人版</h1>
            <p class="text-gray-500 dark:text-gray-400 mt-2">专业计算电商投放最佳出价策略</p>
        </div> -->

        <UForm :schema="schema" :state="formState" class="space-y-4" @submit="handleSubmit">
            <div class="grid grid-cols-2 md:grid-cols-2 gap-10">
                <UFormField label="商品价格" name="price">
                    <UInput v-model="formState.price" type="number" placeholder="请输入"
                        :ui="{ trailing: 'pointer-events-none' }" class="w-full" size="xl">
                        <template #trailing>
                            <div id="character-count" class="text-xs text-muted tabular-nums " aria-live="polite"
                                role="status">
                                元
                            </div>
                        </template>
                    </UInput>
                </UFormField>

                <UFormField label="佣金率" name="commissionRate">
                    <UInput v-model="formState.commissionRate" type="number" placeholder="请输入"
                        :ui="{ trailing: 'pointer-events-none' }" class="w-full" size="xl">
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
                <UFormField label="平台手续费" name="platformFee">
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

            <UButton type="submit" color="primary" block :loading="loading" size="xl">计算结果</UButton>

            <div class="text-center text-sm text-gray-500 dark:text-gray-400" v-if="results.calculationTime">
                计算时间：{{ results.calculationTime }}
            </div>
        </UForm>

        <div class="mt-10">
            <h2 class="text-xl font-semibold flex items-center justify-start mb-4">
                <UIcon name="i-heroicons-chevron-down" class="mr-2" />
                计算结果
            </h2>

            <div class="grid grid-cols-2 md:grid-cols-2 gap-4">
                <UCard><span class="font-normal text-sm">毛利佣金</span>
                    <p class="text-2xl font-bold text-orange-500 show-number mt-4">
                        {{ results.estimatedCommission.toFixed(2) }}<span class="text-sm font-normal ml-1">元</span></p>
                </UCard>
                <UCard>
                    <span class="font-normal text-sm">纯利佣金</span>
                    <p class="text-2xl font-bold text-orange-500 show-number mt-4">{{
                        results.estimatedSettlement2.toFixed(2)
                        }}<span class="text-sm font-normal ml-1">元</span></p>
                </UCard>
                <UCard>
                    <span class="font-normal text-sm">预估ROI</span>
                    <p class="text-2xl font-bold show-number mt-4 text-orange-500">{{
                        results.estimatedBreakEvenROI.toFixed(2)
                        || '-' }}</p>
                </UCard>
                <UCard>
                    <span class="font-normal text-sm">保本ROI</span>
                    <p class="text-2xl font-bold mt-4 show-number text-orange-500">{{
                        results.estimatedSettlementBreakEvenROI.toFixed(2) }}</p>
                </UCard>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4 mb-2 text-center">
                <UCard>
                    <div class="text-center">
                        <p class="text-base font-normal ">建议目标ROI出价</p>
                        <p class="mt-2 text-4xl font-bold tracking-tight show-number text-orange-500">{{
                            results.recommendROI.toFixed(2)
                            }}</p>
                    </div>
                </UCard>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 ">
                <UCard :ui="{ body: 'p-0 sm:p-6' }">
                    <template #header>
                        <p class="text-lg font-semibold">千川/随心推全域ROI出价</p>
                    </template>
                    <div>
                        <div class="flex justify-between border-b border-gray-200 p-4 bg-red"
                            v-for="(price, index) in results.roiPrices" :key="'roi-' + index">
                            <span class="text-bases">ROI*{{ (0.5 + index * 0.1).toFixed(1) }}倍：</span>
                            <span class="font-semibold text-orange-500 show-number text-xl">{{ price.toFixed(2) || '-'
                            }}</span>
                        </div>
                    </div>
                </UCard>
                <UCard :ui="{ body: 'p-0 sm:p-6' }">
                    <template #header>
                        <p class="text-lg font-semibold ">随心推手动出价</p>
                    </template>
                    <div class="">
                        <div class="flex justify-between border-b border-gray-200 p-4"
                            v-for="(price, index) in results.chujia" :key="'chujia-' + index">
                            <span>{{ (0.8 + index * 0.1).toFixed(1) }}倍出价：</span>
                            <span class="font-semibold text-orange-500 show-number text-xl">{{ price.toFixed(2)
                            }}</span>
                        </div>
                    </div>
                </UCard>
            </div>

            <div class="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
                <p><b>注：投放出价按纯佣金去除退款率计算而得。</b></p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { UCard } from '#components';
import type { card } from '#build/ui';

definePageMeta({
    layout: 'roi',
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
    platformFee: 10
})

const loading = ref(false)

const results = ref({
    calculated: false,
    estimatedCommission: 0,
    estimatedSettlement: 0,
    estimatedSettlement2: 0,
    estimatedBreakEvenROI: 0,
    estimatedSettlementBreakEvenROI: 0,
    roiPrices: Array(8).fill(0),
    chujia: Array(8).fill(0),
    calculationTime: '',
    recommendROI: 0
})


async function handleSubmit(event: FormSubmitEvent<Schema>) {
    loading.value = true;
    try {
        // 1. 先通过 Zod 验证 formState，确保所有必填字段都存在且合法
        // safeParse 会返回验证结果，不抛出错误
        const validationResult = schema.safeParse(formState);
        if (!validationResult.success) {
            // 验证失败：可以在这里处理错误（如提示用户）
            console.error("表单验证失败：", validationResult.error);
            loading.value = false;
            return;
        }

        // 2. 从验证结果中获取安全的、已确保存在的值（无需担心 undefined）
        const { price, commissionRate, refundRate, platformFee } = validationResult.data;

        // 3. 基于安全值进行计算（此时所有变量均已定义且符合规则）
        const estimatedCommission = price * (commissionRate * 0.01);
        const yongjinqushouxunfei = (commissionRate * 0.01) * (1 - (platformFee * 0.01));
        const yongjinquanqu = yongjinqushouxunfei * (1 - (refundRate * 0.01));
        const estimatedSettlement = price * yongjinqushouxunfei;
        const estimatedSettlement2 = price * yongjinquanqu;
        const estimatedBreakEvenROI = 1 / (commissionRate * 0.01);
        const ROIyjl = (commissionRate * 0.01) * (1 - (refundRate * 0.01));
        const ROIsxf = ROIyjl * (1 - (platformFee * 0.01));
        const estimatedSettlementBreakEvenROI = 1 / ROIsxf;

        // 计算出价策略
        const roiPrices = [
            estimatedSettlementBreakEvenROI * 0.5,
            estimatedSettlementBreakEvenROI * 0.6,
            estimatedSettlementBreakEvenROI * 0.7,
            estimatedSettlementBreakEvenROI * 0.8,
            estimatedSettlementBreakEvenROI * 0.9,
            estimatedSettlementBreakEvenROI * 1.0,
            estimatedSettlementBreakEvenROI * 1.1,
            estimatedSettlementBreakEvenROI * 1.2
        ];

        const chujia = [
            estimatedSettlement2 * 0.8,
            estimatedSettlement2 * 0.9,
            estimatedSettlement2 * 1.0,
            estimatedSettlement2 * 1.1,
            estimatedSettlement2 * 1.2,
            estimatedSettlement2 * 1.3,
            estimatedSettlement2 * 1.4,
            estimatedSettlement2 * 1.5
        ];



        // 更新结果
        const now = new Date();
        const calculationTime = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

        let recommendROI;
        if (price < 10) {
            if (commissionRate <= 10) {
                recommendROI = estimatedSettlementBreakEvenROI * 0.5;
            } else if (commissionRate >= 10 && commissionRate < 20) {
                recommendROI = estimatedSettlementBreakEvenROI * 0.6;
            } else if (commissionRate >= 20 && commissionRate < 35) {
                recommendROI = estimatedSettlementBreakEvenROI * 0.8;
            } else if (commissionRate >= 35) {
                recommendROI = estimatedSettlementBreakEvenROI * 1;
            } else {
                recommendROI = estimatedSettlementBreakEvenROI * 1;
            }
        } else if (price >= 10 && price < 20) {
            if (commissionRate <= 10) {
                recommendROI = estimatedSettlementBreakEvenROI * 0.5;
            } else if (commissionRate >= 10 && commissionRate < 20) {
                recommendROI = estimatedSettlementBreakEvenROI * 0.6;
            } else if (commissionRate >= 20 && commissionRate < 35) {
                recommendROI = estimatedSettlementBreakEvenROI * 0.7;
            } else if (commissionRate >= 35) {
                recommendROI = estimatedSettlementBreakEvenROI * 0.8;
            } else {
                recommendROI = estimatedSettlementBreakEvenROI * 0.9;
            }
        } else if (price >= 20 && price < 30) {
            if (commissionRate <= 10) {
                recommendROI = estimatedSettlementBreakEvenROI * 0.6;
            } else if (commissionRate >= 10 && commissionRate < 20) {
                recommendROI = estimatedSettlementBreakEvenROI * 0.7;
            } else if (commissionRate >= 20 && commissionRate < 35) {
                recommendROI = estimatedSettlementBreakEvenROI * 0.8;
            } else if (commissionRate >= 35) {
                recommendROI = estimatedSettlementBreakEvenROI * 0.9;
            } else {
                recommendROI = estimatedSettlementBreakEvenROI * 1;
            }
        } else if (price >= 30) {
            if (commissionRate <= 10) {
                recommendROI = estimatedSettlementBreakEvenROI * 0.6;
            } else if (commissionRate >= 10 && commissionRate < 20) {
                recommendROI = estimatedSettlementBreakEvenROI * 0.7;
            } else if (commissionRate >= 20 && commissionRate < 35) {
                recommendROI = estimatedSettlementBreakEvenROI * 0.8;
            } else if (commissionRate >= 35) {
                recommendROI = estimatedSettlementBreakEvenROI * 0.9;
            } else {
                recommendROI = estimatedSettlementBreakEvenROI * 1;
            }
        } else {
            recommendROI = estimatedSettlementBreakEvenROI * 1;
        }
        results.value = {
            calculated: true,
            estimatedCommission,
            estimatedSettlement,
            estimatedSettlement2,
            estimatedBreakEvenROI,
            estimatedSettlementBreakEvenROI,
            roiPrices,
            chujia,
            calculationTime,
            recommendROI
        };
    } catch (error) {
        console.error("计算出错：", error);
    } finally {
        loading.value = false;
    }
}
</script>

<style scoped>
/* Keeping some of the original styles for layout and feel, but leveraging Tailwind classes more */
.container {
    max-width: 100%;
}
</style>
