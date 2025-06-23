const express = require("express")
const router = express.Router()
const { generateResponse, generateStreamResponse } = require("../services/deepseekService")

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body

    if (!message) {
      return res.status(400).json({ error: "Message is required" })
    }

    console.log("Received message:", message)
    
    const response = await generateResponse(message)
    console.log("API Response:", response)
    res.json(response)
  } catch (error) {
    console.error("Detailed Chat route error:", {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
    })
    res.status(500).json({
      error: "Failed to process chat request",
      details: error.message,
    })
  }
})

// 新增 SSE 流式接口，添加 CORS 允许所有
router.post("/chat-stream", async (req, res) => {
  const { message } = req.body
  if (!message) {
    res.status(400).write('event: error\ndata: {"error": "Message is required"}\n\n')
    return res.end()
  }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders()

  // 1. 发送心跳包，防止连接因空闲超时而中断
  const keepAliveInterval = setInterval(() => {
    res.write(': ping\n\n');
  }, 20000); // 每 20 秒发送一次

  // 2. 监听连接关闭事件，清理定时器
  req.on('close', () => {
    clearInterval(keepAliveInterval);
  });

  try {
    const stream = generateStreamResponse(message)
    for await (const chunk of stream) {
      const content = chunk.choices?.[0]?.delta?.content || ''
      if (content) {
        res.write(`data: ${JSON.stringify({ text: content })}\n\n`)
      }
    }
    res.write('event: end\ndata: {}\n\n')
  } catch (err) {
    res.write(`event: error\ndata: ${JSON.stringify({ error: err.message })}\n\n`)
  } finally {
    // 3. 确保在任何情况下都清理定时器并结束响应
    clearInterval(keepAliveInterval);
    res.end()
  }
})

module.exports = router
