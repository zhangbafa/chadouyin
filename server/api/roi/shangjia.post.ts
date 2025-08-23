import * as z from 'zod'

// 定义商家版请求数据的验证 schema
const roiShangJiaSchema = z.object({
  price: z.number().positive('必须输入大于0的数字'),
  commissionRate: z.number().positive('必须输入大于0的数字'), // 这里是成本价
  refundRate: z.number().positive('必须输入大于0的数字'),
  platformFee: z.number().positive('必须输入大于0的数字'),
})

// 定义返回结果的类型
interface ROIShangJiaCalculationResult {
  calculated: boolean
  estimatedCommission: number
  estimatedSettlement: number
  yongjinlv: number
  chunlirunlv: number
  estimatedBreakEvenROI: number
  estimatedSettlementBreakEvenROI: number
  roiPrices: number[]
  chujiaPrices: number[]
  calculateTime: string
  recommendROI: number
}

export default defineEventHandler(async (event): Promise<ROIShangJiaCalculationResult> => {
  try {
    // 读取请求体数据
    const body = await readBody(event)
    
    // 验证输入数据
    const validationResult = roiShangJiaSchema.safeParse(body)
    if (!validationResult.success) {
      throw createError({
        statusCode: 400,
        statusMessage: '输入数据验证失败',
        data: validationResult.error.errors
      })
    }

    const { price, commissionRate, refundRate, platformFee } = validationResult.data

    // 执行核心计算逻辑（商家版算法）
    const estimatedCommission = price - commissionRate  // 预估利润
    const estimatedSettlement = estimatedCommission - (price * (platformFee * 0.01))  // 结算利润
    const estimatedSettlement2 = estimatedSettlement * (1 - (refundRate * 0.01))
    const yongjinlv = (1 - (commissionRate / price)) * 100  // 毛利润率
    const chunlirunlv = yongjinlv - platformFee  // 纯利润率
    const estimatedBreakEvenROI = 1 / (yongjinlv * 0.01)  // 预估保本ROI
    const ROIyjl = (yongjinlv * 0.01) * (1 - (refundRate * 0.01))
    const ROIsxf = ROIyjl * (1 - (platformFee * 0.01))
    const estimatedSettlementBreakEvenROI = 1 / ROIsxf  // 结算保本ROI

    // 计算各ROI价格
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

    // 计算各出价价格
    const chujiaPrices = [
      estimatedSettlement2 * 0.8,
      estimatedSettlement2 * 0.9,
      estimatedSettlement2 * 1.0,
      estimatedSettlement2 * 1.1,
      estimatedSettlement2 * 1.2,
      estimatedSettlement2 * 1.3,
      estimatedSettlement2 * 1.4,
      estimatedSettlement2 * 1.5
    ]

    // 计算推荐ROI（基于商家版逻辑）
    let recommendROI: number
    
    if (price < 10) {
      if (yongjinlv <= 10) {
        recommendROI = estimatedSettlementBreakEvenROI * 0.6
      } else if (yongjinlv >= 10 && yongjinlv < 20) {
        recommendROI = estimatedSettlementBreakEvenROI * 0.7
      } else if (yongjinlv >= 20 && yongjinlv < 35) {
        recommendROI = estimatedSettlementBreakEvenROI * 0.9
      } else if (yongjinlv >= 35) {
        recommendROI = estimatedSettlementBreakEvenROI * 1
      } else {
        recommendROI = estimatedSettlementBreakEvenROI * 1
      }
    } else if (price >= 10 && price < 20) {
      if (yongjinlv <= 10) {
        recommendROI = estimatedSettlementBreakEvenROI * 0.6
      } else if (yongjinlv >= 10 && yongjinlv < 20) {
        recommendROI = estimatedSettlementBreakEvenROI * 0.7
      } else if (yongjinlv >= 20 && yongjinlv < 35) {
        recommendROI = estimatedSettlementBreakEvenROI * 0.8
      } else if (yongjinlv >= 35) {
        recommendROI = estimatedSettlementBreakEvenROI * 0.9
      } else {
        recommendROI = estimatedSettlementBreakEvenROI * 1
      }
    } else if (price >= 20 && price < 30) {
      if (yongjinlv <= 10) {
        recommendROI = estimatedSettlementBreakEvenROI * 0.6
      } else if (yongjinlv >= 10 && yongjinlv < 20) {
        recommendROI = estimatedSettlementBreakEvenROI * 0.7
      } else if (yongjinlv >= 20 && yongjinlv < 35) {
        recommendROI = estimatedSettlementBreakEvenROI * 0.8
      } else if (yongjinlv >= 35) {
        recommendROI = estimatedSettlementBreakEvenROI * 0.9
      } else {
        recommendROI = estimatedSettlementBreakEvenROI * 1
      }
    } else if (price >= 30) {
      if (yongjinlv <= 10) {
        recommendROI = estimatedSettlementBreakEvenROI * 0.6
      } else if (yongjinlv >= 10 && yongjinlv < 20) {
        recommendROI = estimatedSettlementBreakEvenROI * 0.7
      } else if (yongjinlv >= 20 && yongjinlv < 35) {
        recommendROI = estimatedSettlementBreakEvenROI * 0.8
      } else if (yongjinlv >= 35) {
        recommendROI = estimatedSettlementBreakEvenROI * 0.9
      } else {
        recommendROI = estimatedSettlementBreakEvenROI * 1
      }
    } else {
      recommendROI = estimatedSettlementBreakEvenROI * 1
    }

    // 生成计算时间
    const now = new Date()
    const calculateTime = `计算时间：${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`

    // 返回计算结果
    return {
      calculated: true,
      estimatedCommission,
      estimatedSettlement,
      yongjinlv,
      chunlirunlv,
      estimatedBreakEvenROI,
      estimatedSettlementBreakEvenROI,
      roiPrices,
      chujiaPrices,
      calculateTime,
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