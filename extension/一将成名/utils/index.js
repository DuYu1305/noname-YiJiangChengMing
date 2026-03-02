import { lib, game, ui, get, ai, _status } from "../../../noname.js";
import { xinshaConfig, doudizhuConfig } from "../config/dynamicSkin.js";
export const EXTENSION_NAME = "一将成名";
let brightnessFilter = null;
export const baseUrl = `${lib.assetURL}extension/${EXTENSION_NAME}/`;

export const audioPath = baseUrl + "resource/audio/";
export const spinePath = baseUrl + "resource/spine/";
export const imgPath = baseUrl + "resource/image/";
export const cssPath = baseUrl + "style/";
export async function playDtSound(round = true, soundName = "7") {
  // if (round) {
  // 	let nameList = ["2", "4", "8", "9", "10", "11"];
  // 	//随机取一个
  // 	soundName = nameList[Math.floor(Math.random() * nameList.length)];
  // }
  // if (PIXI.sound.exists(`outgame${soundName}`)) {
  // 	PIXI.sound.play(`outgame${soundName}`, { loop: true });
  // 	return;
  // }
  if (PIXI.sound.exists(`outgame`)) {
    PIXI.sound.play(`outgame`, { loop: true });
    return;
  }
}
export const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
/**
 * 获取当前赛季名称
 * 赛季为S+数字格式，每月更新一次，数字加1
 * 当前基准赛季为S64
 */
