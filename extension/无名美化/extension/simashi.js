import { lib, game, ui, get, ai, _status } from "../../../noname.js";

export function simashi() {
	window._SIMASHI = {
		baikuang: {
			name: "../../../无名美化/animation/simashi/baikuang",
		},
		jineng: {
			name: "../../../无名美化/animation/simashi/jineng",
		},
		sishipai: {
			name: "../../../无名美化/animation/simashi/sishipai",
		},
		wujiang: {
			name: "../../../无名美化/animation/simashi/swapseat/Ss_SMS_wujiang",
		},
		zhuanchang: {
			name: "../../../无名美化/animation/simashi/swapseat/Ss_SMS_zhuanchang",
		},
		finash: {
			name: "../../../无名美化/animation/simashi/swapseat/Ss_SMS_wujiang3",
		},
		maohuo: {
			name: "../../../无名美化/animation/simashi/swapseat/Ss_SMS_wujiang2",
		},
	};

	Object.assign(lib.skill.jinglve3, {
		content(event, trigger, player) {
			dcdAnim.loadSpine(window._SIMASHI.baikuang.name, "skel", function () {
				dcdAnim.playSpine(window._SIMASHI.baikuang, {
					speed: 1.2,
					scale: 0.6,
					parent: player,
				});
			});
			dcdAnim.loadSpine(window._SIMASHI.jineng.name, "skel", function () {
				dcdAnim.playSpine(window._SIMASHI.jineng, {
					speed: 1,
					scale: 1.2,
					x: [-105, 0],
					y: [-95, 0],
					parent: player,
				});
			});
			dcdAnim.loadSpine(window._SIMASHI.sishipai.name, "skel", function () {
				dcdAnim.playSpine(window._SIMASHI.sishipai, {
					speed: 0.7,
					scale: 0.4,
					parent: trigger.card,
					referFollow:true,
				});
			});
			game.delay(0, 1000);
			if (trigger.name == "useCard") {
				trigger.all_excluded = true;
				trigger.targets.length = 0;
			} else {
				if (trigger.name == "phase") {
					player.gain(player.storage.jinglve3, trigger.player, "giveAuto", "bySelf");
				} else if (get.position(player.storage.jinglve3, true) == "d") player.gain(player.storage.jinglve3, "gain2");
			}
			player.removeSkill("jinglve2");
		},
	});
	Object.assign(lib.skill.baiyi, {
		skillAnimation: true,
		animationColor:'thunder',
		contentBefore() {
		},
		init() {
			dcdAnim.loadSpine(window._SIMASHI.wujiang.name, "skel", function () {
				dcdAnim.prepSpine(window._SIMASHI.wujiang.name);
			});
			dcdAnim.loadSpine(window._SIMASHI.maohuo.name, "skel", function () {
				dcdAnim.prepSpine(window._SIMASHI.maohuo.name);
			});
			dcdAnim.loadSpine(window._SIMASHI.finash.name, "skel", function () {
				dcdAnim.prepSpine(window._SIMASHI.finash.name);
			});
		},
		content() {
			let scale = 1.25;
			if (lib.device) {
				scale = 1;
			}
			dcdAnim.loadSpine(window._SIMASHI.zhuanchang.name, "skel", function () {
				dcdAnim.playSpine(window._SIMASHI.zhuanchang, {
					scale: scale,
					speed: 0.8,
					x: [0, 0.5],
					y: [0, 0.5],
				});
			});
			player.awakenSkill("baiyi");
			game.broadcastAll(
				function (target1, target2) {
					let arr = [target1, target2];
					arr.forEach(item => {
						dcdAnim.playSpine(window._SIMASHI.wujiang, {
							scale: 0.7,
							parent: item,
						});
						dcdAnim.playSpine(window._SIMASHI.maohuo, {
							scale: 0.8,
							parent: item,
						});
					});
					game.swapSeat(target1, target2);
					setTimeout(()=>{
						arr.forEach(item => {
							dcdAnim.playSpine(window._SIMASHI.finash, {
								scale: 0.8,
								parent: item,
							});
						});
					},1000)
				},
				targets[0],
				targets[1]
			);
		},
	});
}
