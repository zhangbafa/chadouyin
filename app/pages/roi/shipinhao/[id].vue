<template>
    <div class="container mx-auto p-4">
        <div class="text-center my-5">
            <!-- <h1 class="text-3xl font-bold text-primary">投放利润计算器</h1>
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
                    <p class="text-sm text-gray-500 dark:text-gray-400">毛利佣金</p>
                    <p class="text-2xl font-bold text-orange-500 mt-3 show-number">{{
                        result.estimatedCommission.toFixed(2)
                    }}<span class="text-sm font-normal ml-1">元</span></p>
                </UCard>
                <UCard>
                    <p class="text-sm text-gray-500 dark:text-gray-400">纯利佣金</p>
                    <p class="text-2xl font-bold text-orange-500 mt-3 show-number">{{
                        result.estimatedSettlement.toFixed(2)
                    }}<span class="text-sm font-normal ml-1">元</span></p>
                </UCard>
                <UCard>
                    <p class="text-sm text-gray-500 dark:text-gray-400">预估ROI</p>
                    <p class="text-2xl font-bold text-orange-500 mt-3 show-number">{{
                        result.estimatedBreakEvenROI.toFixed(2) }}
                    </p>
                </UCard>
                <UCard>
                    <p class="text-sm text-gray-500 dark:text-gray-400">保本ROI</p>
                    <p class="text-2xl font-bold text-orange-500 mt-3 show-number">
                        {{ result.estimatedSettlementBreakEvenROI.toFixed(2) }}</p>
                </UCard>

            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <UCard :ui="{ body: 'p-0 sm:p-6' }">
                    <template #header>
                        <p class="text-lg font-semibold">微信豆ROI出价</p>
                    </template>
                    <div>
                        <div class="flex justify-between border-b border-gray-200 p-4"
                            v-for="(price, index) in result.roiArr" :key="'roi-' + index">
                            <span>ROI*{{ (0.5 + index * 0.1).toFixed(1) }}倍：</span>
                            <!-- roiArr是字符串数组，不需要再调用toFixed -->
                            <span class="font-semibold text-orange-500 show-number text-xl">{{ price || '0' }}</span>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4 mb-4 text-center">
                    <div class="text-center">
                        <p class="text-base font-normal ">建议目标ROI出价</p>
                        <p class="mt-2 text-4xl font-bold tracking-tight show-number text-orange-500">{{
                            result.roijia.toFixed(2) }}</p>
                    </div>
                </div>
                </UCard>
               
                <UCard :ui="{ body: 'p-0 sm:p-6' }">
                    <template #header>
                        <p class="text-lg font-semibold">微信豆手动出价</p>
                    </template>
                    <div>
                        <div class="flex justify-between border-b border-gray-200 p-4"
                            v-for="(price, index) in result.chujiaArr" :key="'chujia-' + index">
                            <span>{{ (0.8 + index * 0.1).toFixed(1) }}倍出豆：</span>
                            <span class="font-semibold text-orange-500 show-number text-xl">{{ Math.round(Number(price))
                                || '0'
                                }}
                            </span>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4 mb-4 text-center">
                        <div class="text-center">
                            <p class="text-base font-normal ">建议启动微信豆出价</p>
                            <p class="mt-2 text-4xl font-bold tracking-tight show-number text-orange-500">
                                {{ Math.round(result.jianyijia) }}</p>
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
import { ref, reactive } from 'vue'
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
definePageMeta({
    layout:'roi',
    middleware: 'validate-roi-link'
})
// 定义结果类型接口
interface CalculationResult {
    estimatedCommission: number;
    estimatedSettlement: number;
    estimatedBreakEvenROI: number;
    estimatedSettlementBreakEvenROI: number;
    chujiaArr: number[];
    roiArr: string[];
    roijia: number;
    jianyijia: number;
}

