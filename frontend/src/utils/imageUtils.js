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
    // 检查是否为图片文件
    if (!file.type.startsWith('image/')) {
      // 非图片文件直接返回原文件
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
        
        // 转换为PNG格式的Blob
        canvas.toBlob((blob) => {
          if (blob) {
            // 创建新的File对象，保持原文件名但改为.png扩展名
            const originalName = file.name;
            const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'));
            const newFileName = nameWithoutExt + '.png';
            
            const convertedFile = new File([blob], newFileName, {
              type: 'image/png',
              lastModified: Date.now()
            });
            
            console.log('【图片转换】', originalName, '->', newFileName, '大小:', blob.size, 'bytes');
            resolve(convertedFile);
          } else {
            reject(new Error('图片转换失败'));
          }
        }, 'image/png', quality);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('图片加载失败'));
    };

    // 从文件创建图片URL
    const url = URL.createObjectURL(file);
    img.src = url;
    
    // 清理URL对象
    img.onload = () => {
      // 延迟清理，确保图片加载完成
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);
    };
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