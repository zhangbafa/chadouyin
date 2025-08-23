import * as z from 'zod'

// 定义视频号版请求数据的验证 schema
const roiShiPinHaoSchema = z.object({
  price: z.number().positive('必须输入大于0的数字'),
  commissionRate: z.number().positive('必须输入大于0的数字'),
  refundRate: z.number().positive('必须输入大于0的数字'),
  platformFee: z.number().positive('必须输入大于0的数字'),
})

// 定义返回结果的类型
interface ROIShiPinHaoCalculationResult {
  calculated: boolean
  estimatedCommission: number
  estimatedSettlement: number
  estimatedBreakEvenROI: number
  estimatedSettlementBreakEvenROI: number
  chujiaArr: number[]
  roiArr: string[]
  roijia: number
  jianyijia: number
  calculateTime: string
}

export default defineEventHandler(async (event): Promise<ROIShiPinHaoCalculationResult> => {
  try {
    // 读取请求体数据
    const body = await readBody(event)
    
    // 验证输入数据
    const validationResult = roiShiPinHaoSchema.safeParse(body)
    if (!validationResult.success) {
      throw createError({
        statusCode: 400,
        statusMessage: '输入数据验证失败',
        data: validationResult.error.errors
      })
    }

    const { price, commissionRate, refundRate, platformFee } = validationResult.data

    // 执行核心计算逻辑（视频号版算法）
    const estimatedCommission = price * (commissionRate * 0.01)  // 预估佣金
    const estimatedBreakEvenROI = 1 / (commissionRate * 0.01)  // 毛ROI
    const ROIyjl = (commissionRate * 0.01) * (1 - (refundRate * 0.01)) // 去了退货率的佣金率
    const ROIsxf = ROIyjl * (1 - (platformFee * 0.01)) // 去了平台费的佣金率
    const estimatedSettlementBreakEvenROI = 1 / ROIsxf  // 结算纯保本ROI
    const estimatedSettlement = price * ROIsxf // 去了退款率纯佣金
    const estimatedSettlement2 = estimatedSettlement * 10

    // 计算微信豆出价数组
    const chujiaArr = [
      estimatedSettlement2 * 0.8, // 激进出价
      estimatedSettlement2 * 0.9, // 放量出价
      estimatedSettlement2 * 1.0, // 放量出价1
      estimatedSettlement2 * 1.1, // 放量出价2
      estimatedSettlement2 * 1.2,
      estimatedSettlement2 * 1.3,
      estimatedSettlement2 * 1.4,
      estimatedSettlement2 * 1.5
    ]

    // 计算ROI数组（保留为字符串格式，与前端一致）
    const roiArr = [
      (estimatedSettlementBreakEvenROI * 0.5).toFixed(2),
      (estimatedSettlementBreakEvenROI * 0.6).toFixed(2),
      (estimatedSettlementBreakEvenROI * 0.7).toFixed(2),
      (estimatedSettlementBreakEvenROI * 0.8).toFixed(2),
      (estimatedSettlementBreakEvenROI * 0.9).toFixed(2),
      (estimatedSettlementBreakEvenROI * 1.0).toFixed(2),
      (estimatedSettlementBreakEvenROI * 1.1).toFixed(2),
      (estimatedSettlementBreakEvenROI * 1.2).toFixed(2)
    ]

    // 计算推荐ROI和建议出价（复杂的条件判断逻辑）
    let roijia = 0
    let jianyijia = 0

    if (price < 10) {
      if (commissionRate <= 10) {
        roijia = estimatedSettlementBreakEvenROI * 0.8
        jianyijia = estimatedSettlement2 * 2
      } else if (commissionRate >= 10 && commissionRate < 20) {
        roijia = estimatedSettlementBreakEvenROI * 0.9
        jianyijia = estimatedSettlement2 * 1.8
      } else if (commissionRate >= 20 && commissionRate < 35) {
        roijia = estimatedSettlementBreakEvenROI * 1
        jianyijia = estimatedSettlement2 * 1.6
      } else if (commissionRate >= 35) {
        roijia = estimatedSettlementBreakEvenROI * 1.2
        jianyijia = estimatedSettlement2 * 1.5
      } else {
        roijia = estimatedSettlementBreakEvenROI * 1
        jianyijia = estimatedSettlement2 * 1.8
      }
    } else if (price >= 10 && price < 20) {
      if (commissionRate <= 10) {
        roijia = estimatedSettlementBreakEvenROI * 0.8
        jianyijia = estimatedSettlement2 * 2.5
      } else if (commissionRate >= 10 && commissionRate < 20) {
        roijia = estimatedSettlementBreakEvenROI * 0.9
        jianyijia = estimatedSettlement2 * 2
      } else if (commissionRate >= 20 && commissionRate < 35) {
        roijia = estimatedSettlementBreakEvenROI * 1
        jianyijia = estimatedSettlement2 * 1.8
      } else if (commissionRate >= 35) {
        roijia = estimatedSettlementBreakEvenROI * 1.2
        jianyijia = estimatedSettlement2 * 1.5
      } else {
        roijia = estimatedSettlementBreakEvenROI * 0.9
        jianyijia = estimatedSettlement2 * 1.2
      }
    } else if (price >= 20 && price < 30) {
      if (commissionRate <= 10) {
        roijia = estimatedSettlementBreakEvenROI * 0.9
        jianyijia = estimatedSettlement2 * 2.2
      } else if (commissionRate >= 10 && commissionRate < 20) {
        roijia = estimatedSettlementBreakEvenROI * 1
        jianyijia = estimatedSettlement2 * 2
      } else if (commissionRate >= 20 && commissionRate < 35) {
        roijia = estimatedSettlementBreakEvenROI * 1.2
        jianyijia = estimatedSettlement2 * 1.8
      } else if (commissionRate >= 35) {
        roijia = estimatedSettlementBreakEvenROI * 1.2
        jianyijia = estimatedSettlement2 * 1.5
      } else {
        roijia = estimatedSettlementBreakEvenROI * 1
        jianyijia = estimatedSettlement2 * 1.2
      }
    } else if (price >= 30) {
      if (commissionRate <= 10) {
        roijia = estimatedSettlementBreakEvenROI * 0.8
        jianyijia = estimatedSettlement2 * 2
      } else if (commissionRate >= 10 && commissionRate < 20) {
        roijia = estimatedSettlementBreakEvenROI * 0.9
        jianyijia = estimatedSettlement2 * 1.5
      } else if (commissionRate >= 20 && commissionRate < 35) {
        roijia = estimatedSettlementBreakEvenROI * 1
        jianyijia = estimatedSettlement2 * 1.2
      } else if (commissionRate >= 35) {
        roijia = estimatedSettlementBreakEvenROI * 1.2
        jianyijia = estimatedSettlement2 * 1.3
      } else {
        roijia = estimatedSettlementBreakEvenROI * 1
        jianyijia = estimatedSettlement2 * 1.2
      }
    } else {
      roijia = estimatedSettlementBreakEvenROI * 1
      jianyijia = estimatedSettlement2 * 1
    }

    // 生成计算时间
    const now = new Date()
    const calculateTime = `计算时间：${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`

    // 返回计算结果
    return {
      calculated: true,
      estimatedCommission,
      estimatedSettlement,
      estimatedBreakEvenROI,
      estimatedSettlementBreakEvenROI,
      chujiaArr,
      roiArr,
      roijia,
      jianyijia,
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