const https = require('https');
const http = require('http');

/**
 * 测试网络连接质量
 */
async function testNetworkConnection() {
    const targetUrl = 'https://api.deepseek.com';
    const results = {
        ping: [],
        dns: null,
        tls: null,
        bandwidth: null
    };

    console.log('=== 网络连接测试 ===');
    
    // 1. DNS 解析测试
    try {
        const dns = require('dns').promises;
        const startTime = Date.now();
        const addresses = await dns.resolve4('api.deepseek.com');
        const dnsTime = Date.now() - startTime;
        
        results.dns = {
            time: dnsTime,
            addresses: addresses
        };
        console.log(`✅ DNS 解析: ${dnsTime}ms, IP: ${addresses[0]}`);
    } catch (error) {
        console.log(`❌ DNS 解析失败: ${error.message}`);
    }

    // 2. HTTPS 连接测试
    try {
        const startTime = Date.now();
        const response = await new Promise((resolve, reject) => {
            const req = https.get(targetUrl, (res) => {
                const endTime = Date.now();
                resolve({
                    statusCode: res.statusCode,
                    time: endTime - startTime,
                    headers: res.headers
                });
            });
            
            req.setTimeout(10000, () => {
                reject(new Error('连接超时'));
            });
            
            req.on('error', reject);
        });
        
        results.tls = response;
        console.log(`✅ HTTPS 连接: ${response.time}ms, 状态: ${response.statusCode}`);
    } catch (error) {
        console.log(`❌ HTTPS 连接失败: ${error.message}`);
    }

    // 3. 多次 ping 测试
    console.log('\n=== 延迟测试 (5次) ===');
    for (let i = 0; i < 5; i++) {
        try {
            const startTime = Date.now();
            const response = await new Promise((resolve, reject) => {
                const req = https.get(targetUrl, (res) => {
                    const endTime = Date.now();
                    resolve(endTime - startTime);
                });
                
                req.setTimeout(5000, () => reject(new Error('超时')));
                req.on('error', reject);
            });
            
            results.ping.push(response);
            console.log(`第 ${i + 1} 次: ${response}ms`);
            
            // 间隔 1 秒
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.log(`第 ${i + 1} 次: 失败 - ${error.message}`);
        }
    }

    // 4. 统计分析
    if (results.ping.length > 0) {
        const avg = results.ping.reduce((a, b) => a + b, 0) / results.ping.length;
        const min = Math.min(...results.ping);
        const max = Math.max(...results.ping);
        const variance = results.ping.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / results.ping.length;
        const stdDev = Math.sqrt(variance);
        
        console.log('\n=== 延迟统计 ===');
        console.log(`平均延迟: ${avg.toFixed(2)}ms`);
        console.log(`最小延迟: ${min}ms`);
        console.log(`最大延迟: ${max}ms`);
        console.log(`标准差: ${stdDev.toFixed(2)}ms`);
        console.log(`稳定性: ${stdDev < 100 ? '良好' : stdDev < 300 ? '一般' : '较差'}`);
    }

    return results;
}

/**
 * 测试服务器资源使用情况
 */
function testServerResources() {
    const os = require('os');
    
    console.log('\n=== 服务器资源状态 ===');
    console.log(`CPU 核心数: ${os.cpus().length}`);
    console.log(`内存总量: ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)}GB`);
    console.log(`可用内存: ${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)}GB`);
    console.log(`内存使用率: ${((1 - os.freemem() / os.totalmem()) * 100).toFixed(2)}%`);
    
    const loadAvg = os.loadavg();
    console.log(`系统负载: ${loadAvg[0].toFixed(2)} (1分钟), ${loadAvg[1].toFixed(2)} (5分钟), ${loadAvg[2].toFixed(2)} (15分钟)`);
    
    // 判断负载是否过高
    const cpuCores = os.cpus().length;
    const loadPerCore = loadAvg[0] / cpuCores;
    console.log(`每核心负载: ${loadPerCore.toFixed(2)}`);
    console.log(`负载状态: ${loadPerCore < 0.7 ? '正常' : loadPerCore < 1.0 ? '较高' : '过高'}`);
}

/**
 * 测试 Node.js 进程资源
 */
function testProcessResources() {
    const process = require('process');
    
    console.log('\n=== Node.js 进程资源 ===');
    console.log(`进程内存使用: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB`);
    console.log(`进程内存总量: ${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)}MB`);
    console.log(`进程运行时间: ${(process.uptime() / 60).toFixed(2)}分钟`);
}

module.exports = {
    testNetworkConnection,
    testServerResources,
    testProcessResources
}; 