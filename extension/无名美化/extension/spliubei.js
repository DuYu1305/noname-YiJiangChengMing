import { lib, game, ui, get, ai, _status } from "../../../noname.js";
export function spliubei() {
	//扶苏提供代码、素材 感谢
	Object.assign(lib.skill.spoljinglei, {
		async content(event, trigger, player) {
			await player.damage("thunder", "nosource");
			if (
				!game.hasPlayer(target => {
					return target.hasSkill("spolzhujiu", null, null, false);
				})
			)
				return;
			const result = await player
				.chooseTarget(
					"惊雷：请选择一名拥有〖煮酒〗的角色",
					(card, player, target) => {
						return target.hasSkill("spolzhujiu", null, null, false);
					},
					true
				)
				.set("prompt2", "令其将手牌调整至体力上限（至多摸至5），然后若该角色不为你：其须将以此法弃置的牌交给你")
				.set("ai", target => get.info("spoljinglei").getEffect(get.player(), target))
				.forResult();
			const target = result.targets?.[0];
			if (!target) return;
			if (target === player) {
				skinSwitch.chukuangWorkerApi.playEffect(
					{
						name: "../../../无名美化/animation/spliubei/long",
						version: "4.0",
						action: "sheng",
					},
					{
						scale: 0.9,
						speed: 1,
					}
				);
				game.playAudio("../extension/无名美化/audio/spliubei/1.mp3");
			} else {
				skinSwitch.chukuangWorkerApi.playEffect(
					{
						name: "../../../无名美化/animation/spliubei/long",
						version: "4.0",
						action: "jiang",
						x: 350,
						y: 410,
					},
					{
						scale: 0.9,
						speed: 1,
					}
				);
				game.playAudio("../extension/无名美化/audio/spliubei/2.mp3");
			}

			const num = target.maxHp - target.countCards("h");
			if (num === 0) return;
			if (num > 0) {
				await target.drawTo(Math.min(target.maxHp, 5));
			} else {
				const num = Math.min(
					target.countCards("h") - target.maxHp,
					target.countCards("h", card => lib.filter.cardDiscardable(card, target))
				);
				if (num === 0) return;
				const cards = await target.chooseToDiscard(num, true).forResultCards();
				if (player != target && cards?.someInD("d")) await player.gain(cards.filterInD("d"), "gain2").set("giver", target);
			}
		},
	});
}
