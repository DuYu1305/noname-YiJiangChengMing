import { lib, game, ui, get, ai, _status } from "../../../noname.js";
import { copyToClipboard, colMenu } from "../utils/utils.js";
import { createDGC } from "../extension/dagongche.js";

export async function config() {
  const baseUrl = `${lib.assetURL}extension/无名美化/`;
  const extensionInfo = await lib.init.promises.json(`${baseUrl}info.json`);
  return {
    wjmh_title_versiontitle: {
      name: `<font size='4'>版本号：${extensionInfo.version}</font>`,
      clear: true,
    },
    wjmh_title_toptitle1: {
      name: "<font size='4'>参考<span style='color:green; font-weight: bold;'>雷佬、柴油鹿鹿、天真、夕佬、西瓜、点点、小曦、棘手怀念摧毁、渔Isaro、浴皇大帝、柳下跖、铝宝、EngJ.K、无名玩家、残殇、※小佬、玄武江湖工作室、蒸佬、萌新（转型中）、短歌、赫拉西斯、橙续缘、空、某个萌新、u佬、诗笺、扶苏、眯咪狗、献忠</span>等大佬的代码或素材（排名顺序不分先后，若有写错纯粹手误勿怪，若有遗漏很抱歉），感谢以上大佬包括但不限于；</font>",
      clear: true,
    },
    wjmh_title_bilibili: {
      name: "<span style='color: gold; font-weight: bold;'>哔哩哔哩（点击复制主页链接到粘贴板）：<b style='color:yellow'>倘若的小号</b> </span>",
      clear: true,
      onclick() {
        copyToClipboard("https://space.bilibili.com/1086466776");
      },
    },
    wjmh_title_wechatCommon: {
      name: "<span style='color: gold; font-weight: bold;'>关注微信公众号（点击复制到粘贴板）：<b style='color:yellow'>无名杀资源库</b> 获取最新版本（dodo频道、qq频道同名）。</span>",
      clear: true,
      onclick() {
        copyToClipboard("无名杀资源库");
      },
    },
    wjmh_title_link: {
      name: "<font size='4' color='yellow'>夸克网盘链接(点击复制到粘贴板)：https://pan.quark.cn/s/f6c299d3feeb</font>",
      clear: true,
      onclick() {
        copyToClipboard("https://pan.quark.cn/s/f6c299d3feeb");
      },
    },
    wjmh_title_toptitle2: {
      name: "<font size='4' style='color:yellow'>配合最新本体与最新版十周年UI使用,需要安装皮切！，兼容webview128高版本。</font>",
      clear: true,
    },

    wjmh_title_use_end: {
      clear: true,
      name: "<span id='wjmh_title_use_end'></span>",
    },

    wjmh_title_effects: {
      clear: true,
      name:
        "<span style='color:red'><font size='4'>" +
        "特效测试&特效补充（点击后折叠）▽" +
        "</font></span>",
      onclick() {
        colMenu.call(this, "特效测试&特效补充", "wjmh_title_effects");
      },
    },
    changeTheme: {
      name: "特效一键切换-自动重启",
      intro: "一键切换三服特效，仅支持通用十周年UI！",
      init: "",
      item: {
        ol: "ol",
        shousha: "手杀",
        shizhounian: "十周年",
        yijiang: "一将成名",
      },
      onclick(item) {
        if (item == "ol") {
          game.saveConfig("extension_十周年UI_newDecadeStyle", "onlineUI");

          game.saveConfig("extension_无名美化_kaizhan", "ol|kaizhannew3");
          // game.saveConfig("extension_无名美化_gameovertexiao", "off");
          game.saveConfig("extension_无名美化_liansha", "ol");
          game.saveConfig("extension_无名美化_lianjiu", "off");
          game.saveConfig("extension_无名美化_nanmanruqin", "ol");
          game.saveConfig("extension_无名美化_juexingji", "ol");
          game.saveConfig("extension_无名美化_skilltexiao", "4");
        } else if (item == "shousha") {
          game.saveConfig("extension_十周年UI_newDecadeStyle", "off");
          game.saveConfig("extension_十周年UI_chupaizhishi", "shousha");
          game.saveConfig("extension_无名美化_kaizhan", "shousha|play3");
          // game.saveConfig("extension_无名美化_gameovertexiao", "shousha");
          game.saveConfig("extension_无名美化_liansha", "shousha");
          game.saveConfig("extension_无名美化_lianjiu", "shousha");
          game.saveConfig(
            "extension_无名美化_mubiaotexiao",
            "shousha|chupaizhishi"
          );
          game.saveConfig("extension_无名美化_daojianfu", "4.5");
          game.saveConfig("extension_无名美化_nanmanruqin", "shousha");
          game.saveConfig("extension_无名美化_juexingji", "shousha");
          game.saveConfig("extension_无名美化_skilltexiao", "1");
          game.saveConfig("extension_无名美化_gjrc", "dayuanshuai");

          //   gjrc
        } else if (item == "shizhounian") {
          game.saveConfig("extension_十周年UI_newDecadeStyle", "on");
          game.saveConfig("extension_十周年UI_chupaizhishi", "dasima");
          game.saveConfig("extension_无名美化_kaizhan", "shizhounian|dasima");
          // game.saveConfig("extension_无名美化_gameovertexiao", "shizhounian");
          game.saveConfig("extension_无名美化_lianzhantexiao", "shizhounian");
          game.saveConfig("extension_无名美化_liansha", "shizhounian");
          game.saveConfig("extension_无名美化_lianjiu", "shizhounian");
          game.saveConfig(
            "extension_无名美化_mubiaotexiao",
            "shizhounian|dajiangjun"
          );
          game.saveConfig("extension_无名美化_nanmanruqin", "shizhounian");
          game.saveConfig("extension_无名美化_juexingji", "off");
          game.saveConfig("extension_无名美化_skilltexiao", "4");
          game.saveConfig("extension_无名美化_gjrc", "sznrandom");
        } else if (item == "yijiang") {
          game.saveConfig("extension_十周年UI_newDecadeStyle", "othersOff");
          game.saveConfig("extension_十周年UI_chupaizhishi", "dasima");
          game.saveConfig("extension_无名美化_kaizhan", "shizhounian|dasima");
          // game.saveConfig("extension_无名美化_gameovertexiao", "shizhounian");
          game.saveConfig("extension_无名美化_lianzhantexiao", "shizhounian2");
          game.saveConfig("extension_无名美化_liansha", "shizhounian");
          game.saveConfig("extension_无名美化_lianjiu", "shizhounian");
          game.saveConfig(
            "extension_无名美化_mubiaotexiao",
            "shizhounian|dajiangjun"
          );
          game.saveConfig("extension_无名美化_nanmanruqin", "shizhounian");
          game.saveConfig("extension_无名美化_juexingji", "off");
          game.saveConfig("extension_无名美化_skilltexiao", "4");
          game.saveConfig("extension_无名美化_gjrc", "sznrandom");
        }
        game.saveConfig("extension_无名美化_changeTheme", item);
        setTimeout(() => game.reload(), 100);
      },
    },
    attack_zhishixian: {
      name: "攻击指示特效",
      intro: "设置卡牌、技能的指示特效",
      init: "off",
      // init: lib.config.zuanzhishixian === undefined ? 'moren' : lib.config.zuanzhishixian,
      item: {
        off: "关闭",
        moren: "默认",
        yulong: "玉龙指示线",
        jingdian: "十周年指示线",
      },
      onclick: function (item) {
        if (item.indexOf("next_") != -1) {
          var items = item.slice(5);
        } else {
          var items = item;
        }
        var value = !items || items == "moren";
        game.saveConfig("extension_无名美化_attack_zhishixian", items);
        game.saveConfig("zuanzhishixian", items);
        game.saveConfig("extension_十周年UI_playerLineEffect", value);
        if (window.decadeUI) decadeUI.config.playerLineEffect = value;
        if (items == "moren") {
          game.linexy = game.zsOriginLineXy;
        } else {
          game.linexy = game["zs" + items + "LineXy"];
        }
      },
    },
    juexingji: {
      name: "觉醒技特效",
      intro:
        "补充：虽然说是觉醒技，但不限于觉醒技，比如还有限定技、使命技等。<br>注意：①改自<十周年UI>的觉醒特效，所以要想使用此功能，需要开启<十周年UI>的“游戏动画特效”；②可能会受其他觉醒特效所影响，从而导致无法播放觉醒特效；",
      init: "off",
      item: {
        off: "关闭",
        shousha45: "手杀4.5",
        shousha: "手杀",
        ol: "OL",
      },
    },
    mianshangtexiao: {
      name: "免伤特效",
      init: true,
    },
    olhuoji: {
      name: "火攻特效",
      init: true,
    },
    zhungbei: {
      name: "装备牌装备特效",
      intro:
        "八卦阵、白银狮子、雌雄双股剑、方天画戟、贯石斧、古锭刀、寒冰剑、七宝刀、麒麟弓、青釭剑、青龙偃月刀、仁王盾、丈八蛇矛、诸葛连弩、朱雀羽扇",
      init: true,
    },
    kaizhan: {
      name: "开战动画",
      intro: "不要与其他开战动画一起使用，否则可能失效",
      init: "off",
      item: {
        off: "关闭",
        "ol|-1": "OL|随机",
        "ol|kaizhannew": "OL|金龙动画1",
        "ol|kaizhannew2": "OL|金龙动画2",
        "ol|kaizhannew3": "OL|金龙动画3",
        "shousha|play": "手杀|游戏开始",
        "shousha|-1": "手杀|随机",
        "shousha|play1": "手杀|双刀动画",
        "shousha|play2": "手杀|双剑动画",
        "shousha|play3": "手杀|双斧动画",
        "shizhounian|youxikaishi": "十周年|游戏开始",
        "shizhounian|-1": "十周年|随机",
        "shizhounian|putong": "十周年|普通",
        "shizhounian|jiangjun": "十周年|将军",
        "shizhounian|weijiangjun": "十周年|卫将军",
        "shizhounian|cheqijiangjun": "十周年|车骑将军",
        "shizhounian|piaoqijiangjun": "十周年|骠骑将军",
        "shizhounian|dajiangjun": "十周年|大将军",
        "shizhounian|dasima": "十周年|大司马",
        "other|-1": "其他|随机",
        "other|play": "其他|大元帅动画1",
        "other|play2": "其他|大元帅动画2",
        "other|play3": "其他|大元帅动画3",
      },
    },
    gjrc: {
      name: "官阶入场特效",
      intro: "官阶入场特效",
      init: "off",
      item: {
        off: "关闭",
        biaoqijiangjun: "骠骑将军",
        dajiangjun: "大将军",
        dasima: "大司马",
        guoduhu: "国都护",
        shangjiangjun: "上将军",
        dayuanshuai: "手杀大元帅",
        sznrandom: "十周年随机",
        random: "全部随机",
      },
    },
    gameovertexiao: {
      name: "游戏结算特效",
      intro: "“十周年”具有专属斗地主模式游戏结算特效",
      init: "off",
      item: {
        off: "关闭",
        shousha: "手杀",
        shizhounian: "十周年",
      },
    },
    // jinengfadong: {
    // 	name: "使用技能特效",
    // 	init: true,
    // 	intro: "使用技能时武将边框的闪烁特效",
    // },
    skilltexiao: {
      name: "发动技能特效",
      init: "off",
      item: {
        off: "关闭",
        1: "手杀",
        2: "兵临城主特效",
        3: "势力框闪烁",
        4: "OL、十周年样式",
      },
    },
    //待做
    skilltexiaoset: {
      name: "发动技能特效设置",
      intro: "仅OL、十周年样式有效",
      init: "shili",
      item: {
        shili: "根据势力",
        random: "随机样式",
      },
    },
    lianzhantexiao: {
      name: "连杀武将冒火特效",
      intro: "“十周年”：二杀、四杀、六杀，分别升级一次连斩特效；",
      init: "off",
      item: {
        off: "关闭",
        shizhounian: "十周年",
        shizhounian2: "新十周年",
      },
    },
    liansha: {
      name: "连杀特效",
      init: "off",
      item: {
        off: "关闭",
        shousha: "手杀",
        shizhounian: "十周年",
        ol: "OL",
      },
    },
	lianshaType: {
      name: "连杀计算方式",
      intro:"全局累加：全局连杀数累加；回合：每回合重新计算连杀数。",
      init: "round",
      item: {
        global: "全局累加",
        round: "回合",
      },
    },
    lianjiu: {
      name: "连救特效",
      init: "off",
      item: {
        off: "关闭",
        shousha: "手杀",
        shizhounian: "十周年",
      },
    },
    kapaishiyong: {
      name: "卡牌使用（龙头）特效",
      init: "off",
      item: {
        off: "关闭",
        "-1": "不限卡牌",
        damage: "只限伤害牌",
      },
    },
    daojianfu: {
      name: "受击特效/命中特效",
      intro:
        "此选项可以切换随机刀剑斧特效（手杀4.5版，拥有万箭齐发、南蛮入侵、火攻、决斗受击特效），根据个人喜好自行切换，重启生效",
      init: "4.5",
      item: {
        shousha: "手杀经典",
        4.5: "手杀4.5版",
        yjchuizi: "一将成名锤",
        yjfuzi: "一将成名斧",
        yjjian: "一将成名剑",
        yjsuiji: "一将成名随机",
        off: "关闭",
      },
    },
    // zhenwangtexiao: {
    //   name: "阵亡特效",
    //   init: "shizhounian",
    //   item: {
    //     off: "关闭",
    //     ol: "OL",
    //     shizhounian: "十周年",
    //   },
    // },
    zhuneidantiao: {
      name: "主内单挑特效",
      init: true,
    },
    // mubiaotexiao: {
    // 	name: "目标指示特效",
    // 	intro: "目标指示特效",
    // 	init: "off",
    // 	item: {
    // 		"shizhounian|jiangjun": "十周年将军",
    // 		"shizhounian|weijiangjun": "十周年卫将军",
    // 		"shizhounian|cheqijiangjun": "十周年车骑将军",
    // 		"shizhounian|biaoqijiangjun": "十周年骠骑将军",
    // 		"shizhounian|dajiangjun": "十周年大将军",
    // 		"shizhounian|dasima": "十周年大司马",
    // 		"shizhounian|-1": "十周年随机",
    // 		"shousha|chupaizhishi": "手杀出牌指示",
    // 		// 'shousha|chupaizhishiX': '手杀出牌指示X',
    // 		off: "关闭",
    // 	},
    // },
    jiubuff: {
      name: "酒状态特效",
      init: false,
    },
    nanmanruqin: {
      name: "南蛮入侵特效",
      init: "off",
      item: {
        off: "关闭",
        ol: "ol",
        shousha: "手杀",
        shizhounian: "十周年",
      },
    },
    wanjianqifa: {
      name: "万箭齐发特效",
      init: true,
    },
    nisiwohuo: {
      name: "你死我活特效",
      init: true,
    },
    wjmh_title_effects_end: {
      clear: true,
      name: "<span id='wjmh_title_effects_end'></span>",
    },
    wjmh_title_tool: {
      clear: true,
      name:
        "<span style='color:red'><font size='4'>" +
        "局内实用功能（点击后折叠）▽" +
        "</font></span>",
      onclick() {
        colMenu.call(this, "实用功能", "wjmh_title_tool");
      },
    },
    AIReChoose: {
      name: "AI重选武将",
      init: false,
      intro: "游戏开始时玩家可以为AI或自己重新选将。(限身份场、斗地主、对决)",
    },
    wmluckyCards: {
      name: "定向手气卡",
      init: false,
      intro: "开启后可以定向指定手气卡",
    },
    wmViewHandcard: {
      name: "查看AI手牌",
      init: false,
      intro: "观看AI手牌",
    },
    wmmh_close_top: {
      name: "关闭动皮圆顶",
      intro: "关闭所有的动皮圆顶",
      init: false,
    },
    wjmh_title_tool_end: {
      clear: true,
      name: "<span id='wjmh_title_tool_end'></span>",
    },
    wjmh_title_skill: {
      clear: true,
      name:
        "<span style='color:red'><font size='4'>" +
        "技能特效（点击后折叠）▽" +
        "</font></span>",
      onclick() {
        colMenu.call(this, "技能特效", "wjmh_title_skill");
      },
    },
    dagongche: {
      name: "大攻车",
      init: true,
    },
    dagongche_title: {
      clear: true,
      name: "大攻车设置",
      onclick() {
        if (!ui.dagongche) {
          ui.dagongche = createDGC();
        }
        ui.dagongche.show = true;
      },
    },
    caoyi: {
      name: "曹轶|变身特效",
      init: "off",
      item: {
        off: "关闭",
        yuanhua: '<span style="color:#FF0000;font-size:14px">原画</span>',
        shizhounian:
          '<span style="color:#FF0000;font-size:14px">十周年露头</span>',
        shousha: '<span style="color:#FF0000;font-size:14px">手杀露头</span>',
      },
    },
    shenjiangwei: {
      name: "手杀神姜维特效",
      init: true,
    },
    mosimayi: {
      name: "魔司马懿",
      init: true,
    },
    mosunquan: {
      name: "魔孙权",
      init: true,
    },
    mocaocao: {
      name: "魔曹操",
      init: true,
    },
    modiaochan: {
      name: "魔貂蝉",
      init: true,
    },
    molvbu: {
      name: "魔吕布",
      init: "background",
      item: {
        off: "关闭",
        default: "默认",
        background: "背景播放",
      },
    },
    sunlingluan: {
      name: "孙翎鸾|变身特效",
      init: true,
    },
    olmouzhangxiu: {
      name: "OL谋张绣|仇猎特效",
      init: true,
    },
    mouguanyu: {
      name: "谋关羽|武圣特效",
      init: true,
    },
    shenlusu: {
      name: "神鲁肃|特效",
      init: true,
    },
    shenhuatuo: {
      name: "神华佗|特效",
      init: true,
    },
    moumachao: {
      name: "谋马超|谋奕特效",
      init: true,
    },
    mouxuhuang: {
      name: "谋徐晃|谋奕特效",
      init: true,
    },
    shenpei: {
      name: "审配|谋奕特效",
      init: true,
    },
    xinzhangyi: {
      name: "手杀界张嶷|谋奕特效",
      init: true,
    },
    sbspzhugeliang: {
      name: "谋诸葛|使命失败特效",
      init: true,
    },
    zhouchu: {
      name: "周处|使命失败特效",
      init: true,
    },
    shentaishici: {
      name: "神太史|慈使命失败特效",
      init: true,
    },
    spmifuren: {
      name: "糜夫人|使命失败特效",
      init: true,
    },
    wangling: {
      name: "王凌|使命失败特效",
      init: true,
    },
    sbsunshangxiang: {
      name: "谋孙尚香|使命失败特效",
      init: true,
    },
    ssyangfeng: {
      name: "手杀杨奉|使命失败特效",
      init: true,
    },
    kanze: {
      name: "阚泽|“宽释”发动特效",
      init: true,
    },
    lijue: {
      name: "李傕|“狼袭”未命中特效",
      init: true,
    },
    huanzhugeliang: {
      name: "幻诸葛|特效",
      init: true,
    },
    huanzhugeliang_qiepi: {
      name: "幻诸葛入幻切换动皮",
      init: false,
    },
    huancaoang: {
      name: "幻曹昂|特效",
      init: true,
    },
    huancaoang_qiepi: {
      name: "幻曹昂入幻切换动皮",
      init: false,
    },
    simashi: {
      name: "手杀司马师|“景略”特效",
      init: true,
    },
    pangfengyi: {
      name: "庞凤衣|特效",
      init: true,
    },
    moujiaxu: {
      name: "谋贾诩|特效",
      init: true,
    },
    xiaoqiao: {
      name: "谋小乔|改判特效",
      init: true,
    },
    zhangqiying: {
      name: "张琪瑛|改判特效",
      init: true,
    },
    liuye: {
      name: "刘晔|霹雳车",
      init: true,
    },
    mbcaomao: {
      name: "曹髦|特效",
      init: "a",
      item: {
        a: "向死存魏",
        b: "枭龙破渊",
        off: "关闭",
      },
    },
    cmqhdp: {
      name: "曹髦切换动皮",
      init: false,
    },
    simazhao: { name: "司马昭|特效", init: true },
    msmzdpqh: {
      name: "司马昭切换动皮",
      init: false,
    },
    mbshichangshi: {
      name: "十常侍|殁亡特效",
      init: true,
    },
    weimachao: {
      name: "威马超|特效",
      init: true,
    },
    weimachaojian: {
      name: "威马超|🗡",
      intro: "适配点点的十周年ui，萌修版自己调试样式。",
      init: true,
    },
    weilvbu: {
      name: "威吕布|特效",
      init: true,
    },
    weilvbujian: {
      name: "威吕布|🗡",
      intro: "适配点点的十周年ui，萌修版自己调试样式。",
      init: true,
    },
    weidongzhuo: {
      name: "威董卓|特效",
      init: true,
    },
    weidongzhuojian: {
      name: "威董卓|🗡",
      intro: "适配点点的十周年ui，萌修版自己调试样式。",
      init: true,
    },
    weizhangliao: {
      name: "威张辽|特效",
      init: true,
    },
    weizhangliaojian: {
      name: "威张辽|🗡",
      intro: "适配点点的十周年ui，萌修版自己调试样式。",
      init: true,
    },
    shitaishici: {
      name: "势太史慈|特效",
      init: true,
    },
    wolongyance: {
      name: "友诸葛|卧龙演策",
      init: true,
    },
    spliubei: {
      name: "ol-sp刘备|惊雷",
      init: true,
    },
    shenhuangzhong: {
      name: "神黄忠",
      init: true,
    },
    shenzhonghui: {
      name: "神钟会",
      init: true,
    },
    olcaochun: {
      name: "ol曹纯|特效",
      init: true,
    },
    shiyuji: {
      name: "势于吉|特效",
      init: true,
    },
    shiweiyan: {
      name: "势魏延|特效",
      init: true,
    },
    qiaogong: {
      name: "桥公|遗珠",
      init: true,
    },
    olmiheng: {
      name: "ol祢衡|飞辩",
      init: true,
    },
    wjmh_title_skill_end: {
      clear: true,
      name: "<span id='wjmh_title_skill_end'></span>",
    },

    wjmh_title_game: {
      clear: true,
      name:
        "<span style='color:red'><font size='4'>" +
        "小游戏武将（点击后折叠）▽" +
        "</font></span>",
      onclick() {
        colMenu.call(this, "小游戏武将", "wjmh_title_game");
      },
    },
    mbchongxu: {
      name: "孙寒华",
      init: true,
    },
    sunhanhuaBiaoji: {
      name: "孙寒华|标记美化",
      init: true,
    },
    gameSpeed: {
      name: "冲虚游戏速度",
      init: "4",
      item: {
        0: "0（最快）",
        1: "1",
        2: "2",
        3: "3",
        4: "4",
        5: "5",
        6: "6",
        7: "7",
        8: "8（最慢）",
      },
    },
    nanhualaoxian: {
      name: "南华老仙",
      init: true,
    },
    zhengxuan: {
      name: "郑玄",
      init: true,
    },
    pangdegong: {
      name: "庞德公",
      init: true,
    },
    puyuan: {
      name: "ol蒲元",
      init: true,
    },
    majun: {
      name: "马钧",
      init: true,
    },
    zhouqun: {
      name: "周群",
      init: true,
    },
    wjmh_title_game_end: {
      clear: true,
      name: "<span id='wjmh_title_game_end'></span>",
    },
    wjmh_title_ui: {
      clear: true,
      name:
        "<span style='color:red'><font size='4'>" +
        "游戏、UI优化（点击后折叠）▽" +
        "</font></span>",
      onclick() {
        colMenu.call(this, "游戏、UI优化", "wjmh_title_ui");
      },
    },
    caojinyu: { name: "曹金玉优化", init: true },
    timeTheme: {
      name: "进度条风格",
      intro: "设置对话框进度条风格",
      init: "follow",
      item: {
        decade: "十周年",
        shousha: "手杀",
        follow: "跟随十周年UI设定",
      },
    },

    wjmh_title_ui_end: {
      clear: true,
      name: "<span id='wjmh_title_ui_end'></span>",
    },
  };
}