export function getCurrentSeason() {
  // 基准赛季及对应的月份（2025年9月为S64）
  const baseSeason = 64;
  const baseYear = 2025;
  const baseMonth = 9; // 9表示9月

  // 获取当前日期
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 月份从0开始，所以加1

  // 计算从基准赛季到现在的总月数差
  const totalMonthsDiff =
    (currentYear - baseYear) * 12 + (currentMonth - baseMonth);

  // 计算当前赛季号
  const currentSeasonNumber = baseSeason + totalMonthsDiff;

  return `S${currentSeasonNumber}`;
}
export function daysUntilEndOfMonth() {
  // 获取当前日期
  const today = new Date();

  // 获取本月的年份和月份
  const year = today.getFullYear();
  const month = today.getMonth();

  // 创建一个表示本月最后一天的日期对象
  // 下个月的第0天就是本月的最后一天
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // 计算今天到月底的天数差
  const daysDiff = lastDayOfMonth.getDate() - today.getDate();

  return daysDiff;
}
export function moveAn(sprite, targetX, startX = 0) {
  if (!targetX) {
    targetX = sprite.x;
  }
  // 使用GSAP创建移动动画
  // 使用GSAP的fromTo方法创建动画
  gsap.fromTo(
    sprite,
    // 起始状态
    {
      x: startX, // 从屏幕中间X位置开始
    },
    // 结束状态
    {
      x: targetX, // 移动到左侧目标X位置
      duration: 0.5, // 动画持续1秒
      ease: "power2.out", // 缓动效果
    }
  );
}
export function scaleAn(button, targetScale = 1.2) {
  const originalScale = { x: button.scale.x, y: button.scale.y };
  gsap.to(button.scale, {
    x: originalScale.x * targetScale, // 放大到1.2倍
    y: originalScale.y * targetScale,
    duration: 0.15, // 动画持续时间
    ease: "power2.out", // 缓动函数，让动画更自然
    // 动画完成后恢复原始大小
    onComplete: () => {
      gsap.to(button.scale, {
        x: originalScale.x,
        y: originalScale.y,
        duration: 0.15,
        ease: "power2.in",
      });
    },
  });
}
export function getMax(num, ratios) {
  return Math.max(num, num * ratios.value);
}
export function delayFn(time){
  return new Promise((resolve) => {
    let t = setTimeout(() => {
      clearTimeout(t);
      resolve();
    }, time);
  })
}
export function getUserInfo() {
  let userInfo = sessionStorage.getItem("userInfo");
  if (userInfo) {
    return JSON.parse(userInfo);
  }
  return null;
}
export function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(text)
      .then(function () {
        ui.create.toast("已复制！");
      })
      .catch(function (err) {
        console.error("Failed to copy text: ", err);
      });
  } else {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      var successful = document.execCommand("copy");
      var msg = successful ? "successful" : "unsuccessful";
      ui.create.toast("已复制！");
    } catch (err) {
      console.log("Oops, unable to copy");
    }
    document.body.removeChild(textArea);
  }
}
export function getUserName() {
  let userInfo = getUserInfo();
  if (userInfo) {
    if (userInfo.username.length > 6) {
      userInfo.username = userInfo.username.slice(0, 6) + "...";
    }
    return userInfo.username;
  }
  return "";
}
export function initClickBtn(btn, normalImg, overImg, audioName, onClick) {
  btn.interactive = true;
  btn.cursor = "pointer";
  btn.on("pointerdown", () => {
    if (audioName) {
      debouncePlay(audioName);
    }
    addBtnFilter(btn);
    if (onClick) {
      onClick();
    }
  });
  if (overImg) {
    btn.on("mouseover", () => {
      btn.texture = overImg;
    });
    btn.on("mouseout", () => {
      btn.texture = normalImg;
    });
  }
}
export function isTargetMode(mode, modetype) {
  // return get.mode() == "doudizhu" && lib.config.mode_config.doudizhu.doudizhu_mode == "huanle"
  return (
    get.mode() == mode &&
    lib.config.mode_config[mode][`${mode}_mode`] == modetype
  );
}
//拿到配置的骨骼参数
export function getBGAnInfo(anType = "dating") {
  //处理大厅骨骼
  let pbSrc = spinePath + "zhujiemian/";
  let configType = "doudizhuguge";
  let gugeConfig = doudizhuConfig;
  if (anType == "dating") {
    configType = "xinshaguge";
    gugeConfig = xinshaConfig;
  }
  let theme =
    lib.config[`extension_${EXTENSION_NAME}_${configType}`] || "威曹丕";
  if (theme == "suiji") {
    theme = Object.keys(gugeConfig).filter((item) => item != "suiji")[
      Math.floor(Math.random() * Object.keys(gugeConfig).length)
    ];
  }
  let configKeys = Object.keys(gugeConfig);
  let configName = configKeys[0];
  if (theme && gugeConfig[theme]) {
    configName = theme;
  }
  if (gugeConfig[configName].sznSrc) {
    pbSrc = `${lib.assetURL}extension/十周年UI/assets/dynamic/`;
  }
  let pcName = isMobile ? "" : "pc";
  let petype = gugeConfig[configName].json ? "json" : "skel";
  let peSrc = `${pbSrc + gugeConfig[configName].name}.${petype}`;
  let pexArr = gugeConfig[configName].x || [0, 0.5];
  let peyArr = gugeConfig[configName].y || [0, 0.5];
  let peScale = gugeConfig[configName][pcName + "scale"];
  if (!peScale) {
    peScale = gugeConfig[configName]["scale"] || 1;
  }

  let bjtype = gugeConfig[configName].beijing.json ? "json" : "skel";
  let bjSrc = `${pbSrc + gugeConfig[configName].beijing.name}.${bjtype}`;
  let bjxArr = gugeConfig[configName].beijing.x || [0, 0.5];
  let bjyArr = gugeConfig[configName].beijing.y || [0, 0.5];
  let bjScale = gugeConfig[configName].beijing[pcName + "scale"];
  if (!bjScale) {
    bjScale = gugeConfig[configName].beijing["scale"] || 1;
  }

  return {
    peSrc,
    bjSrc,
    peScale,
    bjScale,
    pexArr,
    peyArr,
    bjxArr,
    bjyArr,
  };
}
//对拿到的骨骼参数初始化
export function initPBAnimation(
  pixiApp,
  ratios,
  spinePeople,
  spineBg,
  pbPosInfo
) {
  let { peScale, bjScale, pexArr, peyArr, bjxArr, bjyArr } = pbPosInfo;
  spinePeople.width = pixiApp.value.screen.width;
  spinePeople.height = pixiApp.value.screen.height;
  spineBg.width = pixiApp.value.screen.width;
  spineBg.height = pixiApp.value.screen.height;

  spinePeople.x = pexArr[1] * pixiApp.value.screen.width + pexArr[0];

  spinePeople.y = peyArr[1] * pixiApp.value.screen.height + peyArr[0];

  spineBg.x = bjxArr[1] * pixiApp.value.screen.width + bjxArr[0];
  spineBg.y = bjyArr[1] * pixiApp.value.screen.height + bjyArr[0];

  spinePeople.scale.set(peScale * ratios.value);
  spineBg.scale.set(bjScale * ratios.value);

  let peDaiji, peGongji, peChuchang, bjDaiji, bjGongji, bjChuchang;
  let bjanimations = spineBg.stateData.skeletonData.animations;
  let peanimations = spinePeople.stateData.skeletonData.animations;
  spinePeople.interactive = true;
  for (let i = 0; i < bjanimations.length; i++) {
    //新杀
    if (bjanimations[i].name.toLowerCase() === "play") {
      bjDaiji = bjanimations[i].name;
    }
    if (bjanimations[i].name.toLowerCase() === "play2") {
      bjGongji = bjanimations[i].name;
    }
    //手杀
    if (bjanimations[i].name.toLowerCase() === "chuchang") {
      bjChuchang = bjanimations[i].name;
    }
    if (bjanimations[i].name.toLowerCase() === "beijing") {
      bjDaiji = bjanimations[i].name;
    }
    if (bjanimations[i].name.toLowerCase() === "daiji") {
      bjDaiji = bjanimations[i].name;
    }
  }
  for (let i = 0; i < peanimations.length; i++) {
    //新杀
    if (peanimations[i].name.toLowerCase() === "play") {
      peDaiji = peanimations[i].name;
    }
    if (peanimations[i].name.toLowerCase() === "play2") {
      peGongji = peanimations[i].name;
    }
    //手杀
    if (peanimations[i].name.toLowerCase() === "chuchang") {
      peChuchang = peanimations[i].name;
    }
    if (peanimations[i].name.toLowerCase() === "daiji") {
      peDaiji = peanimations[i].name;
    }
    if (peanimations[i].name.toLowerCase() === "gongji") {
      peGongji = peanimations[i].name;
    }
    if (peanimations[i].name.toLowerCase() === "hudong") {
      peDaiji = peanimations[i].name;
    }
  }

  if (peChuchang) {
    spinePeople.state.setAnimation(0, peChuchang, true);
    spinePeople.state.addListener({
      complete(track, event) {
        try {
          spinePeople.state.setAnimation(0, peDaiji, true);
        } catch (error) {
          console.error(error);
        }
      },
    });
    if (peGongji) {
      spinePeople.on("pointerdown", () => {
        try {
          spinePeople.state.setAnimation(0, peGongji, true);
        } catch (error) {
          console.error(error);
        }
      });
    }
  } else {
    spinePeople.state.setAnimation(0, peGongji || peDaiji, true);
    if (peGongji) {
      spinePeople.state.addListener({
        complete(track, event) {
          try {
            spinePeople.state.setAnimation(0, peDaiji, true);
          } catch (error) {
            console.error(error);
          }
        },
      });
      spinePeople.on("pointerdown", () => {
        try {
          spinePeople.state.setAnimation(0, peGongji, true);
        } catch (error) {
          console.error(error);
        }
      });
    }
  }
  if (bjChuchang) {
    spineBg.state.setAnimation(0, bjChuchang, true);
    spineBg.state.addListener({
      complete(track, event) {
        spineBg.state.setAnimation(0, bjDaiji, true);
      },
    });
  } else {
    spineBg.state.setAnimation(0, bjDaiji, true);
  }
}
export function addBtnFilter(btn) {
  if (!brightnessFilter) {
    brightnessFilter = new PIXI.filters.AdjustmentFilter({
      gamma: 1,
    });
  }
  btn.filters = [brightnessFilter];
  // 使用 gsap 库创建 Tween 对象，使亮度调整滤镜在一定时间内慢慢增加到 4
  gsap.to(brightnessFilter, {
    duration: 0.3,
    ease: "power2.inOut",
    gamma: 3,
    onUpdate: () => {
      btn.filters = [brightnessFilter];
    },
    onComplete: () => {
      btn.filters = null;
    },
  });
}
export function showDrawer(container, direction, pixiApp, ratiow) {
  let duration = 0.5;
  const ease = "power2.out";
  let start, end;
  switch (direction) {
    case "top":
      start = {
        y: -300,
      };
      end = {
        y: 0,
      };
      duration = 0.3;
      break;
    case "under":
      start = {
        y: 1.5 * pixiApp.value.screen.height,
      };
      end = {
        y: 0.91 * pixiApp.value.screen.height,
      };
      duration = 0.3;
      break;
    case "left":
      start = {
        x: -300,
      };
      end = {
        x: 0,
      };
      break;
    case "right":
      start = {
        x: 1.5 * pixiApp.value.screen.width,
      };
      end = {
        x: pixiApp.value.screen.width - container.width * 2 - 15 * ratiow.value,
      };
      break;
    default:
      console.error(`Invalid direction: ${direction}`);
      return;
  }
  gsap
    .fromTo(container, duration, start, end, {
      ease,
    })
    .restart();
}

