import { lib, game, ui, get, ai, _status } from "../../../noname.js";
import { BackpackManager } from "./BackpackManager.js";
import {
  zhaomuMap,
  jiangfuBaseNum,
  jiangfuMultiple,
  levelProbability,
} from "../config/zhaomuJc.js";
let levelKeys = Object.entries(zhaomuMap);
let countChartNum = 0;
levelKeys.forEach(([key, value]) => {
  countChartNum += value.length;
});
window._yjcm_NextDrawLeave = null;
const zhaomuAllMap = {};
export function getWjId() {
  if (Object.keys(zhaomuAllMap).length !== 0) {
    return zhaomuAllMap;
  }
  levelKeys.forEach(([key, value]) => {
    value.forEach((item) => {
      if (typeof item === "string") {
        zhaomuAllMap[item] = {
          level: key,
          id: null,
        };
      } else {
        zhaomuAllMap[item.name] = {
          level: key,
          id: item.id,
        };
      }
    });
  });
  Object.entries(lib._cust_translate).forEach(([key, value]) => {
    if (zhaomuAllMap[value] && !zhaomuAllMap[value].id) {
      if (key.includes("gz_")) {
        if (lib._cust_translate[key.replaceAll("gz_", "")]) {
          zhaomuAllMap[value].id = key.replaceAll("gz_", "");
        } else {
          zhaomuAllMap[value].id = key;
        }
      } else {
        zhaomuAllMap[value].id = key;
      }
    }
  });
  let chartArr = [];
  let nullChartArr = [];
  let nullidArr = [];
  Object.entries(zhaomuAllMap).forEach(([key, value]) => {
    if (!value.id) {
      nullidArr.push(key);
      console.log("空的zhaomu:", key);
    }
    if (!lib._cust_character[value.id]) {
      lib._cust_character[value.id] = {
        group: "unknown",
        hp: 0,
      };
      nullChartArr.push(key);
      console.log("空的character:", key, value);
    } else {
      chartArr.push(lib._cust_character[value.id]);
    }
  });
  if (nullidArr.length) {
    alert("空的zhaomu:" + nullidArr.join("\n"));
  }
  if (nullChartArr.length) {
    alert("空的character:" + nullChartArr.join("\n"));
  }
  console.log("zhaomuAllMap", zhaomuAllMap);
  return zhaomuAllMap;
}
/**
 * 抽奖核心函数
 * @param {*} probability 定义概率配置【核心！想改概率只改这里即可】，单位：百分比%
 * @param {*} floors 保底概率 比如保底s以上 就是100-s的概率
 * @param {*} nextDrawLeave 指定下一次的等级
 * @returns
 */
export function randomGet(probability, floors) {
  let totalProbability = 0;
  Object.values(probability).forEach((value) => {
    totalProbability += value;
  });
  // 生成 0-概率总和 之间的随机数（核心随机数，决定命中哪个等级）
  let randomNum = floors || Math.random() * totalProbability;
  //概率区间命中：判断随机数落在哪个等级的区间内
  let currentProb = 0;
  //抽中的等级
  let hitLevel = "";
  //指定了下一次的等级 直接返回指定的等级 测试用
  let nextDrawLeave = window._yjcm_NextDrawLeave;
  if (nextDrawLeave && probability[nextDrawLeave]) {
    hitLevel = nextDrawLeave;
    window._yjcm_NextDrawLeave = null;
  } else {
    for (const level in probability) {
      const prob = probability[level];
      // 区间判断：[currentProb, currentProb+prob)
      if (randomNum >= currentProb && randomNum < currentProb + prob) {
        hitLevel = level;
        break;
      }
      currentProb += prob;
    }
  }
  return hitLevel;
}
/**
 * 按等级概率随机抽取列表中的一条数据
 * @returns {Object} 抽中的那条数据
 * flag 是否保底，默认false
 */
function randomGetByLevel(flag = false) {
  getWjId();
  let hitLevel = null;
  if (flag) {
    //保底s以上
    let randomNum = Math.random() * (100 - levelProbability.s);
    hitLevel = randomGet(levelProbability, randomNum);
  } else {
    hitLevel = randomGet(levelProbability, null);
  }
  //  从列表中筛选出 命中等级 的所有数据
  const targetList = zhaomuMap[hitLevel];
  //  从筛选后的列表中随机抽1条（如果同等级有多条数据，均匀随机）
  const randomIndex = Math.floor(Math.random() * targetList.length);

  let targetName = targetList[randomIndex];
  let wjid = null;
  let wjname = null;
  if (typeof targetName === "string") {
    wjname = targetName;
    wjid = zhaomuAllMap[targetName].id;
  } else {
    wjname = targetName.name;
    wjid = targetName.id;
  }
  return {
    jiangfuInfo: {},
    own: false,
    level: hitLevel,
    name: wjname,
    id: wjid,
  };
}
export function getWjBorderColor(level) {
  switch (level) {
    case "sssa":
      return "yj-wj-glow-red";
    case "sssb":
      return "yj-wj-glow-orange";
    case "ssa":
      return "yj-wj-glow-blue";
    case "ssb":
      return "yj-wj-glow-blue";
    default:
      return "";
  }
}
export function getwjJiangfu(level) {
  let baseNum = jiangfuBaseNum[level];
  let beishu = randomGet(jiangfuMultiple);
  let count = baseNum * beishu;
  console.log("jiangfu", count);
  return {
    baseNum: baseNum,
    beishu,
    count,
  };
}
/**
 * 多抽 保底逻辑 十连必得s以上的
 */
