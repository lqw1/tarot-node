const { OpenAI } = require("openai")
const config = require("../config/deepseek")

// 创建 OpenAI 实例，设置超时
const openai = new OpenAI({
  apiKey: config.apiKey,
  baseURL: "https://api.deepseek.com/v1", // DeepSeek API 的基础 URL
  timeout: 6000000, // 60秒超时
  maxRetries: 3,  // 最大重试次数
})

const baseMessage = [
  { role: "system", content: "你是一个专业的塔罗牌占卜师，擅长解读塔罗牌的含义。" },
  { role: "user", content: "你好，我想了解一下塔罗牌" },
  { role: "assistant", content: "你好！很高兴为你介绍塔罗牌。塔罗牌是一种古老的占卜工具，由78张牌组成，包括22张大阿卡纳牌和56张小阿卡纳牌。" },
]

/**
 * 生成 AI 响应
 * @param {string} prompt - 用户输入的提示文本
 * @returns {Promise<Object>} - AI 的响应
 */
async function generateResponse(prompt) {
  try {
    console.log("Config:", {
      apiKey: config.apiKey ? "Present" : "Missing",
      model: config.model,
      baseURL: "https://api.deepseek.com/v1",
    })
    const completion = await openai.chat.completions.create({
      model: config.model,
      messages: [
        ...baseMessage,
        {
          role: "user",
          content: prompt,
        },
      ],
    })

    console.log("DeepSeek API Response:", completion)
    return completion
  } catch (error) {
    console.error("DeepSeek API Error Details:", {
      message: error.message,
      status: error.status,
      response: error.response?.data,
      stack: error.stack,
    })

    // 处理特定错误
    if (error.status === 402) {
      throw new Error("API 账户余额不足，请充值后重试")
    } else if (error.status === 401) {
      throw new Error("API 密钥无效或未授权")
    } else if (error.status === 429) {
      throw new Error("请求频率超限，请稍后重试")
    } else if (error.code === "ECONNREFUSED") {
      throw new Error("无法连接到 DeepSeek API 服务器")
    } else if (error.code === "ETIMEDOUT") {
      throw new Error("连接 DeepSeek API 超时")
    } else {
      throw new Error(`API 请求失败: ${error.message}`)
    }
  }
}

/**
 * 生成流式 AI 响应（SSE）
 * @param {string} prompt - 用户输入的提示文本
 * @returns {AsyncGenerator} - 流式响应生成器
 */
async function* generateStreamResponse(prompt) {
  try {
    const stream = await openai.chat.completions.create({
      model: config.model,
      messages: [
        ...baseMessage,
        {
          role: "user",
          content: prompt,
        },
      ],
      stream: true
    });

    for await (const chunk of stream) {
      yield chunk;
    }
  } catch (error) {
    console.error("DeepSeek Stream API Error:", error);
    throw new Error("Failed to generate stream response from DeepSeek");
  }
}

module.exports = {
  generateResponse,
  generateStreamResponse,
}
