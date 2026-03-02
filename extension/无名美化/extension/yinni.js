import { lib, game, ui, get, ai, _status } from "../../../noname.js";

//来源/参考自 琳琅满目(作者@柳下跖)
export function yinni() {
	window._YINNILIANGJIANG = {
		effect_zhijizhibi: {
			name: "../../../无名美化/animation/yinni/animation/effect_zhijizhibi",
		},
	};
	lib.skill._yinniliangjiang = {
		ruleSkill:true,
		charlotte:true,
		forced:true,
		hiddenSkill:true,
		trigger:{
			player:"showCharacterAfter",
		},
		content:function () {
			dcdAnim.loadSpine(window._YINNILIANGJIANG.effect_zhijizhibi.name, "skel", function () {
				dcdAnim.playSpine(window._YINNILIANGJIANG.effect_zhijizhibi, {
					speed: 0.8,
					scale: 1,
					parent: player,
				});
			});
			game.delay(2.5);
			game.playAudio('../extension/无名美化/animation/yinni/audio/yexinjia.mp3');
		},
	};
}
