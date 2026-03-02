import { lib, game, ui, get, ai, _status } from "../../../noname.js";

export function mocaocao() {
	Object.assign(lib.skill.olbachao, {
		async content(event, trigger, player) {
			const map = await game.chooseAnyOL(event.targets, get.info(event.name).chooseToGive, [player]).forResult();
			if (!map.size) {
				return;
			}
			const cards = [];
			for (const target of Array.from(map.keys())) {
				const result = map.get(target);
				if (result?.bool && result.cards?.length) {
					cards.addArray(result.cards);
				}
			}
			let next;
			if (cards.length) {
				next = player.gain(cards, "giveAuto");
				await next;
			}
			const targets = game.filterPlayer(current => {
				return !current.hasHistory("lose", evt => evt.getParent() == next && get.type(evt.cards[0]) != "basic");
			});
			if (!targets.length) {
				return;
			}
			const result = await player
				.chooseTarget("霸朝：是否对一名未交给你非基本牌的角色造成1点伤害", (card, player, target) => {
					return get.event().targetx.includes(target);
				})
				.set("targetx", targets)
				.set("ai", target => {
					const player = get.player();
					return get.damageEffect(target, player, player);
				})
				.forResult();
			if (result?.bool && result.targets?.length) {
				const target = result.targets[0];
				player.line(target, "green");
				await target.damage(player);
				if (target == player) {
					player.addTempSkill("olbachao_effect", { global: "phaseAnyAfter" });
					player.addGaintag(player.getCards("h"), "olbachao_effect");
					if (!player.hasSkill("olrumo", null, null, false)) {
						player.addSkill("olrumo");
						skinSwitch.chukuangWorkerApi.playEffect(
							{
								name: "../../../无名美化/animation/mocaocao/FX_mocaocao_rumo_bachao",
								version: "4.0",
								action: "play",
								json: true,
							},
							{
								speed: 1,
								scale: 1,
								x: [0, 0.5],
								y: [0, 0.5],
							}
						);
						game.playAudio("..", "extension", "无名美化/audio/mocaocao/Skill_MoCaoCao_3902_1.mp3");
					}
				}
			}
		},
	});
}
