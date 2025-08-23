import * as z from 'zod'

// 定义请求数据的验证 schema
const roiDarenSchema = z.object({
  price: z.number().positive('必须输入大于0的数字'),
  commissionRate: z.number().positive('必须输入大于0的数字'),
  refundRate: z.number().positive('必须输入大于0的数字'),
  platformFee: z.number().positive('必须输入大于0的数字'),
})

// 定义返回结果的类型
interface ROICalculationResult {
  calculated: boolean
  estimatedCommission: number
  estimatedSettlement: number
  estimatedSettlement2: number
  estimatedBreakEvenROI: number
  estimatedSettlementBreakEvenROI: number
  roiPrices: number[]
  chujia: number[]
  calculationTime: string
  recommendROI: number
}

export default defineEventHandler(async (event): Promise<ROICalculationResult> => {
  try {
    // 读取请求体数据
    const body = await readBody(event)
    
    // 验证输入数据
    const validationResult = roiDarenSchema.safeParse(body)
    if (!validationResult.success) {
      throw createError({
        statusCode: 400,
        statusMessage: '输入数据验证失败',
        data: validationResult.error.errors
      })
    }

    const { price, commissionRate, refundRate, platformFee } = validationResult.data

    // 执行核心计算逻辑
    const estimatedCommission = price * (commissionRate * 0.01)
    const yongjinqushouxunfei = (commissionRate * 0.01) * (1 - (platformFee * 0.01))
    const yongjinquanqu = yongjinqushouxunfei * (1 - (refundRate * 0.01))
    const estimatedSettlement = price * yongjinqushouxunfei
    const estimatedSettlement2 = price * yongjinquanqu
    const estimatedBreakEvenROI = 1 / (commissionRate * 0.01)
    const ROIyjl = (commissionRate * 0.01) * (1 - (refundRate * 0.01))
    const ROIsxf = ROIyjl * (1 - (platformFee * 0.01))
    const estimatedSettlementBreakEvenROI = 1 / ROIsxf

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
    ]

    const chujia = [
      estimatedSettlement2 * 0.8,
      estimatedSettlement2 * 0.9,
      estimatedSettlement2 * 1.0,
      estimatedSettlement2 * 1.1,
      estimatedSettlement2 * 1.2,
      estimatedSettlement2 * 1.3,
      estimatedSettlement2 * 1.4,
      estimatedSettlement2 * 1.5
    ]

    // 计算推荐ROI
    let recommendROI: number
    
    if (price < 10) {
      if (commissionRate <= 10) {
        recommendROI = estimatedSettlementBreakEvenROI * 0.5
      } else if (commissionRate >= 10 && commissionRate < 20) {
        recommendROI = estimatedSettlementBreakEvenROI * 0.6
      } else if (commissionRate >= 20 && commissionRate < 35) {
        recommendROI = estimatedSettlementBreakEvenROI * 0.8
      } else if (commissionRate >= 35) {
        recommendROI = estimatedSettlementBreakEvenROI * 1
      } else {
        recommendROI = estimatedSettlementBreakEvenROI * 1
      }
    } else if (price >= 10 && price < 20) {
      if (commissionRate <= 10) {
        recommendROI = estimatedSettlementBreakEvenROI * 0.5
      } else if (commissionRate >= 10 && commissionRate < 20) {
        recommendROI = estimatedSettlementBreakEvenROI * 0.6
      } else if (commissionRate >= 20 && commissionRate < 35) {
        recommendROI = estimatedSettlementBreakEvenROI * 0.7
      } else if (commissionRate >= 35) {
        recommendROI = estimatedSettlementBreakEvenROI * 0.8
      } else {
        recommendROI = estimatedSettlementBreakEvenROI * 0.9
      }
    } else if (price >= 20 && price < 30) {
      if (commissionRate <= 10) {
        recommendROI = estimatedSettlementBreakEvenROI * 0.6
      } else if (commissionRate >= 10 && commissionRate < 20) {
        recommendROI = estimatedSettlementBreakEvenROI * 0.7
      } else if (commissionRate >= 20 && commissionRate < 35) {
        recommendROI = estimatedSettlementBreakEvenROI * 0.8
      } else if (commissionRate >= 35) {
        recommendROI = estimatedSettlementBreakEvenROI * 0.9
      } else {
        recommendROI = estimatedSettlementBreakEvenROI * 1
      }
    } else if (price >= 30) {
      if (commissionRate <= 10) {
        recommendROI = estimatedSettlementBreakEvenROI * 0.6
      } else if (commissionRate >= 10 && commissionRate < 20) {
        recommendROI = estimatedSettlementBreakEvenROI * 0.7
      } else if (commissionRate >= 20 && commissionRate < 35) {
        recommendROI = estimatedSettlementBreakEvenROI * 0.8
      } else if (commissionRate >= 35) {
        recommendROI = estimatedSettlementBreakEvenROI * 0.9
      } else {
        recommendROI = estimatedSettlementBreakEvenROI * 1
      }
    } else {
      recommendROI = estimatedSettlementBreakEvenROI * 1
    }

    // 生成计算时间
    const now = new Date()
    const calculationTime = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`

    // 返回计算结果
    return {
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