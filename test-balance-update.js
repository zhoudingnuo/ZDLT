const axios = require('axios');

// 测试余额扣费功能
async function testBalanceUpdate() {
  const API_BASE = 'http://localhost:3000'; // 根据实际端口调整
  
  try {
    console.log('=== 测试余额扣费功能 ===');
    
    // 1. 先查询用户当前余额
    console.log('\n1. 查询用户当前余额...');
    const userResponse = await axios.get(`${API_BASE}/api/user/ZDLT`);
    console.log('用户信息:', userResponse.data);
    
    const currentBalance = userResponse.data.balance || 0;
    console.log('当前余额:', currentBalance);
    
    // 2. 模拟对话消耗
    console.log('\n2. 模拟对话消耗...');
    const usageResponse = await axios.post(`${API_BASE}/api/user/usage`, {
      username: 'ZDLT',
      usage_tokens: 1000,
      usage_price: 0.01
    });
    
    console.log('消耗更新响应:', usageResponse.data);
    
    // 3. 再次查询用户余额
    console.log('\n3. 查询更新后的余额...');
    const updatedUserResponse = await axios.get(`${API_BASE}/api/user/ZDLT`);
    console.log('更新后用户信息:', updatedUserResponse.data);
    
    const newBalance = updatedUserResponse.data.balance || 0;
    console.log('更新后余额:', newBalance);
    
    // 4. 验证余额是否正确扣减
    const expectedBalance = currentBalance - 0.01;
    console.log('\n4. 验证余额扣减...');
    console.log('期望余额:', expectedBalance);
    console.log('实际余额:', newBalance);
    console.log('余额扣减是否正确:', Math.abs(newBalance - expectedBalance) < 0.001 ? '✅ 正确' : '❌ 错误');
    
  } catch (error) {
    console.error('测试失败:', error.response?.data || error.message);
  }
}

// 运行测试
testBalanceUpdate(); 