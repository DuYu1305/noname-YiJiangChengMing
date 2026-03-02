import { lib, game, ui, get, ai, _status } from "../../../noname.js";

//代码素材来自 扶苏
export function olcaochun() {
	Object.assign(lib.skill.olshanjia, {
		async content(event, trigger, player) {
			await player.draw(3);
			const bool = await player
				.chooseToUse(function (card, player, event) {
					if (get.name(card) !== "sha") return false;
					return lib.filter.cardEnabled.apply(this, arguments);
				}, get.translation(event.name) + "：是否使用一张【杀】？")
				.set("oncard", () => {
					get.event().player?.chat("雪豹我们走");
					skinSwitch.chukuangWorkerApi.playEffect(
						{
							name: "../../../无名美化/animation/fx_moucaochun/FX_MouCaoChun_02",
							version: "4.0",
							action: "play",
						},
						{ scale: 0.5 }
					);
					game.playAudio("../extension/无名美化/audio/olcaochun/Skill_CaoChun.mp3");
				})
				.set("addCount", false)
				.forResult("bool");
			if (!bool) player.chat("沙币倒勾");
			player.addTempSkill("olshanjia_effect");
			player.storage["olshanjia_effect"].set(event.getParent("phaseUse"), player.countMark("olshanjia"));
		},
	});
	if(lib.skill.olshanjia&&lib.skill.olshanjia.subSkill&&lib.skill.olshanjia.subSkill.effect){
		Object.assign(lib.skill.olshanjia.subSkill.effect, {
			content() {
				if (trigger.name === "useCard") {
					const storage = player.storage["olshanjia_effect"];
					const num = storage.get(trigger.getParent("phaseUse"));
					player.storage["olshanjia_effect"].set(trigger.getParent("phaseUse"), num - 1);
					player.chooseToDiscard("he", true).set("prompt", "缮甲：请弃置一张牌").logSkill = event.name;
				} else {
					player.chooseUseTarget(new lib.element.VCard({ name: "sha" }), false, "nodistance", "缮甲：是否视为使用一张无距离限制的【杀】？").set("oncard", () => {
						skinSwitch.chukuangWorkerApi.playEffect(
							{
								name: "../../../无名美化/animation/fx_moucaochun/FX_MouCaoChun_02",
								version: "4.0",
								action: "play",
							},
							{ scale: 0.5 }
						);
						game.playAudio("../extension/无名美化/audio/olcaochun/Skill_CaoChun.mp3");
					}).logSkill = event.name;
				}
			},
		});
	}
	
}