export function hideDrawer(container, direction, pixiApp) {
  let duration = 0.8;
  let ease = "power2.out";
  let start, end;
  switch (direction) {
    case "top":
      start = {
        y: -300,
      };
      end = {
        y: 0,
      };
      break;
    case "under":
      start = {
        y: 1.5 * pixiApp.value.screen.height,
      };
      end = {
        y: pixiApp.value.screen.height * 0.91,
      };
      break;
    case "left":
      start = {
        x: -300,
      };
      end = {
        x: 0,
      };
      break;
    case "right":
      start = {
        x: 1.5 * pixiApp.value.screen.width,
      };
      end = {
        x: pixiApp.value.screen.width * 0.9,
      };
      break;
    default:
      console.error(`Invalid direction: ${direction}`);
      return;
  }
  gsap
    .fromTo(container, duration, end, start, {
      ease,
    })
    .restart();
}
export function createBackBtn(
  title,
  pixiApp,
  xloader,
  ratiow,
  ratioh,
  ratios,
  oppeen,
  propOpenmode,
  helpClick
) {
  function getMax(num) {
    return Math.max(num, num * ratios.value);
  }
  let baseUi = xloader.value.resources.baseUi.textures;

  let backCon = new PIXI.Container();

  let backBg = new PIXI.Sprite(baseUi["newStyleBaseUITopNameBg.png"]);
  backBg.width = getMax(250);
  backBg.height = getMax(40);

  let backBtn = new PIXI.Sprite(baseUi["newStyleBaseUITopNameBackBtn.png"]);
  backBtn.x = 30;
  backBtn.scale.set(getMax(0.9));
  backBtn.interactive = true;
  backBtn.buttonMode = true;
  backBtn.on("pointerdown", oppeen);

  let fontSize = getMax(22);
  let text = new PIXI.Text(title, {
    //设置字体
    // fontFamily: "xingkai",
    //设置颜色
    fill: "#FDDA82",
    //设置字体大小
    fontSize,
  });
  text.x = backBtn.x + backBtn.width + 10;
  text.y = 5;
  backCon.addChild(backBg, backBtn, text);

  let helpSprit = null;
  if (helpClick) {
    helpSprit = new PIXI.Sprite(baseUi["newStyleBaseUIHelpBtnOver.png"]);
    helpSprit.x = text.x + text.width + 5;
    helpSprit.scale.set(getMax(0.9));
    helpSprit.interactive = true;
    helpSprit.buttonMode = true;
    helpSprit.on("pointerdown", () => {
      helpClick();
    });
    backCon.addChild(helpSprit);
  }
  return {
    backCon,
    text,
    backBtn,
  };
}
export async function loadScript(src) {
  if (document.querySelector(`script[src="${src}"]`)) {
    return;
  }
  await lib.init.promises.js(src);
  return;
}
export async function getFloders(url) {
  return new Promise((resolve, reject) => {
    game.getFileList(url, resolve, reject); // 初始化文件列表
  });
}
let timer = null;
//全局防抖播放音乐
export function debouncePlay(name = "PopUp", delay = 100) {
  if (timer) {
    return;
  }
  timer = setTimeout(() => {
    if (PIXI.sound.exists(name)) {
      PIXI.sound.play(name);
    }
    timer = null;
  }, delay);
}
/**防抖 */
export function debounce(func, delay) {
  let timer = null;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.apply(this, args);
      timer = null;
    }, delay);
  };
}
/**节流 */
export function throttle(func, delay) {
  let lastTime = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastTime >= delay) {
      func.apply(this, args);
      lastTime = now;
    }
  };
}
export function initPreCharter() {
  if (!lib._cust_character) {
    lib._cust_character = {};
    lib._cust_characterPack = {};
    lib._cust_translate = {
      ...lib.translate,
    };
    Object.keys(lib.imported.character).forEach((key) => {
      let characters = lib.imported.character[key].character;
      let translate = lib.imported.character[key].translate;

      lib._cust_translate = {
        ...lib._cust_translate,
        ...translate,
      };

      lib._cust_characterPack[key] = {};
      Object.keys(characters).forEach((character) => {
        let characterData = characters[character];
        lib._cust_character[character] = characterData;
        lib._cust_characterPack[key][character] = characterData;
      });
    });
    // }
    console.log("lib.character", lib._cust_character);
    console.log("characterPack", lib._cust_characterPack);
    console.log("_cust_translate", lib._cust_translate);
  }

  lib._yjcm_wj_preview = function tanchuang(name, characterImage) {
    // alert("正在开发中....")
    console.log("name", name);
    // console.log("lib._cust_character",lib._cust_character[name].skills)
    // console.log("_cust_character", lib._cust_character[name])
    let cname = lib._cust_translate[name] || name;
   
    let skills = lib._cust_character[name].skills;

    //再加一层全屏的防止点击下面的元素
    let fullScreen = ui.create.div(".yjbpFullScreen", document.body,(event)=>{
      event.stopPropagation()
      fullScreen.remove();
    });
   
    let skillsCon = ui.create.div(".yjbpSkillCon", fullScreen);

    //下方con
    // 左侧展示图片
    let leftImg = ui.create.div(".yjbpLeftImg", skillsCon);
    if(characterImage){
      leftImg.style.backgroundImage = characterImage.style.backgroundImage;
    }else{
      leftImg.style.backgroundImage = `url(image/character/${name}.jpg)`;
    }
    // 右侧展示技能
    let rightInfo = ui.create.div(".yjbpRightInfo", skillsCon);

    //顶部关闭 + 武将名称栏
    let topInfo = ui.create.div(".yjbpTopInfo", rightInfo);
    //武将名称
    let nameDiv = ui.create.div(".yjbpNameDiv", cname, topInfo);
    //加入关闭按钮
    // let closeBtn = ui.create.div(".yjbpCloseBtn", topInfo, function (event) {
    //   event.stopPropagation()
    //   fullScreen.remove();
    // });
    let yansSkills = [];
    let group;
    if (lib._cust_character[name]) group = lib._cust_character[name].group;

    let groupImg = new Image();
    groupImg.src = imgPath + "/CreateCharacterSkill/" + group + ".png";
    groupImg.onload = function () {
      rightInfo.style.backgroundImage = 'url("' + groupImg.src + '")';
    };
    groupImg.onerror = function () {
      rightInfo.style.backgroundImage =
        'url("' + imgPath + "/CreateCharacterSkill/default.png";
      +'")';
    };
    let rightInfoInner = ui.create.div(".yjbpRightInfoInner", rightInfo);
    skills.forEach((skill) => {
      let div = ui.create.div(".yjbpSkill", rightInfoInner);
      let info = lib._cust_translate[skill + "_info"] || "";
      // console.log("skill", skill, info);
      const replacedText = info.replace(
        /<noname-poptip poptip = (\w+)><\/noname-poptip>/g,
        (match, key) => {
          // 直接通过key从映射表取值，无匹配则返回原标签（避免替换失败）
          if (key == "rule_chihengji") {
            //拥有此标签的技能不会被其他技能无效。
            return "持恒技";
          }
          if (key == "rule_rumo") {
            return "入魔";
          }
          yansSkills.push(key);
          return `〖${lib._cust_translate[key]}〗` || match;
        }
      );
      div.innerHTML += `
			<span class="yjbpSkillName">${lib._cust_translate[skill]}</span>
			<span class="yjbpSkillInfo">${replacedText}</span>
			`;

      // console.log("skill", lib._cust_translate[skill], replacedText);
    });
    yansSkills.forEach((skillKey) => {
      let info = lib._cust_translate[skillKey + "_info"] || "";

      const replacedText = info.replace(
        /<noname-poptip poptip = (\w+)><\/noname-poptip>/g,
        (match, key) => {
          // 直接通过key从映射表取值，无匹配则返回原标签（避免替换失败）
          if (key == "rule_chihengji") {
            //拥有此标签的技能不会被其他技能无效。
            return "持恒技";
          }
          if (key == "rule_rumo") {
            return "入魔";
          }
          return `〖${lib._cust_translate[key]}〗` || match;
        }
      );
      // console.log("skillKey", lib._cust_translate[skillKey + "_info"]);
      let div = ui.create.div(".yjbpSkill", rightInfoInner);
      div.innerHTML += `
			<span class="yjbpSkillName">${lib._cust_translate[skillKey]}</span>
			<span class="yjbpSkillInfo">${replacedText}</span>`;
    });
  };
}
