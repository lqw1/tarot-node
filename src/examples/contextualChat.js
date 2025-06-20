const { generateContextualResponse, generateContextualStreamResponse } = require('../services/deepseekService');

// 示例1：使用普通响应
async function exampleWithNormalResponse() {
    try {
        // 创建对话历史
        const messages = [
            { role: 'system', content: '你是一个专业的塔罗牌占卜师，擅长解读塔罗牌的含义。' },
            { role: 'user', content: '你好，我想了解一下塔罗牌' },
            { role: 'assistant', content: '你好！很高兴为你介绍塔罗牌。塔罗牌是一种古老的占卜工具，由78张牌组成，包括22张大阿卡纳牌和56张小阿卡纳牌。' },
            { role: 'user', content: '大阿卡纳牌和小阿卡纳牌有什么区别？' }
        ];

        // 调用接口获取响应
        const response = await generateContextualResponse(messages);
        console.log('AI 响应:', response.choices[0].message.content);
    } catch (error) {
        console.error('发生错误:', error.message);
    }
}

// 示例2：使用流式响应
async function exampleWithStreamResponse() {
    try {
        const messages = [
            { role: 'system', content: '你是一个专业的塔罗牌占卜师，擅长解读塔罗牌的含义。' },
            { role: 'user', content: '请详细解释一下愚者牌的含义' }
        ];

        // 使用流式响应
        const stream = generateContextualStreamResponse(messages);
        console.log('开始接收流式响应:');
        
        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
                process.stdout.write(content); // 实时打印响应内容
            }
        }
    } catch (error) {
        console.error('发生错误:', error.message);
    }
}

// 运行示例
async function runExamples() {
    console.log('=== 示例1：普通响应 ===');
    await exampleWithNormalResponse();
    
    console.log('\n=== 示例2：流式响应 ===');
    await exampleWithStreamResponse();
}

// 执行示例
runExamples().catch(console.error); 