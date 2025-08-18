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

// 表单数据
const price = ref(0);
const commissionRate = ref(0);
const refundRate = ref(5);
const platformFee = ref(5);
// 计算结果
const estimatedCommission = ref(0);
const estimatedSettlement = ref(0);
const yongjinlv = ref(0);
const chunlirunlv = ref(0);
const estimatedBreakEvenROI = ref(0);
const estimatedSettlementBreakEvenROI = ref(0);
const roiPrices = ref([0, 0, 0, 0, 0, 0, 0, 0]);
const chujiaPrices = ref([0, 0, 0, 0, 0, 0, 0, 0]);
const calculateTime = ref('');
const recommendROI = ref(0)



const handleSubmit = (event: FormSubmitEvent<Schema>) => {

    const validationResult = schema.safeParse(formState);
    if (!validationResult.success) {
        // 验证失败：可以在这里处理错误（如提示用户）
        console.error("表单验证失败：", validationResult.error);
        return;
    }

    // 2. 从验证结果中获取安全的、已确保存在的值（无需担心 undefined）
    const { price, commissionRate, refundRate, platformFee } = validationResult.data;

    // const { price, commissionRate, refundRate, platformFee } = form.value;
    console.log(`price:${price}`)
    // 获取当前时间
    const now = new Date();
    calculateTime.value = `计算时间：${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    // 核心算法
    estimatedCommission.value = price - commissionRate;  // 预估利润
    estimatedSettlement.value = estimatedCommission.value - (price * (platformFee * 0.01));  // 结算利润
    const estimatedSettlement2 = estimatedSettlement.value * (1 - (refundRate * 0.01));
    yongjinlv.value = (1 - (commissionRate / price)) * 100;  // 毛利润率
    chunlirunlv.value = yongjinlv.value - platformFee;  // 纯利润率
    estimatedBreakEvenROI.value = 1 / (yongjinlv.value * 0.01);  // 预估保本ROI
    const ROIyjl = (yongjinlv.value * 0.01) * (1 - (refundRate * 0.01));
    const ROIsxf = ROIyjl * (1 - (platformFee * 0.01));
    estimatedSettlementBreakEvenROI.value = 1 / ROIsxf;  // 结算保本ROI

    // 计算各ROI价格
    roiPrices.value = [
        estimatedSettlementBreakEvenROI.value * 0.5,
        estimatedSettlementBreakEvenROI.value * 0.6,
        estimatedSettlementBreakEvenROI.value * 0.7,
        estimatedSettlementBreakEvenROI.value * 0.8,
        estimatedSettlementBreakEvenROI.value * 0.9,
        estimatedSettlementBreakEvenROI.value * 1.0,
        estimatedSettlementBreakEvenROI.value * 1.1,
        estimatedSettlementBreakEvenROI.value * 1.2
    ];

    // 计算各出价价格
    chujiaPrices.value = [
        estimatedSettlement2 * 0.8,
        estimatedSettlement2 * 0.9,
        estimatedSettlement2 * 1.0,
        estimatedSettlement2 * 1.1,
        estimatedSettlement2 * 1.2,
        estimatedSettlement2 * 1.3,
        estimatedSettlement2 * 1.4,
        estimatedSettlement2 * 1.5
    ];
    if (price < 10) {
        if (yongjinlv.value <= 10) {
            recommendROI.value = estimatedSettlementBreakEvenROI.value * 0.6;
        } else if (yongjinlv.value >= 10 && yongjinlv.value < 20) {
            recommendROI.value = estimatedSettlementBreakEvenROI.value * 0.7;
        } else if (yongjinlv.value >= 20 && yongjinlv.value < 35) {
            recommendROI.value = estimatedSettlementBreakEvenROI.value * 0.9;
        } else if (yongjinlv.value >= 35) {
            recommendROI.value = estimatedSettlementBreakEvenROI.value * 1;
        } else {
            recommendROI.value = estimatedSettlementBreakEvenROI.value * 1;
        }
    } else if (price >= 10 && price < 20) {
        if (yongjinlv.value <= 10) {
            recommendROI.value = estimatedSettlementBreakEvenROI.value * 0.6;
        } else if (yongjinlv.value >= 10 && yongjinlv.value < 20) {
            recommendROI.value = estimatedSettlementBreakEvenROI.value * 0.7;
        } else if (yongjinlv.value >= 20 && yongjinlv.value < 35) {
            recommendROI.value = estimatedSettlementBreakEvenROI.value * 0.8;
        } else if (yongjinlv.value >= 35) {
            recommendROI.value = estimatedSettlementBreakEvenROI.value * 0.9;
        } else {
            recommendROI.value = estimatedSettlementBreakEvenROI.value * 1;
        }
    } else if (price >= 20 && price < 30) {
        if (yongjinlv.value <= 10) {
            recommendROI.value = estimatedSettlementBreakEvenROI.value * 0.6;
        } else if (yongjinlv.value >= 10 && yongjinlv.value < 20) {
            recommendROI.value = estimatedSettlementBreakEvenROI.value * 0.7;
        } else if (yongjinlv.value >= 20 && yongjinlv.value < 35) {
            recommendROI.value = estimatedSettlementBreakEvenROI.value * 0.8;
        } else if (yongjinlv.value >= 35) {
            recommendROI.value = estimatedSettlementBreakEvenROI.value * 0.9;
        } else {
            recommendROI.value = estimatedSettlementBreakEvenROI.value * 1;
        }
    } else if (price >= 30) {
        if (yongjinlv.value <= 10) {
            recommendROI.value = estimatedSettlementBreakEvenROI.value * 0.6;
        } else if (yongjinlv.value >= 10 && yongjinlv.value < 20) {
            recommendROI.value = estimatedSettlementBreakEvenROI.value * 0.7;
        } else if (yongjinlv.value >= 20 && yongjinlv.value < 35) {
            recommendROI.value = estimatedSettlementBreakEvenROI.value * 0.8;
        } else if (yongjinlv.value >= 35) {
            recommendROI.value = estimatedSettlementBreakEvenROI.value * 0.9;
        } else {
            recommendROI.value = estimatedSettlementBreakEvenROI.value * 1;
        }
    } else {
        recommendROI.value = estimatedSettlementBreakEvenROI.value * 1;
    }
};

</script>

<style scoped>
.container {
    max-width: 100%;
}
</style>