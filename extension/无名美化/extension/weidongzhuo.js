import { lib, game, ui, get, ai, _status } from "../../../noname.js";
import { Jian } from "../utils/utils.js";

export function weidongzhuo() {
	window._WEIDongZhuo = {
		jineng: {
			name: "../../../无名美化/animation/weidongzhuo/weidongzhuo_jineng",
			speed: 0.8,
			scale: 0.8,
		},
		jindu: {
			name: "../../../无名美化/animation/weizhangliao/lianzhao_jindu",
		},
	};
	Object.assign(lib.skill.dcjuchui, {
		init(player, skill) {
			player.addSkill(skill + "_combo");
			
			ui.weidongzhuodejian = new Jian(player, window._WEIDongZhuo, "weidongzhuo");
		},
		filter(event, player) {
			if (!event.targets?.length) {
				ui.weidongzhuodejian.lessPower();
				return false;
			}
			console.log("filter", get.type2(event.card));

			//装备 +锦囊 触发

			//装备 且没有能量 添加能量
			if (get.type2(event.card) == "equip" && ui.weidongzhuodejian.powerStatus == null) {
				ui.weidongzhuodejian.addPower();
			}
			if (get.type2(event.card) !== "trick") {
				//不是锦囊牌也不是装备牌
				if (get.type2(event.card) !== "equip") {
					ui.weidongzhuodejian.lessPower();
				}
				return false;
			}

			const evt = get.info("dcjianying").getLastUsed(player, event);

			console.log("filter", get.type(evt.card));
			//这张是锦囊牌上一张牌是装备牌
			let equipCard = evt && get.type(evt.card) === "equip";

			if (equipCard) {
				ui.weidongzhuodejian.addPower();
			}
			return equipCard;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return get.event().getTrigger().targets.includes(target);
				})
				.set("ai", target => {
					const player = get.player();
					if (target.maxHp <= player.maxHp) return Math.max(get.effect(target, { name: "losehp" }, player, player), get.recoverEffect(target, player, player));
					return get.effect(player, { name: "draw" }, player, player) + 1145141919810 - Math.sign(get.attitude(player, target)) * target.countCards("h");
				})
				.forResult();
			console.log("cost", event.result);
			// ui.weidongzhuodejian.lessPower(!event.result.bool);
			//目前pr的代码是空能量了直接
			ui.weidongzhuodejian.lessPower();
			dcdAnim.loadSpine(window._WEIDongZhuo.jineng.name, "skel", function () {
				dcdAnim.playSpine(window._WEIDongZhuo.jineng, {
					x: [0, 0.5],
					y: [0, 0.55],
				});
			});
		},
	});
}
