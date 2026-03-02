import { lib, game, ui, get, ai, _status } from "../../../noname.js";
import { Jian } from "../utils/utils.js";

export function weizhangliao() {
	window._WEIZHANGLIAO = {
		name: "无名美化",
		url: lib.assetURL + "extension/无名美化",
		jineng: {
			name: "../../../无名美化/animation/weizhangliao/weizhangliao_jineng",
			speed: 0.8,
			scale: 0.8,
		},
		jindu: {
			name: "../../../无名美化/animation/weizhangliao/lianzhao_jindu",
		},
		// jindu: {
		// 	name: lib.assetURL + "extension/无名美化/animation/weizhangliao/lianzhao_jindu",
		// 	version: "4.0",
		// },
	};
	Object.assign(lib.skill.dcporong, {
		group: ["dcporong_mark", "dcporong_mark1"],

		subSkill: {
			mark: {
				charlotte: true,
				trigger: { player: ["useCard1", "useCardAfter"] },
				forced: true,
				popup: false,
				firstDo: true,
				init(player, skill) {
					const evt = lib.skill.dcjianying.getLastUsed(player);
					if (evt?.card && get.tag(evt.card, "damage") > 0.5 && !evt[skill]) player.addTip(skill, "破戎 可连击");
					
					ui.weizhangliaodejian = new Jian(player, window._WEIZHANGLIAO);
				},
				onremove(player, skill) {
					player.removeTip(skill);
				},
				async content(event, trigger, player) {
					if (event.triggername == "useCardAfter") {
						//满能量没放技能
						if (ui.weizhangliaodejian.powerStatus == "full" && !game.usedcporong) {
							ui.weizhangliaodejian.lessPower(true);
						}
						if (game.usedcporong) {
							game.usedcporong = false;
						}
						if (ui.weizhangliaodejian.powerStatus != "half") {
							ui.weizhangliaodejian.setShowHide(false);
						}
					}
					if (event.triggername == "useCard1") {
						if (get.tag(trigger.card, "damage") > 0.5) {
							player.addTip("dcporong", "破戎 可连击");
						} else {
							player.removeTip("dcporong");
						}
					} else if (trigger.dcporong) {
						player.removeTip("dcporong");
					}
				},
			},
			mark1: {
				charlotte: true,
				trigger: {
					player: "useCard",
				},
				forced: true,
				popup: false,
				firstDo: true,
				content(event, trigger, player) {
					if (!trigger.dcporong && get.tag(trigger.card, "damage") > 0.5) {
						//特殊情况 上张是伤害牌 这张是不是杀的伤害牌
						if (ui.weizhangliaodejian.powerStatus == "half" && trigger.card.name != "sha") {
							ui.weizhangliaodejian.setShowHide(true);
						} else {
							ui.weizhangliaodejian.addPower();
						}
					} else {
						ui.weizhangliaodejian.lessPower();
					}
				},
			},
		},
		// init(player, skill) {
		// 	player.addSkill(skill + "_mark");
		// },
		async content(event, trigger, player) {
			game.usedcporong = true;
			ui.weizhangliaodejian.lessPower();

			dcdAnim.loadSpine(window._WEIZHANGLIAO.jineng.name, "skel", function () {
				dcdAnim.playSpine(window._WEIZHANGLIAO.jineng, {
					x: [0, 0.5],
					y: [0, 0.55],
				});
			});
			const { targets, name } = event;
			trigger.set(name, true);
			for (const target of targets) {
				const targetsx = [target, target.getNext(), target.getPrevious()].filter(current => current != player && current.countGainableCards(player, "h")).sortBySeat();
				if (targetsx.length) {
					await player.gainMultiple(targetsx);
				}
			}
			trigger.effectCount++;
		},
	});
}
