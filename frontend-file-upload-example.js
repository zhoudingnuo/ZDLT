// 前端文件上传示例 - 用于parameter类型的智能体

// 1. 文件上传函数
async function uploadFileForAgent(agentId, user, fieldName, files) {
  const formData = new FormData();
  formData.append('agentId', agentId);
  formData.append('user', user);
  formData.append('fieldName', fieldName);
  
  // 支持单文件或多文件
  if (Array.isArray(files)) {
    files.forEach(file => {
      formData.append('file', file);
    });
  } else {
    formData.append('file', files);
  }
  
  try {
    const response = await fetch('/api/upload-file-for-agent', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('文件上传失败:', error);
    throw error;
  }
}

// 2. 调用智能体函数
async function invokeAgent(agentId, inputs, query, user) {
  // 构建fileData对象，包含已上传的文件信息
  const fileData = {};
  
  // 遍历inputs，找出文件类型的字段
  for (const [key, value] of Object.entries(inputs)) {
    if (value && value.files && Array.isArray(value.files)) {
      // 这是文件字段，使用已上传的文件对象
      fileData[key] = value.files.map(file => ({
        filename: file.filename,
        difyFileObject: file.difyFileObject
      }));
    }
  }
  
  // 构建非文件字段的inputs
  const nonFileInputs = {};
  for (const [key, value] of Object.entries(inputs)) {
    if (!value || !value.files) {
      // 非文件字段，直接使用值
      nonFileInputs[key] = value;
    }
  }
  
  // query可以为空，后端会自动补充为"开始"
  const requestData = {
    inputs: nonFileInputs, // 只包含非文件字段
    query: query || '', // 允许为空，后端自动补充
    user: user,
    fileData: fileData // 文件字段单独处理
  };
  
  console.log('【前端】发送的请求数据:', requestData);
  
  try {
    const response = await fetch(`/api/agent/${agentId}/invoke`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('调用智能体失败:', error);
    throw error;
  }
}

// 3. 完整的使用示例
async function handleFileUploadAndInvoke() {
  const agentId = 'your-agent-id';
  const user = 'test-user';
  const query = '请分析这个文件';
  
  try {
    // 步骤1: 用户选择文件
    const fileInput = document.getElementById('fileInput');
    const files = fileInput.files;
    
    if (files.length === 0) {
      alert('请选择文件');
      return;
    }
    
    // 步骤2: 上传文件
    console.log('开始上传文件...');
    const uploadResult = await uploadFileForAgent(
      agentId, 
      user, 
      'document', // 字段名
      files
    );
    
    console.log('文件上传成功:', uploadResult);
    
    // 步骤3: 构建inputs，包含已上传的文件信息
    const inputs = {
      document: {
        files: uploadResult.files // 包含difyFileObject的文件信息
      },
      // 其他非文件字段
      title: '文档分析',
      description: '请详细分析文档内容'
    };
    
    // 步骤4: 调用智能体
    console.log('开始调用智能体...');
    const result = await invokeAgent(agentId, inputs, query, user);
    
    console.log('智能体响应:', result);
    
  } catch (error) {
    console.error('处理失败:', error);
    alert('处理失败: ' + error.message);
  }
}

// 4. HTML示例
/*
<!DOCTYPE html>
<html>
<head>
    <title>文件上传示例</title>
</head>
<body>
    <h2>文件上传和智能体调用示例</h2>
    
    <div>
        <label for="fileInput">选择文件:</label>
        <input type="file" id="fileInput" multiple />
    </div>
    
    <div>
        <label for="queryInput">查询内容:</label>
        <input type="text" id="queryInput" value="请分析这个文件" />
    </div>
    
    <button onclick="handleFileUploadAndInvoke()">开始处理</button>
    
    <div id="result"></div>
    
    <script src="frontend-file-upload-example.js"></script>
</body>
</html>
*/

// 5. 多文件字段处理示例
async function handleMultipleFileFields() {
  const agentId = 'your-agent-id';
  const user = 'test-user';
  
  try {
    // 上传图片文件
    const imageFiles = document.getElementById('imageInput').files;
    const imageResult = await uploadFileForAgent(agentId, user, 'images', imageFiles);
    
    // 上传文档文件
    const docFiles = document.getElementById('docInput').files;
    const docResult = await uploadFileForAgent(agentId, user, 'documents', docFiles);
    
    // 构建完整的inputs
    const inputs = {
      images: {
        files: imageResult.files
      },
      documents: {
        files: docResult.files
      },
      title: '多文件分析',
      description: '请分析所有文件'
    };
    
    // 调用智能体
    const result = await invokeAgent(agentId, inputs, '请综合分析所有文件', user);
    console.log('智能体响应:', result);
    
  } catch (error) {
    console.error('处理失败:', error);
  }
}

// 6. 简单测试函数 - 用于调试
async function testSimpleInvoke() {
  const agentId = 'dream-career';
  const user = 'test-user';
  // query可以为空，后端会自动补充为"开始"
  const query = ''; // 测试空query的情况
  
  // 简单的非文件字段测试
  const inputs = {
    prompt: '我想成为一名软件工程师',
    bool: 'true',
    gender: 'male'
  };
  
  try {
    console.log('【测试】开始简单调用测试（空query）');
    const result = await invokeAgent(agentId, inputs, query, user);
    console.log('【测试】调用成功:', result);
    return result;
  } catch (error) {
    console.error('【测试】调用失败:', error);
    throw error;
  }
}

// 7. 带文件的测试函数
async function testWithFile() {
  const agentId = 'dream-career';
  const user = 'test-user';
  const query = '请分析我的照片';
  
  try {
    // 步骤1: 上传文件
    const fileInput = document.getElementById('fileInput');
    if (fileInput.files.length === 0) {
      alert('请先选择文件');
      return;
    }
    
    console.log('【测试】开始文件上传');
    const uploadResult = await uploadFileForAgent(agentId, user, 'image', fileInput.files);
    console.log('【测试】文件上传成功:', uploadResult);
    
    // 步骤2: 构建完整数据
    const inputs = {
      prompt: '分析我的职业照片',
      bool: 'true',
      gender: 'male',
      image: {
        files: uploadResult.files
      }
    };
    
    // 步骤3: 调用智能体
    console.log('【测试】开始调用智能体');
    const result = await invokeAgent(agentId, inputs, query, user);
    console.log('【测试】智能体响应:', result);
    return result;
    
  } catch (error) {
    console.error('【测试】处理失败:', error);
    throw error;
  }
}

// 导出函数供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    uploadFileForAgent,
    invokeAgent,
    handleFileUploadAndInvoke,
    handleMultipleFileFields,
    testSimpleInvoke,
    testWithFile
  };
} 