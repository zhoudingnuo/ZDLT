// 测试image-to-image智能体调用

// 模拟前端调用
async function testImageToImage() {
  const agentId = 'image-to-image';
  const user = 'test-user';
  const query = '请生成新的图片';
  
  // 模拟已上传的文件数据
  const inputs = {
    prompt: '将这张图片转换为卡通风格'
  };
  
  // 模拟fileData（实际应该通过文件上传获得）
  const fileData = {
    image: [
      {
        filename: 'test-image.jpg',
        difyFileObject: {
          dify_model_identity: "file",
          remote_url: "https://example.com/files/test-image.jpg",
          related_id: "file-123",
          filename: "test-image.jpg"
        }
      }
    ]
  };
  
  const requestData = {
    inputs: inputs,
    query: query,
    user: user,
    fileData: fileData
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

// 测试空query的情况
async function testImageToImageEmptyQuery() {
  const agentId = 'image-to-image';
  const user = 'test-user';
  const query = ''; // 空query
  
  const inputs = {
    prompt: '将这张图片转换为卡通风格'
  };
  
  const fileData = {
    image: [
      {
        filename: 'test-image.jpg',
        difyFileObject: {
          dify_model_identity: "file",
          remote_url: "https://example.com/files/test-image.jpg",
          related_id: "file-123",
          filename: "test-image.jpg"
        }
      }
    ]
  };
  
  const requestData = {
    inputs: inputs,
    query: query,
    user: user,
    fileData: fileData
  };
  
  console.log('【测试】发送的数据（空query）:', JSON.stringify(requestData, null, 2));
  
  try {
    const response = await fetch(`/api/agent/${agentId}/invoke`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });
    
    const result = await response.json();
    console.log('【测试】响应结果（空query）:', result);
    return result;
  } catch (error) {
    console.error('【测试】请求失败:', error);
    throw error;
  }
}

// 在浏览器环境中运行
if (typeof window !== 'undefined') {
  // 浏览器环境
  window.testImageToImage = testImageToImage;
  window.testImageToImageEmptyQuery = testImageToImageEmptyQuery;
  
  console.log('【测试】image-to-image测试函数已加载:');
  console.log('- testImageToImage() - 测试正常调用');
  console.log('- testImageToImageEmptyQuery() - 测试空query调用');
}

// 在Node.js环境中运行
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testImageToImage,
    testImageToImageEmptyQuery
  };
} 