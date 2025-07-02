const axios = require('axios');

// 测试API URL配置功能
async function testApiUrlConfig() {
  const API_BASE = 'http://localhost:5000';
  
  console.log('🧪 测试API URL配置功能...\n');
  
  try {
    // 1. 获取智能体列表
    console.log('1. 获取智能体列表...');
    const agentsResponse = await axios.get(`${API_BASE}/api/agents/list`);
    console.log(`✅ 成功获取 ${agentsResponse.data.length} 个智能体\n`);
    
    // 2. 测试更新智能体配置（包含API URL）
    console.log('2. 测试更新智能体配置...');
    const testAgent = agentsResponse.data[0];
    if (testAgent) {
      // 测试1: 设置自定义API URL
      const updateResponse1 = await axios.post(`${API_BASE}/api/agents/update-key`, {
        id: testAgent.id,
        apiKey: testAgent.apiKey || 'test-api-key',
        apiUrl: 'http://test-server:24131/v1/chat-messages',
        inputs: testAgent.inputs || [],
        inputType: testAgent.inputType || 'dialogue'
      });
      console.log('✅ 自定义API URL配置成功\n');
      
      // 测试2: 测试空API URL自动填充默认值
      const updateResponse2 = await axios.post(`${API_BASE}/api/agents/update-key`, {
        id: testAgent.id,
        apiKey: testAgent.apiKey || 'test-api-key',
        apiUrl: '', // 空值
        inputs: testAgent.inputs || [],
        inputType: testAgent.inputType || 'dialogue'
      });
      console.log('✅ 空API URL自动填充测试成功\n');
      console.log('✅ 智能体配置更新成功\n');
      
      // 3. 验证更新后的配置
      console.log('3. 验证更新后的配置...');
      const updatedAgentsResponse = await axios.get(`${API_BASE}/api/agents/list`);
      const updatedAgent = updatedAgentsResponse.data.find(a => a.id === testAgent.id);
      
      // 验证默认值填充
      if (updatedAgent && updatedAgent.apiUrl === 'http://118.145.74.50:24131/v1/chat-messages') {
        console.log('✅ 默认API URL填充验证成功\n');
      } else {
        console.log('❌ 默认API URL填充验证失败\n');
        console.log('实际值:', updatedAgent?.apiUrl);
      }
    }
    
    console.log('🎉 所有测试完成！');
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    if (error.response) {
      console.error('响应数据:', error.response.data);
    }
  }
}

// 运行测试
testApiUrlConfig(); 