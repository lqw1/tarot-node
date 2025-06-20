const express = require("express")
const router = express.Router()
const { generateResponse } = require("../services/deepseekService")

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

module.exports = router
