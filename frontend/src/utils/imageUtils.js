/**
 * 图片格式转换工具
 * 支持将各种图片格式统一转换为PNG格式
 */

/**
 * 将图片文件转换为PNG格式
 * @param {File} file - 原始图片文件
 * @param {number} quality - 转换质量 (0-1)，默认0.9
 * @returns {Promise<File>} 转换后的PNG文件
 */
export const convertImageToPng = (file, quality = 0.9) => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      console.log('【图片调试】不是图片文件，直接返回', file.name, file.type);
      resolve(file);
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    let timeout = setTimeout(() => {
      reject(new Error('图片转换超时'));
      console.error('【图片调试】图片转换超时', file.name);
    }, 5000);

    const url = URL.createObjectURL(file);

    img.onload = () => {
      clearTimeout(timeout);
      console.log('【图片调试】图片加载完成', file.name, img.width, img.height);
      try {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        console.log('【图片调试】已绘制到canvas，准备toBlob', file.name);
        canvas.toBlob((blob) => {
          if (blob) {
            const originalName = file.name;
            const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'));
            const newFileName = nameWithoutExt + '.png';
            const convertedFile = new File([blob], newFileName, {
              type: 'image/png',
              lastModified: Date.now()
            });
            console.log('【图片调试】转换成功:', newFileName, '大小:', blob.size);
            resolve(convertedFile);
          } else {
            console.error('【图片调试】canvas.toBlob失败', file.name);
            reject(new Error('图片转换失败'));
          }
        }, 'image/png', quality);
      } catch (error) {
        clearTimeout(timeout);
        console.error('【图片调试】canvas绘制或toBlob异常', error, file.name);
        reject(error);
      } finally {
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 100);
      }
    };

    img.onerror = (e) => {
      clearTimeout(timeout);
      console.error('【图片调试】图片加载失败', file.name, e);
      reject(new Error('图片加载失败'));
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);
    };

    console.log('【图片调试】开始加载图片', file.name, file.type, file.size);
    img.src = url;
  });
};

/**
 * 批量转换图片文件为PNG格式
 * @param {File[]} files - 文件数组
 * @param {number} quality - 转换质量 (0-1)，默认0.9
 * @returns {Promise<File[]>} 转换后的文件数组
 */
export const convertImagesToPng = async (files, quality = 0.9) => {
  const convertedFiles = [];
  
  for (const file of files) {
    try {
      const convertedFile = await convertImageToPng(file, quality);
      convertedFiles.push(convertedFile);
    } catch (error) {
      console.error('图片转换失败:', error);
      // 转换失败时使用原文件
      convertedFiles.push(file);
    }
  }
  
  return convertedFiles;
};

/**
 * 检查文件是否为图片
 * @param {File} file - 文件对象
 * @returns {boolean} 是否为图片文件
 */
export const isImageFile = (file) => {
  return file && file.type && file.type.startsWith('image/');
};

/**
 * 获取图片文件的扩展名
 * @param {File} file - 文件对象
 * @returns {string} 文件扩展名（包含点号）
 */
export const getImageExtension = (file) => {
  if (!file || !file.name) return '';
  const lastDotIndex = file.name.lastIndexOf('.');
  return lastDotIndex > 0 ? file.name.substring(lastDotIndex) : '';
};

/**
 * 压缩图片文件（保持原格式）
 * @param {File} file - 原始图片文件
 * @param {number} quality - 压缩质量 (0-1)，默认0.8
 * @returns {Promise<File>} 压缩后的文件
 */
export const compressImage = (file, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    if (!isImageFile(file)) {
      resolve(file);
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      try {
        // 设置canvas尺寸
        canvas.width = img.width;
        canvas.height = img.height;
        
        // 绘制图片到canvas
        ctx.drawImage(img, 0, 0);
        
        // 转换为原格式的Blob
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            
            console.log('【图片压缩】', file.name, '大小:', file.size, '->', blob.size, 'bytes');
            resolve(compressedFile);
          } else {
            reject(new Error('图片压缩失败'));
          }
        }, file.type, quality);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('图片加载失败'));
    };

    const url = URL.createObjectURL(file);
    img.src = url;
    
    img.onload = () => {
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);
    };
  });
};

/**
 * 调整图片尺寸
 * @param {File} file - 原始图片文件
 * @param {number} maxWidth - 最大宽度
 * @param {number} maxHeight - 最大高度
 * @param {number} quality - 质量 (0-1)，默认0.9
 * @returns {Promise<File>} 调整后的文件
 */
