import { lib, game, ui, get, ai, _status } from "../../../noname.js";
import { Jian } from "../utils/utils.js";

export function weilvbu() {
	window._WEILVBU = {
		name: "无名美化",
		url: lib.assetURL + "extension/无名美化",
		jineng: {
			name: "../../../无名美化/animation/weilvbu/weilvbu_jineng",
			speed: 0.8,
			scale: 0.8,
		},
		jindu: {
			name: "../../../无名美化/animation/weizhangliao/lianzhao_jindu",
		},
	};
	Object.assign(lib.skill.dcbaguan, {
		async content(event, trigger, player) {
			const num = player.getEquips(1).reduce((sum, card) => sum + get.cardNameLength(card), 0);
			ui.weilvbudejian.addPower();
			game.broadcastAll(num => (lib.skill.dcbaguan_backup.selectCard = [1, num]), num);
			const next = player.chooseToUse();
			next.set("openskilldialog", `###${get.prompt(event.name)}###是否将至多${get.cnNumber(num)}张手牌当作无任何次数限制且伤害基数为对应实体牌数的【杀】使用`);
			next.set("norestore", true);
			next.set("_backupevent", "dcbaguan_backup");
			next.set("custom", {
				add: {},
				replace: { window() {} },
			});
			next.backup("dcbaguan_backup");
			next.set("targetRequired", true);
			next.set("complexSelect", true);
			next.set("logSkill", event.name);
			next.set("addCount", false);
			next.set("oncard", async () => {
				let event = get.event(),
					{ cards } = event;
				event.set("dcbaguan", true);
				event.baseDamage = cards.length;
				dcdAnim.loadSpine(window._WEILVBU.jineng.name, "skel", function () {
					dcdAnim.playSpine(window._WEILVBU.jineng, {
						x: [0, 0.5],
						y: [0, 0.55],
					});
				});
			});
			let { result } = await next;
			console.log(result);
			if (result.bool) {
				ui.weilvbudejian.lessPower();
			} else {
				ui.weilvbudejian.lessPower(true);
			}
		},
	});
	Object.assign(lib.skill.dcbaguan.subSkill.mark, {
		init(player, skill) {
			const evt = lib.skill.dcbaguan.getUsed(player, true);
			if (evt && !evt.dcbaguan) player.addTip(skill, "霸关 可连击");
			ui.weilvbudejian = new Jian(player, window._WEILVBU, "weilvbu");
		},
		async content(event, trigger, player) {
			if (lib.skill.dcbaguan.getUsed(player, true) && !trigger.dcbaguan) {
				player.addTip("dcbaguan", "霸关 可连击");
				if (ui.weilvbudejian.powerStatus == "half") {
					ui.weilvbudejian.setShowHide(true);
				} else {
					ui.weilvbudejian.addPower();
				}
			} else {
				player.removeTip("dcbaguan");
				ui.weilvbudejian.lessPower();
			}
		},
	});
}
