import { PlayCustomAnByVideo } from "../utils/utils.js";
import { lib, game, ui, get, ai, _status } from "../../../noname.js";

export function shenhuangzhong() {
	Object.assign(lib.skill.new_dclieqiong, {
		init(player, skill) {
			ui.playCtomAn = new PlayCustomAnByVideo();
			// window.playCtomAn = ui.playCtomAn
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
				cost_data: [position],
			} = event;
			if (position == "head") {
				ui.playCtomAn.run();
			}
			game.broadcastAll(function (position) {
				if (lib.config.background_speak) {
					game.playAudio("skill", "dclieqiong_" + position);
				}
			}, position);
			const positionObj = lib.skill[event.name].positions[position];
			let next = game.createEvent(event.name + "_effect", false);
			next.setContent(positionObj.content);
			next.set("target", target);
			next.set("player", player);
			next.set("position", positionObj);
			await next;
		},
	});
}
