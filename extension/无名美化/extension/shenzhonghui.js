import { PlayCustomAnByVideo } from "../utils/utils.js";
import { lib, game, ui, get, ai, _status } from "../../../noname.js";

export function shenzhonghui() {
	Object.assign(lib.skill.dcjianghuo, {
		init(player, skill) {
			ui.playCtomAnSzh = new PlayCustomAnByVideo({
				SS_cmmask: {
					name: "../../../无名美化/animation/caomao/juejin/SS_cmmask",
					speed: 0.8,
					loop: true,
					scale: 0.9,
				},
				video: `${lib.assetURL}extension/无名美化/video/shenzhonghui.mp4`,
			});
		},
		async content(event, trigger, player) {
			ui.playCtomAnSzh.run();
			player.awakenSkill(event.name);
			const num = game
				.filterPlayer(target => target !== player && target.hasMark("dclinjie"))
				.map(target => target.countMark("dclinjie"))
				.reduce((sum, cur) => sum + cur, 0);
			game.filterPlayer(target => target !== player).forEach(target => target.clearMark("dclinjie"));
			if (num > 0) {
				player.addMark("dclinjie", num);
			}
			await player.draw(player.countMark("dclinjie"));
			await player.gainMaxHp();
			await player.removeSkills("dclinjie");
			await player.addSkills("dclishi");
			player.markSkill("dclinjie");
		},
	});
}
