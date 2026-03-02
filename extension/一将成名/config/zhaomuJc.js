//配置将符的基础数量
export const jiangfuBaseNum = {
  sssa: 1000,
  sssb: 100,
  ssa: 60,
  ssb: 6,
  s: 2,
};
//配置将符倍数概率 
export const jiangfuMultiple = {
  1: 30,
  2: 30,
  4: 20,
  6: 13,
  8: 5,
  10: 2,
};
//武将对应的帅点
export const wjshuaidian = {
  sssa: 500,
  sssb: 500,
  ssa: 120,
  ssb: 120,
  s: 60,
};
//配置概率 
export const levelProbability = {
  sssa: 0.1,
  sssb: 0.5,
  ssa: 6.67,
  ssb: 20,
  s: 72.73,
};
//配置将池
export const zhaomuMap = {
  //祈福SSS武将池
  sssa: [
    {
      name: "司马徽",
      id: "simahui",
    },
    {
      name: "鲍三娘",
      id: "xin_baosanniang",
    },
    {
      name: "关索",
      id: "dc_guansuo",
    },
    {
      name: "徐荣",
      id: "xurong",
    },
    {
      name: "曹婴",
      id: "caoying",
    },
    {
      name: "张琪瑛",
      id: "y_dc_zhangqiying",
    },
    {
      name: "程昱",
      id: "chengyu",
    },
    {
      name: "曹纯",
      id: "dc_caochun",
    },
    {
      name: "赵襄",
      id: "dc_zhaoxiang",
    },
  ],
  //限定SSS武将池
  sssb: [
    {
      name: "吕玲绮",
      id: "lvlingqi",
    },
    {
      name: "郭照",
      id: "guozhao",
    },
    {
      name: "胡昭",
      id: "huzhao",
    },
    {
      name: "黄权",
      id: "dc_huangquan",
    },
    {
      name: "管亥",
      id: "guanhai",
    },
    {
      name: "SP贾诩",
      id: "dc_sp_jiaxu",
    },
    {
      name: "公孙度",
      id: "gongsundu",
    },
    {
      name: "杨婉",
      id: "yangwan",
    },
    {
      name: "潘淑",
      id: "re_panshu",
    },
    {
      name: "南华老仙",
      id: "re_nanhualaoxian",
    },
    {
      name: "王烈",
      id: "wanglie",
    },
    {
      name: "张嫙",
      id: "zhangxuan",
    },
    {
      name: "孙茹",
      id: "dc_sunru",
    },
    {
      name: "诸葛尚",
      id: "zhugeshang",
    },
    {
      name: "牛辅",
      id: "niufu",
    },
    {
      name: "滕公主",
      id: "tenggongzhu",
    },
    {
      name: "兀突骨",
      id: "wutugu",
    },
    {
      name: "孙皓",
      id: "sunhao",
    },
    {
      name: "陈琳",
      id: "chenlin",
    },
    {
      name: "士燮",
      id: "dc_shixie",
    },
    {
      name: "杨修",
      id: "yangxiu",
    },
    {
      name: "文鸯",
      id: "wenyang",
    },
    {
      name: "张昌蒲",
      id: "zhangchangpu",
    },
    {
      name: "蒋干",
      id: "jianggan",
    },
    {
      name: "葛玄",
      id: "gexuan",
    },
    {
      name: "花鬘",
      id: "huaman",
    },
    {
      name: "皇甫嵩",
      id: "huangfusong",
    },
    {
      name: "管辂",
      id: "guanlu",
    },
    {
      name: "辛宪英",
      id: "re_xinxianying",
    },
    {
      name: "蒲元",
      id: "puyuan",
    },
    {
      name: "王荣",
      id: "wangrong",
    },
    {
      name: "雷铜",
      id: "leitong",
    },
    {
      name: "王双",
      id: "wangshuang",
    },
    {
      name: "刘琦",
      id: "sp_liuqi",
    },
    {
      name: "董承",
      id: "re_dongcheng",
    },
    {
      name: "张虎",
      id: "zhanghu",
    },
    {
      name: "留赞",
      id: "re_liuzan",
    },
    {
      name: "刘辩",
      id: "liubian",
    },
    {
      name: "庞德公",
      id: "re_pangdegong",
    },
    {
      name: "童渊",
      id: "tongyuan",
    },
    {
      name: "陈登",
      id: "re_chendeng",
    },
  ],
  //高级SS武将池
  ssa: [
    {
      name: "陈珪",
      id: "chengui",
    },
    {
      name: "田畴",
      id: "tianchou",
    },
    {
      name: "陆凯",
      id: "lukai",
    },
    {
      name: "吕旷吕翔",
      id: "dc_lvkuanglvxiang",
    },
    { name: "尹夫人", id: "yinfuren" },
    {
      name: "胡班",
      id: "dc_huban",
    },
    {
      name: "轲比能",
      id: "kebineng",
    },
    {
      name: "王威",
      id: "wangwei",
    },
    {
      name: "穆顺",
      id: "mushun",
    },
    {
      name: "雷薄",
      id: "leibo",
    },
    {
      name: "胡金定",
      id: "dc_hujinding",
    },
    {
      name: "沙摩柯",
      id: "shamoke",
    },
    {
      name: "忙牙长",
      id: "mangyachang",
    },
    {
      name: "许贡",
      id: "xugong",
    },
    {
      name: "李傕",
      id: "lijue",
    },
    {
      name: "郭汜",
      id: "guosi",
    },
    {
      name: "樊稠",
      id: "fanchou",
    },
    {
      name: "张济",
      id: "zhangji",
    },
    {
      name: "吕范",
      id: "lvfan",
    },
    {
      name: "刘宏",
      id: "liuhong",
    },
    {
      name: "麴义",
      id: "re_quyi",
    },
    {
      name: "何进",
      id: "re_hejin",
    },
    {
      name: "张让",
      id: "zhangrang",
    },
    {
      name: "韩馥",
      id: "hanfu",
    },
    {
      name: "孙鲁育",
      id: "re_sunluyu",
    },
    {
      name: "华歆",
      id: "huaxin",
    },
    {
      name: "陶谦",
      id: "re_taoqian",
    },
    {
      name: "张邈",
      id: "zhangmiao",
    },
    {
      name: "曹安民",
      id: "caoanmin",
    },
    {
      name: "何晏",
      id: "heyan",
    },
    {
      name: "唐姬",
      id: "tangji",
    },
    {
      name: "杜夫人",
      id: "dufuren",
    },
    {
      name: "荀谌",
      id: "re_xunchen",
    },

    {
      name: "陆郁生",
      id: "luyusheng",
    },
    {
      name: "梁兴",
      id: "liangxing",
    },
    {
      name: "段煨",
      id: "duanwei",
    },
    {
      name: "宗预",
      id: "zongyu",
    },
    {
      name: "丘力居",
      id: "qiuliju",
    },
    {
      name: "阚泽",
      id: "re_kanze",
    },

    {
      name: "孙綝",
      id: "dc_sunchen",
    },
    {
      name: "赵嫣",
      id: "zhaoyan",
    },
    {
      name: "刘永",
      id: "liuyong",
    },
    {
      name: "祢衡",
      id: "re_miheng",
    },
    {
      name: "严夫人",
      id: "yanfuren",
    },
    {
      name: "王桃",
      id: "wangtao",
    },
    {
      name: "王悦",
      id: "wangyue",
    },
    {
      name: "邓芝",
      id: "re_dengzhi",
    },
    {
      name: "冯熙",
      id: "fengxi",
    },
    {
      name: "朱灵",
      id: "dc_zhuling",
    },
  ],
  //SS级武将池
  ssb: [
    {
      name: "黄忠",
      id: "re_huangzhong",
    },
    {
      name: "魏延",
      id: "re_weiyan",
    },
    {
      name: "曹仁",
      id: "caoren",
    },
    {
      name: "小乔",
      id: "xiaoqiao",
    },
    {
      name: "周泰",
      id: "zhoutai",
    },
    {
      name: "荀彧",
      id: "xunyu",
    },
    {
      name: "贾诩",
      id: "jiaxu",
    },
    {
      name: "鲁肃",
      id: "re_lusu",
    },
    {
      name: "张郃",
      id: "zhanghe",
    },
    {
      name: "邓艾",
      id: "dengai",
    },
    {
      name: "张角",
      id: "sp_zhangjiao",
    },

    {
      name: "曹丕",
      id: "caopi",
    },
    {
      name: "姜维",
      id: "jiangwei",
    },
    {
      name: "刘禅",
      id: "liushan",
    },
    {
      name: "孙策",
      id: "sunce",
    },
    {
      name: "张昭张纮",
      id: "zhangzhang",
    },
    {
      name: "蔡琰",
      id: "caiwenji",
    },
    {
      name: "陆绩",
      id: "luji",
    },
    {
      name: "许攸",
      id: "xuyou",
    },
    {
      name: "诸葛瞻",
      id: "zhugezhan",
    },
    {
      name: "周妃",
      id: "zhoufei",
    },
    {
      name: "郝昭",
      id: "haozhao",
    },

    {
      name: "曹植",
      id: "dc_caozhi",
    },
    {
      name: "陈宫",
      id: "re_chengong",
    },
    {
      name: "关兴张苞",
      id: "re_guanzhang",
    },
    {
      name: "步练师",
      id: "dc_bulianshi",
    },
    {
      name: "荀攸",
      id: "re_xunyou",
    },
    {
      name: "王异",
      id: "re_wangyi",
    },
    {
      name: "钟会",
      id: "xin_zhonghui",
    },
    {
      name: "曹冲",
      id: "re_caochong",
    },
    {
      name: "满宠",
      id: "re_manchong",
    },
    {
      name: "刘封",
      id: "re_liufeng",
    },
    {
      name: "虞翻",
      id: "xin_yufan",
    },
    {
      name: "伏寿",
      id: "re_fuhuanghou",
    },
    {
      name: "李儒",
      id: "dc_liru",
    },
    {
      name: "张松",
      id: "re_zhangsong",
    },
    {
      name: "沮授",
      id: "re_jushou",
    },
    {
      name: "曹叡",
      id: "re_caorui",
    },
    {
      name: "钟繇",
      id: "re_zhongyao",
    },
    {
      name: "夏侯氏",
      id: "re_xiahoushi",
    },
    {
      name: "朱治",
      id: "re_zhuzhi",
    },

    {
      name: "董允",
      id: "dongyun",
    },
    {
      name: "诸葛瑾",
      id: "zhugejin",
    },
    {
      name: "李典",
      id: "re_lidian",
    },
    {
      name: "刘焉",
      id: "liuyan",
    },
    {
      name: "张鲁",
      id: "zhanglu",
    },

    {
      name: "秦宓",
      id: "qinmi",
    },
    {
      name: "薛综",
      id: "xuezong",
    },
    {
      name: "戏志才",
      id: "xizhicai",
    },
    {
      name: "SP孙尚香",
      id: "sp_sunshangxiang",
    },
    {
      name: "SP蔡琰",
      id: "sp_caiwenji",
    },

    {
      name: "李严",
      id: "liyan",
    },
    {
      name: "糜竺",
      id: "mizhu",
    },
    {
      name: "关银屏",
      id: "guanyinping",
    },
    {
      name: "吕虔",
      id: "lvqian",
    },
    {
      name: "徐氏",
      id: "xushi",
    },
    {
      name: "马腾",
      id: "dc_mateng",
    },
    {
      name: "孔融",
      id: "dc_kongrong",
    },
    {
      name: "田丰",
      id: "dc_tianfeng",
    },
    {
      name: "蒋琬",
      id: "std_jiangwan",
    },
    {
      name: "费祎",
      id: "std_feiyi",
    },

    {
      name: "李傕郭汜",
      id: "liqueguosi",
    },
    {
      name: "董白",
      id: "re_dongbai",
    },
    {
      name: "赵忠",
      id: "zhaozhong",
    },
    {
      name: "崔琰毛玠",
      id: "cuimao",
    },
    {
      name: "朱儁",
      id: "zhujun",
    },
  ],
  //S级武将池
  s: [
    {
      name: "于吉",
      id: "xin_yuji",
    },
    {
      name: "庞统",
      id: "pangtong",
    },
    {
      name: "卧龙",
      id: "sp_zhugeliang",
    },
    {
      name: "太史慈",
      id: "sp_taishici",
    },
    {
      name: "庞德",
      id: "re_pangde",
    },
    {
      name: "颜良文丑",
      id: "yanwen",
    },
    {
      name: "袁绍",
      id: "re_yuanshao",
    },
    {
      name: "徐晃",
      id: "re_xuhuang",
    },
    {
      name: "孙坚",
      id: "sunjian",
    },
    {
      name: "董卓",
      id: "dongzhuo",
    },
    {
      name: "祝融",
      id: "zhurong",
    },
    {
      name: "孟获",
      id: "re_menghuo",
    },
    {
      name: "王平",
      id: "wangping",
    },
    {
      name: "孙亮",
      id: "sunliang",
    },
    {
      name: "蒯良蒯越",
      id: "kuailiangkuaiyue",
    },
    {
      name: "陈到",
      id: "chendao",
    },
    {
      name: "陆抗",
      id: "lukang",
    },
    {
      name: "毌丘俭",
      id: "guanqiujian",
    },
    {
      name: "袁术",
      id: "yl_yuanshu",
    },
    {
      name: "张绣",
      id: "zhangxiu",
    },
    {
      name: "法正",
      id: "re_fazheng",
    },
    {
      name: "马谡",
      id: "re_masu",
    },
    {
      name: "徐庶",
      id: "dc_xushu",
    },
    {
      name: "吴国太",
      id: "xin_wuguotai",
    },
    {
      name: "凌统",
      id: "xin_lingtong",
    },
    {
      name: "徐盛",
      id: "xin_xusheng",
    },
    {
      name: "张春华",
      id: "re_zhangchunhua",
    },
    {
      name: "高顺",
      id: "xin_gaoshun",
    },
    {
      name: "马岱",
      id: "re_madai",
    },
    {
      name: "程普",
      id: "re_chengpu",
    },
    {
      name: "韩当",
      id: "xin_handang",
    },
    {
      name: "刘表",
      id: "xin_liubiao",
    },
    {
      name: "关平",
      id: "re_guanping",
    },
    {
      name: "简雍",
      id: "re_jianyong",
    },
    {
      name: "潘璋马忠",
      id: "re_panzhangmazhong",
    },
    {
      name: "韩浩史涣",
      id: "re_hanhaoshihuan",
    },
    {
      name: "陈群",
      id: "dc_chenqun",
    },
    {
      name: "吴懿",
      id: "re_wuyi",
    },
    {
      name: "周仓",
      id: "re_zhoucang",
    },
    {
      name: "孙鲁班",
      id: "re_sunluban",
    },
    {
      name: "朱桓",
      id: "re_zhuhuan",
    },
    {
      name: "顾雍",
      id: "re_guyong",
    },
    {
      name: "蔡夫人",
      id: "re_caifuren",
    },
    {
      name: "曹休",
      id: "re_caoxiu",
    },
    {
      name: "刘谌",
      id: "re_liuchen",
    },
    {
      name: "孙休",
      id: "re_sunxiu",
    },
    {
      name: "公孙渊",
      id: "re_gongsunyuan",
    },

    {
      name: "孙登",
      id: "sundeng",
    },
    {
      name: "诸葛诞",
      id: "re_zhugedan",
    },
    {
      name: "严畯",
      id: "yanjun",
    },
    {
      name: "司马朗",
      id: "simalang", //re_simalang
    },
    {
      name: "杜畿",
      id: "duji",
    },
    {
      name: "孙乾",
      id: "sunqian",
    },
    {
      name: "潘濬",
      id: "panjun",
    },
    {
      name: "郭皇后",
      id: "re_guohuanghou",
    },
    {
      name: "王粲",
      id: "wangcan",
    },
    {
      name: "蔡邕",
      id: "re_caiyong",
    },
    {
      name: "SP庞统",
      id: "re_jsp_pangtong",
    },
    {
      name: "SP姜维",
      id: "sp_jiangwei",
    },
    {
      name: "吕岱",
      id: "lvdai",
    },
    {
      name: "文聘",
      id: "re_wenpin",
    },
    {
      name: "贺齐",
      id: "heqi",
    },
    {
      name: "周鲂",
      id: "zhoufang",
    },
    {
      name: "SP黄月英",
      id: "re_jsp_huangyueying",
    },
    {
      name: "刘繇",
      id: "liuyao",
    },
    {
      name: "马云騄",
      id: "mayunlu",
    },
    {
      name: "祖茂",
      id: "zumao",
    },
    {
      name: "蹋顿",
      id: "tadun",
    },
    {
      name: "乐进",
      id: "yuejin",
    },
    {
      name: "纪灵",
      id: "dc_jiling",
    },
    {
      name: "何太后",
      id: "hetaihou",
    },
    {
      name: "臧霸",
      id: "zangba",
    },
    {
      name: "糜夫人",
      id: "dc_mifuren",
    },
    {
      name: "陈武董袭",
      id: "chendong",
    },
    {
      name: "张任",
      id: "dc_zhangren",
    },
    {
      name: "曹洪",
      id: "caohong",
    },
    {
      name: "蒋钦",
      id: "dc_jiangqing",
    },
    {
      name: "卞夫人",
      id: "ol_bianfuren",
    },
  ],
};
