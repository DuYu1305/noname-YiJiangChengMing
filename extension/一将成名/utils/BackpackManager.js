/**
 * 背包核心功能模块 - 基于localStorage持久化存储
 * 内置道具：通元、绑元、欢乐豆、金票、招募令、破界石、银两、手气卡、换将卡
 * 支持无缝扩展任意新道具，自动兼容localStorage数据
 */
let initpackage = false;
export const BackpackManager = {
  // ===== 1. 配置区 - 扩展道具只需要在这里添加道具名称即可 =====
  // 所有背包道具的key集合，新增道具直接往数组里加名字就行，无需改其他代码
  //通元 绑元 欢乐豆 金票 招募令 破界石 银两 手气卡 换将卡 将符
  itemKeys: [
    "tongyuan",
    "bangyuan",
    "huanledou",
    "jinpiao",
    "zhaomuling",
    "pojieshi",
    "yinliang",
    "shouqika",
    "huanjiangka",
    "jiangfu",
  ],

  // localStorage存储的键名
  storageKey: "yjcm_game_backpack_data",

  /**
   * 初始化背包，核心方法！页面加载时执行一次即可
   * 作用：1. 初始化localStorage数据 2. 兼容新增道具（自动补0）3. 防止数据异常
   */
  initBackpack() {
    if (initpackage) {
      return;
    }
    initpackage = true;
    const localData = localStorage.getItem(this.storageKey);
    let backpackData = {};

    // 初始化所有内置道具默认数量为0
    this.itemKeys.forEach((key) => {
      backpackData[key] = 0;
    });

    // 如果本地有存储数据，合并数据（保留已有道具数量，新增道具默认0）
    if (localData) {
      try {
        const parseData = JSON.parse(localData);
        Object.keys(parseData).forEach((key) => {
          if (backpackData.hasOwnProperty(key)) {
            // 保证道具数量是正整数，防止异常数据
            backpackData[key] = Math.max(0, parseInt(parseData[key]) || 0);
          }
        });
      } catch (e) {
        console.warn("背包数据异常，已重置为初始状态");
      }
    }

    // 存入localStorage
    this.saveBackpack(backpackData);
  },

  /**
   * 获取背包所有数据
   * @returns {Object} 所有道具及对应数量 {通元:100, 绑元:200, ...}
   */
  getBackpackAll() {
    const localData = localStorage.getItem(this.storageKey);
    return localData ? JSON.parse(localData) : {};
  },

  /**
   * 获取单个道具的数量
   * @param {String} itemName 道具名称（如：招募令、手气卡）
   * @returns {Number} 道具数量，没有则返回0
   */
  getItemNum(itemName) {
    const backpackData = this.getBackpackAll();
    let number = Math.max(0, parseInt(backpackData[itemName]) || 0);
    // 容错处理：空值/非数字 转为 0
    // 10000以下金额：直接返回原数
    if (number < 100000) {
      return number;
    }
    // 核心：转万 + 截取两位小数（不四舍五入）
    const wNum = number / 10000;
    return wNum.toString().replace(/(\.\d{2})\d*/, "$1") + "w";
  },

  /**
   * 修改道具数量（通用增减方法，核心）
   * @param {String} itemName 道具名称
   * @param {Number} num 变更数量：正数=增加，负数=减少
   * @returns {Boolean} 操作是否成功
   */
  changeItemNum(itemName, num) {
    // 校验道具是否存在
    if (!this.itemKeys.includes(itemName)) {
      console.error(`背包中不存在【${itemName}】该道具`);
      return false;
    }

    const backpackData = this.getBackpackAll();
    const currentNum = this.getItemNum(itemName);
    const newNum = Math.max(0, currentNum + num); // 数量不能小于0

    backpackData[itemName] = newNum;
    this.saveBackpack(backpackData);
    return true;
  },

  /**
   * 使用背包道具（最常用核心方法）
   * @param {String} itemName 道具名称
   * @param {Number} useNum 使用数量，默认1个
   * @returns {Object} {success:布尔值, msg:提示信息}
   */
  useItem(itemName, useNum = 1) {
    // 基础校验
    if (!this.itemKeys.includes(itemName)) {
      return { success: false, msg: `道具【${itemName}】不存在` };
    }
    if (useNum < 1 || !Number.isInteger(useNum)) {
      return { success: false, msg: "使用数量必须是正整数" };
    }

    const currentNum = this.getItemNum(itemName);
    // 数量不足校验
    if (currentNum < useNum) {
      return {
        success: false,
        msg: `【${itemName}】数量不足，当前拥有：${currentNum}，需要：${useNum}`,
      };
    }

    // 执行使用（减少对应数量）
    this.changeItemNum(itemName, -useNum);
    return {
      success: true,
      msg: `成功使用 ${useNum} 个【${itemName}】，剩余：${currentNum - useNum}`,
    };
  },

  /**
   * 保存背包数据到localStorage
   * @param {Object} data 背包数据对象
   */
  saveBackpack(data) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  },

  /**
   * 清空背包所有数据（测试/重置用）
   */
  clearBackpack() {
    localStorage.removeItem(this.storageKey);
    this.initBackpack();
    console.log("背包数据已清空并重置");
  },
  /**
   * 清空背包指定数据
   */
  clearItem(itemName) {
    this.changeItemNum(itemName, -this.getItemNum(itemName));
  }
};

// ========== 页面初始化执行 ==========
// 页面加载完成后，初始化背包，必须执行！
BackpackManager.initBackpack();

// // 使用1个招募令
// const res1 = BackpackManager.useItem('招募令');
// console.log(res1); // {success: true, msg: "成功使用 1 个【招募令】，剩余：xxx"}

// // 使用3个手气卡
// const res2 = BackpackManager.useItem('手气卡', 3);
// console.log(res2);

// // 使用数量不足的情况
// const res3 = BackpackManager.useItem('换将卡', 10);
// console.log(res3); // {success: false, msg: "【换将卡】数量不足..."}

// // 获取单个道具数量
// const gold = BackpackManager.getItemNum('银两');
// const card = BackpackManager.getItemNum('手气卡');
// console.log('当前银两：', gold);
// console.log('当前手气卡：', card);

// // 获取背包全部道具数据
// const allItems = BackpackManager.getBackpackAll();
// console.log('背包所有物品：', allItems);
// // 打印结果：{通元: 100, 绑元: 50, 欢乐豆: 0, 金票: 0, 招募令: 4, ...}

// //清空背包
// BackpackManager.clearBackpack();
