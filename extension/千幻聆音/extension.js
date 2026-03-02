//game.import( name:"千幻聆音"
//提示：本扩展源代码基于GPL协议向无名杀社区开放，欢迎大家借鉴和参考代码。
//import { VERSION } from './version.js'
// @ts-ignore
import { lib, get, _status, ui, game, ai } from "./extension/noname.js";
import { CONFIG } from "./extension/config.js";
import { CONTENT } from "./extension/content.js";
import { PRECONTENT } from "./extension/precontent.js";
import {element} from "./utils/element.js"
// @ts-ignore
lib.element.player.qhhhh_old_$init = lib.element.player.$init;
// @ts-ignore
lib.element.player.qh_old_$init = function (character, character2) {
  //笨方法，重新把十周年ui被复写的逻辑写回来。。。。。。。
	this.doubleAvatar = (character2 && lib.character[character2]) !== undefined;

	// othersOff样式下检查武将原画
	if (lib.config.extension_十周年UI_newDecadeStyle === "othersOff") {
		if (this.checkAndAddExperienceSuffix) {
			this.checkAndAddExperienceSuffix(character);
			if (character2) this.checkAndAddExperienceSuffix(character2, true);
		}
	}
	// 边框等级
	const borderLevel = lib.config.extension_十周年UI_borderLevel;
	if (borderLevel === "random") {
		// 主玩家永远five，其他玩家随机
		if (this === game.me) {
			this.dataset.borderLevel = "five";
		} else {
			/** @type {string[]} */
			const levels = ["one", "two", "three", "four", "five"];
			this.dataset.borderLevel = levels[Math.floor(Math.random() * levels.length)];
		}
	} else {
		delete this.dataset.borderLevel;
	}
	// 手牌可见功能
	if (!this.node.showCards) {
		const player = this;
		player.node.showCards = element.create("handdisplays", player);
		player.node.showCards.hide();

		const rect = player.getBoundingClientRect();
    console.log("player",player,rect)
		const winWidth = window.innerWidth || document.documentElement.clientWidth;
		const showCards = player.node.showCards;
		/** @type {number} */
		const offset = 10;
		const isBabysha = lib.config.extension_十周年UI_newDecadeStyle === "babysha";
		if ((isBabysha && rect.left < winWidth / 2) || (!isBabysha && rect.left >= winWidth / 2)) {
			showCards.style.left = "";
			showCards.style.right = player.offsetWidth + offset + "px";
		} else {
			showCards.style.left = player.offsetWidth + offset + "px";
			showCards.style.right = "";
		}
		showCards.style.top = "90px";

		player.node.showCards.onclick = function () {
			const cards = player.getCards("h", c => get.is.shownCard(c) || player.isUnderControl(true) || game.me?.hasSkillTag("viewHandcard", null, player, true));
			if (cards.length > 0) {
				const popup = ui.create.div(".popup-container", ui.window);
				const handdisplay = ui.create.dialog(get.translation(player) + "的手牌", cards);
				handdisplay.static = true;
				popup.addEventListener("click", () => {
					popup.delete();
					handdisplay.close();
					handdisplay.delete();
				});
			}
		};

		["handcards1", "handcards2"].forEach(zone => {
			const observer = new MutationObserver(mutations => {
				for (const m of mutations) {
					if (m.type === "childList" && (m.addedNodes.length || m.removedNodes.length)) {
						player.decadeUI_updateShowCards();
						break;
					}
				}
			});
			observer.observe(player.node[zone], { childList: true });
		});
	}

	// 十周年角标
	if (window.decadeModule?.prefixMark) {
		window.decadeModule.prefixMark.showPrefixMark(character, this);
		if (character2 && this.doubleAvatar) {
			window.decadeModule.prefixMark.showPrefixMark(character2, this);
		}
	}
	if (this._addPrefixSeparator) {
		this._addPrefixSeparator(this.node.name, character);
		if (this.doubleAvatar && this.node.name2) this._addPrefixSeparator(this.node.name2, character2);
	}

	// 座位号节点
	if (!this.node.seat) {
		this.node.seat = element.create("seat", this);
	}
  console.log("qhhhh_old_$init",this.decadeUI_updateShowCards)
	if (this.decadeUI_updateShowCards) {
		this.decadeUI_updateShowCards();
	}

	return lib.element.player.qhhhh_old_$init.apply(this, arguments);
};
// lib.element.player.qh_old_$init = lib.element.player.$init;

lib.element.player.qh_old_init = lib.element.player.init;
// @ts-ignore
lib.element.player.qh_old_uninit = lib.element.player.uninit;
// @ts-ignore
lib.element.player.qh_old_$uninit = lib.element.player.$uninit;

// @ts-ignore
if (!window.qhlyUI) window.qhlyUI = {};
// @ts-ignore
window.qhlyUI.assets = {
	huanpifu: {
		name: "../../../千幻聆音/assets/huanpifu",
	},
	pinzhi: {
		name: "../../../千幻聆音/assets/SF_pifu_pinzhiUI",
	},
	huanfu: {
		name: "../../../千幻聆音/assets/huanfu",
	},
};
//出框调整
//皮切用自己函数播放出框
//getSkinFile,setOriginSkin,syncChange

let mainPackageFunc = async function () {
	const extensionInfo = await lib.init.promises.json(`${lib.assetURL}extension/千幻聆音/info.json`);
	let mainPackage = {
		name: "千幻聆音",
		content: CONTENT,
		precontent: PRECONTENT,
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
			intro:
				"版本号：" +
				extensionInfo.version +
				"<br>对局内实时换肤换音扩展！<br>感谢七.提供的【水墨龙吟】界面素材。<br>感谢灵徒℡丶提供的【海克斯科技】界面素材。<br>感谢雷开发的十周年、手杀界面。<br>感谢以下群友参与了BUG反馈，并给出了可行的建议：<br>柚子 Empty city° ꧁彥꧂ 折月醉倾城 世中人 ᴀᴅɪᴏs 废城<b><br><br>玄武江湖工作室群：522136249</b><br>由黎，提供新手杀样式以及素材，感谢柴油鹿鹿，寰宇星城，白露为霜，献忠喵等人提供的建议和指导！<br><img style=width:238px src=" +
				lib.assetURL +
				"extension/千幻聆音/image/xwjh_pic_erweima.jpg> <br><br><b>时空枢纽群：1075641665</b><img style=width:238px src=" +
				lib.assetURL +
				"extension/千幻聆音/image/sksn_pic_erweima.jpg> <br><br><b>千幻聆音皮肤群：646556261</b><img style=width:238px src=" +
				lib.assetURL +
				"extension/千幻聆音/image/qhly_pic_erweima.jpg><br><b>千幻聆音皮肤二群：859056471</b><img style=width:238px src=" +
				lib.assetURL +
				"extension/千幻聆音/image/qhly_pic_erweima2.jpg><br><b>Thunder大雷音寺群：991761102</b><img style=width:238px src=" +
				lib.assetURL +
				"extension/千幻聆音/image/qhly_pic_daleiyinsi.jpg><br><b>无名杀扩展交流公众号</b><img style=width:238px src=" +
				lib.assetURL +
				"extension/千幻聆音/image/qhly_pic_gzh.jpg>",
			author: "玄武江湖工作室 & 雷",
			diskURL: "",
			forumURL: "",
			version: extensionInfo.version,
		},
		files: { character: [], card: [], skill: [] },
	};
	// @ts-ignore
	window.qhly_extension_package = mainPackage;
	return mainPackage;
};

export let type = "extension";

export default mainPackageFunc;
