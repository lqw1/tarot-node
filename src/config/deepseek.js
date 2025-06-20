module.exports = {
  apiKey: process.env.DEEPSEEK_API_KEY,
  apiUrl: 'https://api.deepseek.com', // 请根据实际的 API 端点修改
  // model: 'deepseek-chat', // 请根据实际使用的模型名称修改
  model: 'deepseek-reasoner', // 请根据实际使用的模型名称修改
  temperature: 0.7,
  max_tokens: 2000
};