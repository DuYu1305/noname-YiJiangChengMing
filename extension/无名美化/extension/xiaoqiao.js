import { lib, game, ui, get, ai, _status } from "../../../noname.js";

export function xiaoqiao() {
	window._XIAOQIAO = {
		arr_0_gaipan: {
			name: "../../../无名美化/animation/xiaoqiao/animation/arr_0_gaipan",
		},
		arr_1_gaipan: {
			name: "../../../无名美化/animation/xiaoqiao/animation/arr_1_gaipan",
		},
		arr_2_gaipan: {
			name: "../../../无名美化/animation/xiaoqiao/animation/arr_2_gaipan",
		},
		arr_3_gaipan: {
			name: "../../../无名美化/animation/xiaoqiao/animation/arr_3_gaipan",
		},
	};
	Object.assign(lib.skill.xinhongyan, {
		content: async function (event, trigger, player) {
			const control = event.cost_data;
			player.addExpose(0.25);
			player.popup(control);
			game.log(player, "将判定结果改为了", "#y" + get.translation(control + 2));
			var files = {
				spade: "0",
				heart: "1",
				diamond: "2",
				club: "3",
			};
			if (files[control]) {
				dcdAnim.loadSpine(window._XIAOQIAO["arr_" + files[control] + "_gaipan"].name, "skel", function () {
					dcdAnim.playSpine(window._XIAOQIAO["arr_" + files[control] + "_gaipan"], {
						speed: 0.8,
						scale: 0.8,
						x: [0, 0.5],
					});
				});
			}
			game.playAudio("../extension/无名美化/animation/xiaoqiao/audio/hongyangaipan.mp3");
			game.delay(2.5);
			if (!trigger.fixedResult) trigger.fixedResult = {};
			trigger.fixedResult.suit = control;
			trigger.fixedResult.color = get.color({ suit: control });
		},
	});
}