export const resizeImage = (file, maxWidth, maxHeight, quality = 0.9) => {
  return new Promise((resolve, reject) => {
    if (!isImageFile(file)) {
      resolve(file);
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      try {
        // 计算新的尺寸
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
        
        // 设置canvas尺寸
        canvas.width = width;
        canvas.height = height;
        
        // 绘制图片到canvas
        ctx.drawImage(img, 0, 0, width, height);
        
        // 转换为原格式的Blob
        canvas.toBlob((blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            
            console.log('【图片调整】', file.name, '尺寸:', img.width + 'x' + img.height, '->', width + 'x' + height);
            resolve(resizedFile);
          } else {
            reject(new Error('图片调整失败'));
          }
        }, file.type, quality);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('图片加载失败'));
    };

    const url = URL.createObjectURL(file);
    img.src = url;
    
    img.onload = () => {
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);
    };
  });
};

/**
 * 综合处理图片：转换格式、压缩、调整尺寸
 * @param {File} file - 原始图片文件
 * @param {Object} options - 处理选项
 * @param {boolean} options.convertToPng - 是否转换为PNG，默认true
 * @param {number} options.quality - 质量 (0-1)，默认0.9
 * @param {number} options.maxWidth - 最大宽度，默认不限制
 * @param {number} options.maxHeight - 最大高度，默认不限制
 * @returns {Promise<File>} 处理后的文件
 */
export const processImage = async (file, options = {}) => {
  const {
    convertToPng = true,
    quality = 0.9,
    maxWidth,
    maxHeight
  } = options;

  let processedFile = file;

  // 调整尺寸
  if (maxWidth || maxHeight) {
    processedFile = await resizeImage(processedFile, maxWidth || Infinity, maxHeight || Infinity, quality);
  }

  // 转换为PNG
  if (convertToPng) {
    processedFile = await convertImageToPng(processedFile, quality);
  }

  return processedFile;
};

/**
 * 对图片进行扩展、画波浪线、添加文字
 * @param {HTMLImageElement} img - 已加载的图片对象
 * @param {Array} waves - 波浪线坐标数组，每4个为一组[top, left, width, height]
 * @param {string} text - 需要添加的文字
 * @returns {string} 处理后的图片base64
 */
export function processImageWithWavesAndText(img, waves, text) {
  // 1. 计算新画布尺寸
  const expandWidth = Math.round(img.width * 0.3);
  const canvas = document.createElement('canvas');
  canvas.width = img.width + expandWidth;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');

  // 2. 填充白色背景
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 3. 绘制原图
  ctx.drawImage(img, 0, 0);

  // 4. 绘制波浪线
  ctx.strokeStyle = '#FF0000';
  ctx.lineWidth = 2;
      for (let i = 0; i < waves.length; i += 4) {
      const top = waves[i]-height;
      const left = waves[i + 1];
      const width = waves[i + 2];
      const height = waves[i + 3] / 5; // 波浪线高度变为原来的1/4
      ctx.beginPath();
      for (let x = 0; x <= width; x++) {
        // 波浪算法：y = top + height/2 + 振幅 * sin(2πx/波长)
        const amplitude = height / 2;
        const wavelength = width / 2;
        const y = top + amplitude + amplitude * Math.sin((x / wavelength) * 2 * Math.PI);
        if (x === 0) ctx.moveTo(left + x, y);
        else ctx.lineTo(left + x, y);
      }
      ctx.stroke();
    }

  // 5. 添加文字（放在拓展区域正中间）
  if (text) {
    ctx.font = '24px sans-serif';
    ctx.fillStyle = '#333';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    const textX = img.width + 20;
    const textY = img.height/5;
    const maxWidth = expandWidth - 40;
    const paragraphs = String(text).split('\n');
    let y = textY;
    const lineHeight = 30;

    for (let p = 0; p < paragraphs.length; p++) {
      let paragraph = paragraphs[p].trim();
      if (!paragraph) {
        y += lineHeight;
        continue;
      }
      // 每段开头空两格（全角空格）
      paragraph = '　　' + paragraph;
      let line = '';
      for (let i = 0; i < paragraph.length; i++) {
        const testLine = line + paragraph[i];
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && line !== '') {
          ctx.fillText(line, textX, y);
          line = paragraph[i];
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      if (line) {
        ctx.fillText(line, textX, y);
        y += lineHeight;
      }
    }
  }

  // 6. 返回base64
  return canvas.toDataURL('image/png');
} 