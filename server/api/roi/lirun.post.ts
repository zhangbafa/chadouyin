import * as z from 'zod'

// 定义利润版请求数据的验证 schema
const roiLiRunSchema = z.object({
  price: z.number().positive('必须输入大于0的数字'), // 广告消耗
  price6: z.number().positive('必须输入大于0的数字'), // 成交金额
  commissionRate: z.number().positive('必须输入大于0的数字'), // 佣金率
  refundRate: z.number().positive('必须输入大于0的数字'), // 退货率
  platformFee: z.number().positive('必须输入大于0的数字'), // 平台费
})

// 定义返回结果的类型
interface ROILiRunCalculationResult {
  calculated: boolean
  estimatedSettlement: number // 预估利润
  estimatedBreakEvenROI: number // 结算利润（实际是ROI）
  calculateTime: string
}

export default defineEventHandler(async (event): Promise<ROILiRunCalculationResult> => {
  try {
    // 读取请求体数据
    const body = await readBody(event)
    
    // 验证输入数据
    const validationResult = roiLiRunSchema.safeParse(body)
    if (!validationResult.success) {
      throw createError({
        statusCode: 400,
        statusMessage: '输入数据验证失败',
        data: validationResult.error.errors
      })
    }

    const { price, commissionRate, refundRate, platformFee, price6 } = validationResult.data

    // 执行核心计算逻辑（利润版算法）
    // 结算预估金额 = 成交金额 × 佣金率% × (1 - 退货率% - 平台费%)
    const estimatedSettlement1 = price6 * (commissionRate * 0.01) * (1 - (refundRate * 0.01) - (platformFee * 0.01))
    
    // 预估利润 = 结算预估金额 - 广告消耗
    const estimatedSettlement = estimatedSettlement1 - price
    
    // 结算利润（实际是ROI）= 成交金额 / 广告消耗
    const estimatedBreakEvenROI = price6 / price

    // 生成计算时间
    const now = new Date()
    const calculateTime = `计算时间：${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`

    // 返回计算结果
    return {
      calculated: true,
      estimatedSettlement,
      estimatedBreakEvenROI,
      calculateTime
    }

  } catch (error) {
    // 如果不是已经定义的错误，则抛出服务器内部错误
    if (!error.statusCode) {
      throw createError({
        statusCode: 500,
        statusMessage: '服务器计算错误',
        data: error.message
      })
    }
    throw error
  }
})