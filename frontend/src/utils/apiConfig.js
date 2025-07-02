// API配置文件，支持环境变量和自动适配
let API_BASE = '';
if (process.env.REACT_APP_API_BASE) {
  // 去掉结尾所有 / 和 /api
  API_BASE = process.env.REACT_APP_API_BASE.replace(/\/?api\/?$/, '');
} else if (typeof window !== 'undefined' && window.location.host.includes('45262')) {
  API_BASE = 'http://29367ri756dev.vicp.fun:45262';
} else {
  API_BASE = '';
}
export default API_BASE; 