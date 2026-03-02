//未经允许擅自修改弹窗内容、改作者名的全价包庇
import { lib, game, ui, get, ai, _status } from "../../noname.js";
import { attack_zhishixian } from "./extension/zhishixian.js";
import { mosimayi } from "./extension/mosimayi.js";
import { mbsunhanhua, initCXCss } from "./extension/sunhanhua.js";
import { _ThunderFn, initThunder } from "./utils/Thunder.js";
import { wolongyance } from "./extension/wolongyance.js";
import { zhengxuan } from "./extension/zhengxuan.js";
import { nanhualaoxian, initNhlxCss } from "./extension/nanhualaoxian.js";
import { majun } from "./extension/majun.js";
import { weilvbu } from "./extension/weilvbu.js";
import { zhouqun } from "./extension/zhouqun.js";
import { puyuan } from "./extension/puyuan.js";
import { olspzhugeliang } from "./extension/olspzhugeliang.js";
import { pangdegong } from "./extension/pangdegong.js";
import { mbcaomao } from "./extension/mbcaomao.js";
import { jsrgsimazhao } from "./extension/jsrgsimazhao.js";
import { shitaishici } from "./extension/shitaishici.js";
import { weizhangliao } from "./extension/weizhangliao.js";
import { weidongzhuo } from "./extension/weidongzhuo.js";
import { mbshichangshi, initSCSCss } from "./extension/shichangshi.js";
import { caojinyu } from "./extension/caojinyu.js";
import { sbspzhugeliang } from "./extension/sbspzhugeliang.js";
import { mouguanyu } from "./extension/mouguanyu.js";
import { shenlusu } from "./extension/shenlusu.js";
import { shenhuatuo, initWuLingXiss } from "./extension/shenhuatuo.js";
import { sbmachao } from "./extension/sbmachao.js";
import { sbxuhuang } from "./extension/sbxuhuang.js";
import { shenpei } from "./extension/shenpei.js";
import { caoyi } from "./extension/caoyi.js";
import { sunlingluan } from "./extension/sunlingluan.js";
import { huanzhugeliang } from "./extension/huanzhugeliang.js";
import { huancaoang } from "./extension/huancaoang.js";
import { simashi } from "./extension/simashi.js";
import { xinzhangyi } from "./extension/xinzhangyi.js";
import { dcsbjiaxu } from "./extension/dcsbjiaxu.js";
import { pangfengyi } from "./extension/pangfengyi.js";
import { xiaoqiao } from "./extension/xiaoqiao.js";
import { zhangqiying } from "./extension/zhangqiying.js";
import { liuye } from "./extension/liuye.js";
import { ssyangfeng } from "./extension/ssyangfeng.js";
// import { yinni } from "./extension/yinni.js";
import { zhouchu } from "./extension/zhouchu.js";
import { shentaishici } from "./extension/shentaishici.js";
import { spmifuren } from "./extension/spmifuren.js";
import { wangling } from "./extension/wangling.js";
import { agreement } from "./utils/agreement.js";
import { sbsunshangxiang } from "./extension/sbsunshangxiang.js";
import { kanze } from "./extension/kanze.js";
import { lijue } from "./extension/lijue.js";
import { zhuangbei } from "./extension/zhuangbei.js";
import { globaltexiao, globalTool } from "./extension/globaltexiao.js";
import { config } from "./config/index.js";
import { olmouzhangxiu } from "./extension/olmouzhangxiu.js";
import { spliubei } from "./extension/spliubei.js";
import { shenhuangzhong } from "./extension/shenhuangzhong.js";
import { shenzhonghui } from "./extension/shenzhonghui.js";
import { olcaochun } from "./extension/olcaochun.js";
import { dagongche } from "./extension/dagongche.js";
import { shiyuji } from "./extension/shiyuji.js";
import { shiweiyan } from "./extension/shiweiyan.js";
import { qiaogong } from "./extension/qiaogong.js";
import { olmiheng } from "./extension/olmiheng.js";
import { juexingji1, juexingji2, juexingji3 } from "./extension/juexingji.js";
import { skilltexiao } from "./extension/skilltexiao.js";
import { skilltexiaoPC } from "./extension/skilltexiaoPC.js";
import { modiaochan } from "./extension/modiaochan.js";
import { weimachao } from "./extension/weimachao.js";
import { mosunquan } from "./extension/mosunquan.js";
import { mocaocao } from "./extension/mocaocao.js";
import { shenjiangwei } from "./extension/shenjiangwei.js";
import { checkMode } from "./utils/utils.js";
//调试ctrl+j 或者控制台lib.node.debug()
game.import("extension", async function () {
	const baseUrl = `${lib.assetURL}extension/无名美化/`;
	const extensionInfo = await lib.init.promises.json(`${baseUrl}info.json`);
	const CONFIG = await config();
	return {
		name: "无名美化",
		precontent: function () {
			window._Thunder = _ThunderFn;
		},
		arenaReady() {
			if(!checkMode()) return;
			console.log("arenaReady globaltexiao");
			globaltexiao();
			if (lib.device) {
				skilltexiao();
			} else {
				skilltexiaoPC();
			}
			if (lib.config.extension_无名美化_juexingji == "shousha45") {
				juexingji1();
			} else if (lib.config.extension_无名美化_juexingji == "shousha") {
				juexingji2();
			} else if (lib.config.extension_无名美化_juexingji == "ol") {
				juexingji3();
			}
		},
		content: function (config, pack) {
			if(!checkMode()) return;
			//4.0骨骼播放css
			lib.init.css(lib.assetURL + "extension/无名美化/css", "common");
			globalTool();
			agreement(extensionInfo);
			//雷佬
			if (!game.hasExtension("Thunder")) {
				// 让步 Thunder
				initThunder();
			}
			if (lib.config.extension_无名美化_modiaochan) {
				modiaochan();
			}
			if (!game.hasExtension("皮肤切换")) {
				alert("无名美化需要搭配皮肤切换扩展使用，请先安装皮肤切换扩展！");
			}
			if (lib.config.extension_无名美化_wmmh_close_top&&!["off","othersOn"].includes(lib.config.extension_十周年UI_newDecadeStyle)) {
				lib.init.css(lib.assetURL + "extension/无名美化/css", "qianhuan");
			}
			if (lib.config.extension_无名美化_shenjiangwei) {
				shenjiangwei();
			}
			if (lib.config.extension_无名美化_mosimayi) {
				mosimayi();
			}
			if (lib.config.extension_无名美化_shiyuji) {
				shiyuji();
			}
			if (lib.config.extension_无名美化_shiweiyan) {
				shiweiyan();
			}
			if (lib.config.extension_无名美化_qiaogong) {
				qiaogong();
			}
			if (lib.config.extension_无名美化_olmiheng) {
				olmiheng();
			}
			if (lib.config.extension_无名美化_mosunquan) {
				mosunquan();
			}
			if (lib.config.extension_无名美化_mocaocao) {
				mocaocao();
			}
			if (lib.config.extension_无名美化_dagongche) {
				dagongche();
			}
			if (lib.config.extension_无名美化_olcaochun) {
				olcaochun();
			}
			if (lib.config.extension_无名美化_shenhuangzhong) {
				shenhuangzhong();
			}
			if (lib.config.extension_无名美化_shenzhonghui) {
				shenzhonghui();
			}
			if (lib.config.extension_无名美化_olmouzhangxiu) {
				olmouzhangxiu();
			}
			if (lib.config.extension_无名美化_wolongyance) {
				wolongyance();
			}
			if (lib.config.extension_无名美化_spliubei) {
				spliubei();
			}
			if (lib.config.extension_无名美化_ssyangfeng) {
				ssyangfeng();
			}
			if (lib.config.extension_无名美化_olhuoji) {
				olspzhugeliang();
			}
			if (lib.config.extension_无名美化_zhungbei) {
				zhuangbei();
			}
			if (lib.config.extension_无名美化_simazhao) {
				jsrgsimazhao();
			}
			if (lib.config.extension_无名美化_mbcaomao!='off') {
				mbcaomao();
			}
			if (lib.config.extension_无名美化_shitaishici) {
				shitaishici();
			}
			if (lib.config.extension_无名美化_weizhangliao) {
				weizhangliao();
			}
			if (lib.config.extension_无名美化_weilvbu) {
				weilvbu();
			}
			if (lib.config.extension_无名美化_weimachao) {
				weimachao();
			}
			if (lib.config.extension_无名美化_weidongzhuo) {
				weidongzhuo();
			}
			if (lib.config.extension_无名美化_mbshichangshi) {
				initSCSCss();
				mbshichangshi();
			}

			if (lib.config.extension_无名美化_caojinyu) {
				caojinyu();
			}
			//谋关羽
			if (lib.config.extension_无名美化_mouguanyu) {
				mouguanyu();
			}
			//谋诸葛伙计失败
			if (lib.config.extension_无名美化_sbspzhugeliang) {
				sbspzhugeliang();
			}
			//
			if (lib.config.extension_无名美化_shenlusu) {
				shenlusu();
			}
			if (lib.config.extension_无名美化_shenhuatuo) {
				initWuLingXiss();
				shenhuatuo();
			}

			if (lib.config.extension_无名美化_moumachao) {
				sbmachao();
			}
			if (lib.config.extension_无名美化_mouxuhuang) {
				sbxuhuang();
			}
			if (lib.config.extension_无名美化_shenpei) {
				shenpei();
			}
			if (lib.config.extension_无名美化_caoyi != "off") {
				caoyi();
			}
			if (lib.config.extension_无名美化_sunlingluan) {
				sunlingluan();
			}
			if (lib.config.extension_无名美化_huanzhugeliang) {
				huanzhugeliang();
			}
			if (lib.config.extension_无名美化_huancaoang) {
				huancaoang();
			}
			// huancaoang
			if (lib.config.extension_无名美化_simashi) {
				simashi();
			}
			if (lib.config.extension_无名美化_xinzhangyi) {
				xinzhangyi();
			}
			if (lib.config.extension_无名美化_moujiaxu) {
				dcsbjiaxu();
			}
			if (lib.config.extension_无名美化_pangfengyi) {
				pangfengyi();
			}
			if (lib.config.extension_无名美化_xiaoqiao) {
				xiaoqiao();
			}
			if (lib.config.extension_无名美化_zhangqiying) {
				zhangqiying();
			}
			if (lib.config.extension_无名美化_liuye) {
				liuye();
			}
			if (lib.config.extension_无名美化_zhouchu) {
				zhouchu();
			}
			if (lib.config.extension_无名美化_shentaishici) {
				shentaishici();
			}
			if (lib.config.extension_无名美化_spmifuren) {
				spmifuren();
			}
			if (lib.config.extension_无名美化_wangling) {
				wangling();
			}
			if (lib.config.extension_无名美化_sbsunshangxiang) {
				sbsunshangxiang();
			}
			if (lib.config.extension_无名美化_kanze) {
				kanze();
			}
			if (lib.config.extension_无名美化_lijue) {
				lijue();
			}

			
			if (lib.config.extension_无名美化_nanhualaoxian) {
				initNhlxCss();
				nanhualaoxian();
			}
			if (lib.config.extension_无名美化_zhengxuan) {
				zhengxuan();
			}
			if (lib.config.extension_无名美化_majun) {
				majun();
			}
			if (lib.config.extension_无名美化_zhouqun) {
				zhouqun();
			}
			if (lib.config.extension_无名美化_puyuan) {
				puyuan();
			}
			if (lib.config.extension_无名美化_pangdegong) {
				pangdegong();
			}

			//孙寒华冲虚
			if (lib.config.extension_无名美化_mbchongxu) {
				initCXCss();
				mbsunhanhua();
			}
			// //攻击指示线
			if (lib.config.extension_无名美化_attack_zhishixian != "off") {
				attack_zhishixian();
			}
			// // 拖拽只指示线
			// if (lib.config.extension_无名美化_zhishixian) {
			// 	tuozhuaizhishixian();
			// }

			lib.init.css(lib.assetURL + "extension/无名美化/css", "uiPatch");
		},
		config: CONFIG,
		help: {},
		package: {
			character: {
				character: {},
				translate: {},
			},
			card: {
				card: {},
				translate: {},
				list: [],
			},
			skill: {
				skill: {},
				translate: {},
			},
			// <span style='color: pink; font-weight: bold;'>开启至臻动皮需要安装皮切。</span>
			intro: extensionInfo.intro,
			author: extensionInfo.author,
			diskURL: "",
			forumURL: "",
			version: extensionInfo.version,
		},
		files: { character: [], card: [], skill: [], audio: [] },
	};
});