const schema = z.object({
    price: z.number('必须输入大于0的数字').positive('必须输入大于0的数字'),
    commissionRate: z.number('必须输入大于0的数字'),
    refundRate: z.number('必须输入大于0的数字').positive('必须输入大于0的数字'),
    platformFee: z.number('必须输入大于0的数字').positive('必须输入大于0的数字'),
});

type Schema = z.output<typeof schema>

const formState = reactive<Partial<Schema>>({
    price: undefined,
    commissionRate: undefined,
    refundRate: 5,
    platformFee: 6
})

// 计算结果，显式指定类型
const calculateTime = ref('');
const result = ref<CalculationResult>({
    estimatedCommission: 0,
    estimatedSettlement: 0,
    estimatedBreakEvenROI: 0,
    estimatedSettlementBreakEvenROI: 0,
    chujiaArr: Array(8).fill(0),
    roiArr: Array(8).fill(0),
    roijia: 0,
    jianyijia: 0,
})

const handleSubmit = (event: FormSubmitEvent<Schema>) => {
    const validationResult = schema.safeParse(formState);
    if (!validationResult.success) {
        console.error("表单验证失败：", validationResult.error);
        return;
    }

    const { price, commissionRate, refundRate, platformFee } = validationResult.data;

    // 获取当前时间
    const now = new Date();
    calculateTime.value = `计算时间：${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    const estimatedCommission = price * (commissionRate * 0.01);  //预估佣金
    const estimatedBreakEvenROI = 1 / (commissionRate * 0.01);  //毛ROI
    const ROIyjl = (commissionRate * 0.01) * (1 - (refundRate * 0.01)); //去了退货率的佣金率
    const ROIsxf = ROIyjl * (1 - (platformFee * 0.01)); //去了平台费的佣金率
    const estimatedSettlementBreakEvenROI = 1 / ROIsxf;  //结算纯保本ROI
    const estimatedSettlement = price * ROIsxf; //去了退款率纯佣金
    const estimatedSettlement2 = estimatedSettlement * 10;

    // 使用const声明变量，避免var带来的作用域问题
    const chujia = estimatedSettlement2 * 0.8; //激进出价
    const chujia1 = estimatedSettlement2 * 0.9; //放量出价
    const chujia2 = estimatedSettlement2 * 1;   //放量出价1
    const chujia3 = estimatedSettlement2 * 1.1; //放量出价2
    const chujia4 = estimatedSettlement2 * 1.2;
    const chujia5 = estimatedSettlement2 * 1.3;
    const chujia6 = estimatedSettlement2 * 1.4;
    const chujia7 = estimatedSettlement2 * 1.5;

    const roi = (estimatedSettlementBreakEvenROI * 0.5).toFixed(2)
    const roi1 = (estimatedSettlementBreakEvenROI * 0.6).toFixed(2)
    const roi2 = (estimatedSettlementBreakEvenROI * 0.7).toFixed(2)
    const roi3 = (estimatedSettlementBreakEvenROI * 0.8).toFixed(2)
    const roi4 = (estimatedSettlementBreakEvenROI * 0.9).toFixed(2)
    const roi5 = (estimatedSettlementBreakEvenROI * 1).toFixed(2)
    const roi6 = (estimatedSettlementBreakEvenROI * 1.1).toFixed(2)
    const roi7 = (estimatedSettlementBreakEvenROI * 1.2).toFixed(2)

    let roijia = 0;
    let jianyijia = 0;

    // 使用let代替var声明变量，避免作用域问题
    if (price < 10) {
        if (commissionRate <= 10) {
            roijia = estimatedSettlementBreakEvenROI * 0.8;
            jianyijia = estimatedSettlement2 * 2;
        } else if (commissionRate >= 10 && commissionRate < 20) {
            roijia = estimatedSettlementBreakEvenROI * 0.9;
            jianyijia = estimatedSettlement2 * 1.8;
        } else if (commissionRate >= 20 && commissionRate < 35) {
            roijia = estimatedSettlementBreakEvenROI * 1;
            jianyijia = estimatedSettlement2 * 1.6;
        } else if (commissionRate >= 35) {
            roijia = estimatedSettlementBreakEvenROI * 1.2;
            jianyijia = estimatedSettlement2 * 1.5;
        } else {
            roijia = estimatedSettlementBreakEvenROI * 1;
            jianyijia = estimatedSettlement2 * 1.8;
        }
    } else if (price >= 10 && price < 20) {
        // 其他条件判断...
        if (commissionRate <= 10) {
            roijia = estimatedSettlementBreakEvenROI * 0.8;
            jianyijia = estimatedSettlement2 * 2.5;
        } else if (commissionRate >= 10 && commissionRate < 20) {
            roijia = estimatedSettlementBreakEvenROI * 0.9;
            jianyijia = estimatedSettlement2 * 2;
        } else if (commissionRate >= 20 && commissionRate < 35) {
            roijia = estimatedSettlementBreakEvenROI * 1;
            jianyijia = estimatedSettlement2 * 1.8;
        } else if (commissionRate >= 35) {
            roijia = estimatedSettlementBreakEvenROI * 1.2;
            jianyijia = estimatedSettlement2 * 1.5;
        } else {
            roijia = estimatedSettlementBreakEvenROI * 0.9;
            jianyijia = estimatedSettlement2 * 1.2;
        }
    } else if (price >= 20 && price < 30) {
        // 其他条件判断...
        if (commissionRate <= 10) {
            roijia = estimatedSettlementBreakEvenROI * 0.9;
            jianyijia = estimatedSettlement2 * 2.2;
        } else if (commissionRate >= 10 && commissionRate < 20) {
            roijia = estimatedSettlementBreakEvenROI * 1;
            jianyijia = estimatedSettlement2 * 2;
        } else if (commissionRate >= 20 && commissionRate < 35) {
            roijia = estimatedSettlementBreakEvenROI * 1.2;
            jianyijia = estimatedSettlement2 * 1.8;
        } else if (commissionRate >= 35) {
            roijia = estimatedSettlementBreakEvenROI * 1.2;
            jianyijia = estimatedSettlement2 * 1.5;
        } else {
            roijia = estimatedSettlementBreakEvenROI * 1;
            jianyijia = estimatedSettlement2 * 1.2;
        }
    } else if (price >= 30) {
        // 其他条件判断...
        if (commissionRate <= 10) {
            roijia = estimatedSettlementBreakEvenROI * 0.8;
            jianyijia = estimatedSettlement2 * 2;
        } else if (commissionRate >= 10 && commissionRate < 20) {
            roijia = estimatedSettlementBreakEvenROI * 0.9;
            jianyijia = estimatedSettlement2 * 1.5;
        } else if (commissionRate >= 20 && commissionRate < 35) {
            roijia = estimatedSettlementBreakEvenROI * 1;
            jianyijia = estimatedSettlement2 * 1.2;
        } else if (commissionRate >= 35) {
            roijia = estimatedSettlementBreakEvenROI * 1.2;
            jianyijia = estimatedSettlement2 * 1.3;
        } else {
            roijia = estimatedSettlementBreakEvenROI * 1;
            jianyijia = estimatedSettlement2 * 1.2;
        }
    } else {
        roijia = estimatedSettlementBreakEvenROI * 1;
        jianyijia = estimatedSettlement2 * 1;
    }

    result.value = {
        estimatedCommission,
        estimatedSettlement,
        estimatedBreakEvenROI,
        estimatedSettlementBreakEvenROI,
        chujiaArr: [chujia, chujia1, chujia2, chujia3, chujia4, chujia5, chujia6, chujia7],
        roiArr: [roi, roi1, roi2, roi3, roi4, roi5, roi6, roi7],
        roijia,
        jianyijia
    }
};
</script>


<style scoped>
.container {
    max-width: 100%;
}
</style>