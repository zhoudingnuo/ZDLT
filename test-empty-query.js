// 测试空query自动补充功能

// 模拟前端调用
async function testEmptyQuery() {
  const agentId = 'dream-career';
  const user = 'test-user';
  const query = ''; // 空query
  
  const inputs = {
    prompt: '我想成为一名软件工程师',
    bool: 'true',
    gender: 'male'
  };
  
  const requestData = {
    inputs: inputs,
    query: query, // 空query
    user: user,
    fileData: {}
  };
  
  console.log('【测试】发送的数据:', JSON.stringify(requestData, null, 2));
  
  try {
    const response = await fetch(`/api/agent/${agentId}/invoke`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });
    
    const result = await response.json();
    console.log('【测试】响应结果:', result);
    return result;
  } catch (error) {
    console.error('【测试】请求失败:', error);
    throw error;
  }
}

// 测试有query的情况
async function testWithQuery() {
  const agentId = 'dream-career';
  const user = 'test-user';
  const query = '请帮我分析职业规划'; // 有query
  
  const inputs = {
    prompt: '我想成为一名软件工程师',
    bool: 'true',
    gender: 'male'
  };
  
  const requestData = {
    inputs: inputs,
    query: query,
    user: user,
    fileData: {}
  };
  
  console.log('【测试】发送的数据（有query）:', JSON.stringify(requestData, null, 2));
  
  try {
    const response = await fetch(`/api/agent/${agentId}/invoke`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });
    
    const result = await response.json();
    console.log('【测试】响应结果（有query）:', result);
    return result;
  } catch (error) {
    console.error('【测试】请求失败:', error);
    throw error;
  }
}

// 在浏览器环境中运行
if (typeof window !== 'undefined') {
  // 浏览器环境
  window.testEmptyQuery = testEmptyQuery;
  window.testWithQuery = testWithQuery;
  
  console.log('【测试】测试函数已加载:');
  console.log('- testEmptyQuery() - 测试空query');
  console.log('- testWithQuery() - 测试有query');
}

// 在Node.js环境中运行
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testEmptyQuery,
    testWithQuery
  };
} 