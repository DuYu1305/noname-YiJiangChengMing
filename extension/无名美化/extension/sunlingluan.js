import { lib, game, ui, get, ai, _status } from "../../../noname.js";

//来源/参考自 (作者@柴油鹿鹿)   搬运请标注来源
export function sunlingluan() {
	window._SUNLINGLUAN = {
		huanfu: {
			name: "../../../无名美化/animation/sunlingluan/animation/huanfu",
			speed: 1.25,
		},
	};
	Object.assign(lib.skill.dcpandi, {
		content() {
			if (target.isIn()) {
				game.playAudio('../extension/无名美化/animation/sunlingluan/audio/huanfu.mp3');
				dcdAnim.loadSpine(window._SUNLINGLUAN.huanfu.name, "skel", function () {
					dcdAnim.playSpine(window._SUNLINGLUAN.huanfu, {
						scale: 0.45,
						x: [0, 0.5],
						y: [0, 0.5],
						parent: player,
					});
				});
				player.setAvatar('sunlingluan', target.name1);
				player.storage.dcpandi_effect = target;
				player.addTempSkill("dcpandi_effect", "phaseUseAfter");
			}
		},
		group: ['dcpandi_change'],
	});
	Object.assign(lib.skill.dcpandi.subSkill, {
		change: {
			charlotte: true,
			direct: true,
			trigger: {
				player: 'phaseUseEnd',
			},
			filter(event, player) {
				return player.hasSkill('dcpandi_effect');
			},
			content() {
				game.playAudio('../extension/无名美化/animation/sunlingluan/audio/huanfu.mp3');
				dcdAnim.loadSpine(window._SUNLINGLUAN.huanfu.name, "skel", function () {
					while (lib.version.indexOf("\u03b2") >= 0) { };
					dcdAnim.playSpine(window._SUNLINGLUAN.huanfu, {
						scale: 0.45,
						x: [0, 0.5],
						y: [0, 0.5],
						parent: player,
					});
				});
				player.setAvatar('sunlingluan', 'sunlingluan');
			},
		},
		check: {

		},
	});
	Object.assign(lib.skill.dcpandi.subSkill.effect, {
		content() {
			trigger.player = player.storage.dcpandi_effect;
			trigger.noai = true;
			player.removeSkill('dcpandi_effect');
			game.playAudio('../extension/无名美化/animation/sunlingluan/audio/huanfu.mp3');
			dcdAnim.loadSpine(window._SUNLINGLUAN.huanfu.name, "skel", function () {
				while (lib.version.indexOf("\u03b2") >= 0) { };
				dcdAnim.playSpine(window._SUNLINGLUAN.huanfu, {
					scale: 0.45,
					x: [0, 0.5],
					y: [0, 0.5],
					parent: player,
				});
			});
			player.setAvatar('sunlingluan', 'sunlingluan');
			game.delay(0.5);
		},
	});
}