export function multiDraw(count = 1) {
  // 1. 从localStorage获取当前的抽奖数据
  let drawData = JSON.parse(localStorage.getItem("zhaomuDrawData") || "{}");
  let totalDraws = drawData.totalDraws || 0;
  if (!drawData.drawnHeroes) {
    drawData.drawnHeroes = [];
  }
  let drawnHeroes = drawData.drawnHeroes.map((hero) => hero.name);
  let result = [];
  let hasHighQuality = false; // 标记：是否抽到了s以上的
  //记录获取到最高品质的数据
  let highestQualityHeroMap = {};
  let highestLevel = null;
  let levelList = Object.keys(zhaomuMap);
  levelList.forEach((key) => {
    highestQualityHeroMap[key] = false;
  });
  for (let i = 0; i < count; i++) {
    totalDraws++;
    let target = randomGetByLevel();
    result.push(target);

    if (target.level != "s") {
      hasHighQuality = true;
    }
    highestQualityHeroMap[target.level] = true;
    // 检查是否是10的整数倍抽卡，如果是且没有抽到高质量武将，则触发保底
    if (totalDraws % 10 === 0 && !hasHighQuality) {
      // 重新抽1次，确保保底
      const randomReplaceIdx = Math.floor(Math.random() * result.length); // 随机选一个位置替换
      const extraTarget = randomGetByLevel(true);
      result[randomReplaceIdx] = extraTarget;
      hasHighQuality = true; // 标记为已获得高质量武将
      highestQualityHeroMap[extraTarget.level] = true;
    }
  }
  // 3. 更新已抽武将列表
  //已经有的武将不重复添加
  let newDrawnHeroes = result.filter((hero) => {
    let flag = drawnHeroes.includes(hero.name);

    return !flag;
  });

  // 4. 更新localStorage存储
  drawData = {
    totalDraws,
    drawnHeroes: [...drawData.drawnHeroes, ...newDrawnHeroes],
  };
  localStorage.setItem("zhaomuDrawData", JSON.stringify(drawData));
  result = result.map((hero) => {
    let flag = drawnHeroes.includes(hero.name);
    if (flag) {
      hero.jiangfuInfo = getwjJiangfu(hero.level);
      BackpackManager.changeItemNum("jiangfu", hero.jiangfuInfo.count);
    }
    hero.own = flag;
    return hero;
  });
  //拿最高等级
  levelList.some((level) => {
    if (highestQualityHeroMap[level]) {
      highestLevel = level;
      return true;
    }
  });
  //单抽 10的倍数时更新破界石
  if (totalDraws % 10 === 0 && count == 1) {
    //通知更新破界石
    BackpackManager.changeItemNum("pojieshi", 1);
  }
  //十连直接更新
  if (count == 10) {
    BackpackManager.changeItemNum("pojieshi", 1);
  }

  // result.forEach(hero => {
  // 	console.log("hero", lib._cust_character[hero.id]);
  // });
  // result[0] = {
  // 	name: "张琪瑛",
  // 	id: "y_dc_zhangqiying",
  //   level:"sssa",
  //   jiangfuInfo: getwjJiangfu("sssa"),
  // };

  return {
    result,
    highestLevel,
  };
}
export function clearDrawData() {
  localStorage.removeItem("zhaomuDrawData");
}
//还差几次必得ss以上武将
export function getNextHighQualityDraws() {
  let drawData = JSON.parse(localStorage.getItem("zhaomuDrawData") || "{}");
  let totalDraws = drawData.totalDraws || 0;
  let nextDraws = 0;
  nextDraws = 10 - (totalDraws % 10);
  return nextDraws + "次";
}
export function getDrowInfo() {
  let storedData = JSON.parse(localStorage.getItem("zhaomuDrawData") || "{}");
  let totalDraws = storedData.totalDraws || 0;
  let drawnHeroes = storedData.drawnHeroes || [];
  return {
    drawnHeroes,
    totalDraws: totalDraws,
    highestNum: drawnHeroes.filter((item) => item.level.includes("sss")),
  };
}
export function hasDrawnHero(heroId) {
  let drawData = JSON.parse(localStorage.getItem("zhaomuDrawData") || "{}");
  let drawnHeroes = drawData.drawnHeroes || [];
  return drawnHeroes.some((hero) => hero.id === heroId);
}
//招募汇总
export function getZhaomuhz() {
  let { totalDraws, highestNum, drawnHeroes } = getDrowInfo();
  return `累计招募次数${totalDraws},总武将数${countChartNum},已抽中${
    drawnHeroes.length
  }个武将,未抽中${countChartNum - drawnHeroes.length}个武将`;
}
// 测试代码
// const result = multiDraw(10);
// console.log("抽中的结果：", result);
// // 查看存储的数据
// const storedData = JSON.parse(localStorage.getItem("zhaomuDrawData") || "{}");
// console.log("累计抽奖次数：", storedData.totalDraws);
// console.log("已抽武将：", storedData.drawnHeroes);
