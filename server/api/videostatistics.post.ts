export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  // 1. 获取从前端发送过来的数据
  // readBody是异步的，所以需要await
  const body = await readBody(event);
  const ids = body.ids;

  // 增加一个简单的验证
  if (!ids || typeof ids !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request: "ids" field is missing or invalid.',
    });
  }

  console.log('Received IDs:', ids);

  try {
    // 2. 使用GET方式请求另一个接口
    // 这里的URL和参数需要替换成您实际要请求的接口地址
    const externalApiUrl = `https://api.tikhub.io/api/v1/douyin/app/v3/fetch_video_statistics?aweme_ids=${encodeURIComponent(ids)}`;
    
    console.log(`Fetching data from: ${externalApiUrl}`);

    // Nuxt的服务端路由中也可以直接使用$fetch
    const externalData: any = await $fetch(externalApiUrl, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${config.tikhub}`
      }
    });

    // console.log('Received data from external API:', JSON.stringify(externalData));

    // 3. 处理并返回最终结果
    // 假设外部API返回的数据结构是 { data: { views: ..., likes: ... } }
    // 您需要根据实际返回的结构，将其转换为前端需要的格式
    const transformedData = {
      stats: [
        { label: '播放量', value: externalData.data.statistics_list[0]?.play_count || 0 },
        { label: '点赞数', value: externalData.data.statistics_list[0]?.digg_count || 0 },
        { label: '下载数', value: externalData.data.statistics_list[0]?.download_count || 0 },
        { label: '分享数', value: externalData.data.statistics_list[0]?.share_count || 0 },
      ],
    };
    console.log(transformedData)
    return transformedData;

  } catch (error: any) {
    // 处理请求外部接口时发生的错误
    console.error('Error fetching from external API:', error);
    throw createError({
      statusCode: 502, // Bad Gateway
      statusMessage: 'Failed to fetch data from external service.',
      data: error.data, // 可以选择性地将原始错误信息传给前端
    });
  }
});
