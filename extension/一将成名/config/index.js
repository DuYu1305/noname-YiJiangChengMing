import { lib, game, ui, get, ai, _status } from "../../../noname.js";
import { EXTENSION_NAME, copyToClipboard } from "../utils/index.js";
import { xinshaConfig, doudizhuConfig } from "./dynamicSkin.js";
let xkeys = Object.keys(xinshaConfig);
let xkeysMap = {};
xkeys.forEach(key => {
	xkeysMap[key] = key;
});
xkeysMap["suiji"] = "随机";
let ddzkeys = Object.keys(doudizhuConfig);
let ddzMap = {};
ddzkeys.forEach(key => {
	ddzMap[key] = key;
});
ddzMap["suiji"] = "随机";
export const config = () => {
	return {
		yjcm_tip: {
			name: "未经本人允许严禁整合进他人懒人包、整合包、分享等。本扩展仅为学习参考，严禁用于商业用途。",
			clear: true,
		},
		yjcm_title_common: {
			name: "<span style='color: gold; font-weight: bold;'>关注微信公众号（点击复制到粘贴板）：<b style='color:yellow'>无名杀资源库</b> 获取最新版本。</span>",
			clear: true,
			onclick() {
				copyToClipboard("无名杀资源库");
			},
		},
		yjcm_title_bilibili: {
			name: "<span style='color: gold; font-weight: bold;'>哔哩哔哩（点击复制主页链接到粘贴板）：<b style='color:yellow'>倘若的小号</b> </span>",
			clear: true,
			onclick() {
				copyToClipboard("https://space.bilibili.com/1086466776");
			},
		},
		paweijiesuanAn: {
			name: "排位结算动画",
			init: true,
		},
		addBackHomeBtn: {
			name: "游戏结算增加返回主页按钮",
			init: true,
		},

		choosechar: {
			name: "选将美化",
			init: true,
			intro: "十周年样式的选将界面美化。搬运自烟火人间的十周年选将美化、u的特效补充，且必须开启十周年UI才能使用。",
		},
		xinshaguge: {
			name: "大厅骨骼",
			init: "威曹丕",
			item: xkeysMap,
			onclick(item) {
				localStorage.setItem(`${EXTENSION_NAME}_xinshaguge`, item);
				game.saveConfig(`extension_${EXTENSION_NAME}_xinshaguge`, item);
				// let theme = lib.config[`extension_${EXTENSION_NAME}_loginTheme`];
				// if (theme == "xinsha") {
				if (confirm("是否重启游戏以应用新UI？")) {
					setTimeout(() => window.location.reload(), 100);
				}
				// }
			},
		},
		dtBtnTheme: {
			name: "大厅按钮风格",
			init: "auto",
			item: {
				default: "默认",
				zhouliu: "周六",
				auto:"周六自动切换"
			},
		},
		doudizhuguge: {
			name: "斗地主骨骼",
			init: "神张飞",
			item: ddzMap,
			onclick(item) {
				localStorage.setItem(`${EXTENSION_NAME}_doudizhuguge`, item);
				game.saveConfig(`extension_${EXTENSION_NAME}_doudizhuguge`, item);
				let theme = lib.config[`extension_${EXTENSION_NAME}_loginTheme`];
				// if (theme == "xinsha") {
				if (confirm("是否重启游戏以应用新UI？")) {
					setTimeout(() => window.location.reload(), 100);
				}
				// }
			},
		},
	};
};
