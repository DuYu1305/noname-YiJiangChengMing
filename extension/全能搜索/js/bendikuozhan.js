/**
 * @description 搜索历史分文件存储模块（bendikuozhan.js）
 * 功能：按「每文件100条」自动分块，多文件存储，避免单文件卡顿
 */
export default {
  // 存储配置（可按需调整）
  config: {
    filePrefix: 'searchHistory_', // 文件前缀（如：searchHistory_1.json）
    fileExt: '.json', // 文件后缀
    maxCountPerFile: 100, // 每个文件最大存储条数（避免单文件过大）
    storagePath: 'extension/全能搜索/history/', // 存储路径（无名杀扩展可访问的路径）
    historyTypes: ['normal', 'linkage'] // 两种历史类型：normal=普通历史，linkage=联动历史（对应原searchList/tsymqSearchList）
  },

  /**
   * 初始化：创建存储目录（防止路径不存在）
   */
  init() {
    // 检查并创建存储目录（依赖无名杀扩展的文件API）
    if (!game.existsDir(this.config.storagePath)) {
      game.createDir(this.config.storagePath);
    }
  },

  /**
   * 获取文件序号对应的完整路径
   * @param {string} type - 历史类型（normal/linkage）
   * @param {number} fileIndex - 文件序号（从1开始）
   * @returns {string} 完整文件路径
   */
  getFilePath(type, fileIndex) {
    return `${this.config.storagePath}${this.config.filePrefix}${type}_${fileIndex}${this.config.fileExt}`;
  },

  /**
   * 读取单个文件的历史记录
   * @param {string} type - 历史类型（normal/linkage）
   * @param {number} fileIndex - 文件序号
   * @returns {string[]} 该文件中的历史记录（空数组表示文件不存在/读取失败）
   */
  readFileHistory(type, fileIndex) {
    const filePath = this.getFilePath(type, fileIndex);
    try {
      if (!game.existsFile(filePath)) return [];
      // 读取文件并解析JSON（兼容空文件）
      const fileContent = game.readFile(filePath) || '[]';
      const history = JSON.parse(fileContent);
      return Array.isArray(history) ? history : [];
    } catch (e) {
      console.error(`读取历史文件失败：${filePath}`, e);
      return [];
    }
  },

  /**
   * 写入历史记录到指定文件
   * @param {string} type - 历史类型（normal/linkage）
   * @param {number} fileIndex - 文件序号
   * @param {string[]} history - 要写入的历史记录
   * @returns {boolean} 写入成功/失败
   */
  writeFileHistory(type, fileIndex, history) {
    const filePath = this.getFilePath(type, fileIndex);
    try {
      // 去重后写入（避免重复记录）
      const uniqueHistory = [...new Set(history)];
      game.writeFile(filePath, JSON.stringify(uniqueHistory, null, 2));
      return true;
    } catch (e) {
      console.error(`写入历史文件失败：${filePath}`, e);
      return false;
    }
  },

  /**
   * 获取某类型的所有历史记录（合并多文件）
   * @param {string} type - 历史类型（normal/linkage）
   * @param {number} [limit] - 限制返回条数（默认全部，优化卡顿：只传20即返回最近20条）
   * @returns {string[]} 合并后的历史记录（按时间倒序，最新的在前）
   */
  getHistory(type, limit) {
    if (!this.config.historyTypes.includes(type)) return [];

    let allHistory = [];
    let fileIndex = 1;

    // 循环读取所有分块文件（直到文件不存在）
    while (true) {
      const filePath = this.getFilePath(type, fileIndex);
      if (!game.existsFile(filePath)) break;

      // 读取当前文件的历史，插入到最前面（保证时间顺序：新文件的记录新）
      const fileHistory = this.readFileHistory(type, fileIndex);
      allHistory = [...fileHistory, ...allHistory];
      fileIndex++;
    }

    // 限制返回条数（避免一次性加载太多导致卡顿）
    return limit ? allHistory.slice(0, limit) : allHistory;
  },

  /**
   * 添加历史记录（自动分块存储）
   * @param {string} type - 历史类型（normal/linkage）
   * @param {string} content - 要添加的历史内容（搜索关键词）
   * @returns {boolean} 添加成功/失败
   */
  addHistory(type, content) {
    if (!this.config.historyTypes.includes(type) || !content.trim()) return false;

    // 1. 获取当前所有历史（去重）
    let allHistory = [...new Set([content.trim(), ...this.getHistory(type)])];
    // 2. 按每文件maxCountPerFile条拆分（倒序拆分：最新的在第一个文件）
    const chunks = [];
    for (let i = 0; i < allHistory.length; i += this.config.maxCountPerFile) {
      chunks.push(allHistory.slice(i, i + this.config.maxCountPerFile));
    }

    // 3. 写入所有分块文件（覆盖旧文件，确保最新）
    for (let i = 0; i < chunks.length; i++) {
      const fileIndex = i + 1; // 文件序号从1开始
      this.writeFileHistory(type, fileIndex, chunks[i]);
    }

    // 4. 删除多余的旧文件（如果拆分后文件数减少，比如删除了部分记录）
    let extraFileIndex = chunks.length + 1;
    while (true) {
      const extraFilePath = this.getFilePath(type, extraFileIndex);
      if (game.existsFile(extraFilePath)) {
        game.deleteFile(extraFilePath); // 删除多余文件
        extraFileIndex++;
      } else {
        break;
      }
    }

    return true;
  },

  /**
   * 清空历史记录（可清空指定类型/全部）
   * @param {string} [type] - 要清空的类型（不传则清空全部）
   */
  clearHistory(type) {
    const types = type ? [type] : this.config.historyTypes;
    types.forEach(targetType => {
      let fileIndex = 1;
      while (true) {
        const filePath = this.getFilePath(targetType, fileIndex);
        if (game.existsFile(filePath)) {
          game.deleteFile(filePath);
          fileIndex++;
        } else {
          break;
        }
      }
    });
    game.alert(type ? `${type === 'normal' ? '普通' : '联动'}搜索历史已清空` : '所有搜索历史已清空');
  }
};
