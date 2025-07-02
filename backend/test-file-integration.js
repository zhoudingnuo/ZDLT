const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// 测试配置
const BASE_URL = 'http://localhost:5000';
const TEST_FILE_PATH = path.join(__dirname, 'test-file.txt');
const DIFY_UPLOAD_URL = 'http://118.145.74.50:24131/v1/files/upload';

// 创建测试文件
function createTestFile() {
  const content = '这是一个测试文件，用于验证文件上传和拼接功能。\n时间：' + new Date().toISOString();
  fs.writeFileSync(TEST_FILE_PATH, content, 'utf-8');
  console.log('✅ 测试文件已创建:', TEST_FILE_PATH);
}

// 测试文件对象拼接功能
async function testFileObjectSplicing() {
  console.log('\n🔍 测试文件对象拼接功能...');
  
  try {
    const response = await axios.get(`${BASE_URL}/api/test/file-object`);
    console.log('✅ 文件对象拼接测试成功:');
    console.log('原始Dify响应:', response.data.originalDifyResponse);
    console.log('拼接后文件对象:', response.data.splicedFileObject);
  } catch (error) {
    console.error('❌ 文件对象拼接测试失败:', error.message);
  }
}

// 测试独立文件上传接口
async function testIndependentUpload() {
  console.log('\n📤 测试独立文件上传接口...');
  
  if (!fs.existsSync(TEST_FILE_PATH)) {
    console.error('❌ 测试文件不存在，请先创建');
    return;
  }
  
  try {
    const form = new FormData();
    form.append('file', fs.createReadStream(TEST_FILE_PATH));
    form.append('user', 'test-user');
    form.append('agentId', 'chinese-dictation');
    
    const response = await axios.post(`${BASE_URL}/api/upload-dify-file`, form, {
      headers: {
        ...form.getHeaders()
      }
    });
    
    console.log('✅ 独立文件上传测试成功:');
    console.log('响应:', response.data);
  } catch (error) {
    console.error('❌ 独立文件上传测试失败:', error.message);
    if (error.response) {
      console.error('错误详情:', error.response.data);
    }
  }
}

// 测试智能体调用接口（带文件）
async function testAgentInvokeWithFile() {
  console.log('\n🤖 测试智能体调用接口（带文件）...');
  
  if (!fs.existsSync(TEST_FILE_PATH)) {
    console.error('❌ 测试文件不存在，请先创建');
    return;
  }
  
  try {
    const form = new FormData();
    form.append('file', fs.createReadStream(TEST_FILE_PATH));
    form.append('user', 'test-user');
    form.append('query', '请分析这个文件的内容');
    
    const response = await axios.post(`${BASE_URL}/api/agent/chinese-dictation/invoke`, form, {
      headers: {
        ...form.getHeaders()
      }
    });
    
    console.log('✅ 智能体调用测试成功:');
    console.log('响应:', response.data);
  } catch (error) {
    console.error('❌ 智能体调用测试失败:', error.message);
    if (error.response) {
      console.error('错误详情:', error.response.data);
    }
  }
}

// 测试 Dify 上传地址连通性
async function testDifyUploadUrl() {
  console.log('\n🌐 测试 Dify 上传地址连通性...');
  console.log('上传地址:', DIFY_UPLOAD_URL);
  
  try {
    // 简单测试地址是否可访问
    const response = await axios.get(DIFY_UPLOAD_URL.replace('/v1/files/upload', ''), {
      timeout: 5000
    });
    console.log('✅ Dify 服务地址可访问');
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Dify 服务地址无法连接，请检查服务是否启动');
    } else if (error.code === 'ENOTFOUND') {
      console.error('❌ Dify 服务地址无法解析，请检查网络连接');
    } else {
      console.log('⚠️ Dify 服务地址测试结果:', error.message);
    }
  }
}

// 主测试函数
async function runTests() {
  console.log('🚀 开始测试 Dify 文件对象拼接集成...\n');
  
  // 1. 创建测试文件
  createTestFile();
  
  // 2. 测试 Dify 上传地址连通性
  await testDifyUploadUrl();
  
  // 3. 测试文件对象拼接
  await testFileObjectSplicing();
  
  // 4. 测试独立文件上传
  await testIndependentUpload();
  
  // 5. 测试智能体调用
  await testAgentInvokeWithFile();
  
  console.log('\n✨ 测试完成！');
  
  // 清理测试文件
  if (fs.existsSync(TEST_FILE_PATH)) {
    fs.unlinkSync(TEST_FILE_PATH);
    console.log('🧹 测试文件已清理');
  }
}

// 运行测试
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  createTestFile,
  testFileObjectSplicing,
  testIndependentUpload,
  testAgentInvokeWithFile,
  runTests
}; 