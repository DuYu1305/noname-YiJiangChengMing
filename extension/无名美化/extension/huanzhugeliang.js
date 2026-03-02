import { lib, game, ui, get, ai, _status } from "../../../noname.js";

export function huanzhugeliang() {
	window._HuanZhuGeLiang = {
		name: "无名美化",
		url: lib.assetURL + "extension/无名美化",
		// 幻诸葛亮入幻特效
		SSHW_ruhuan_ruhuan: {
			loop: true,
			name: "../../../无名美化/animation/huanzhugeliang/SSHW_ruhuan_ruhuan",
		},
		// 幻诸葛亮入幻
		SSHW_ruhuan_lizhuge: {
			name: "../../../无名美化/animation/huanzhugeliang/SSHW_ruhuan_lizhuge",
		},
		// 幻诸葛亮出幻
		SSHW_chuhuan_biaozhuge: {
			name: "../../../无名美化/animation/huanzhugeliang/SSHW_chuhuan_biaozhuge",
		},
	};
	Object.assign(lib.skill.twchanggui, {
		async content(event, trigger, player) {
			const num = player.maxHp - player.getHp();
			await player[num > 0 ? "loseMaxHp" : "gainMaxHp"](Math.abs(num));
			if (player.storage._huanzhuge_) {
				dcdAnim.stopSpine(player.storage._huanzhuge_);
				delete player.storage._huanzhuge_;
			}
			game.delay(0, 2700);
			dcdAnim.loadSpine(window._HuanZhuGeLiang.SSHW_chuhuan_biaozhuge.name, "skel", function () {
				dcdAnim.playSpine(window._HuanZhuGeLiang.SSHW_chuhuan_biaozhuge, {
					speed: 1,
					scale: 1,
					x: [0, 0.5],
					y: [0, 0.5],
				});
			});
			delete player.storage.isInHuan;
			player.changeSkin({ characterName: "huan_zhugeliang" }, "huan_zhugeliang");
			if (lib.config.extension_无名美化_huanzhugeliang_qiepi) {
				try {
					game.qhly_changeDynamicSkin(player.name, "经典形象");
				} catch (error) {
				}
			} 
			await player.changeSkills(["twhunyou"], get.info("twhunyou").derivation);
		},
	});
	Object.assign(lib.skill.twhunyou, {
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await player.recoverTo(1);
			player.addTempSkill(event.name + "_buff");
			if (!_status.currentPhase) return;
			player
				.when({ global: "phaseAfter" })
				.then(() => {
					player.insertPhase();
				})
				.then(() => {
					game.delay(0, 2700);
					dcdAnim.loadSpine(window._HuanZhuGeLiang.SSHW_ruhuan_lizhuge.name, "skel", function () {
						dcdAnim.playSpine(window._HuanZhuGeLiang.SSHW_ruhuan_lizhuge, {
							speed: 1,
							scale: 1,
							x: [0, 0.5],
							y: [0, 0.5],
						});
					});
					dcdAnim.loadSpine(window._HuanZhuGeLiang.SSHW_ruhuan_ruhuan.name, "skel", function () {
						player.storage._huanzhuge_ = dcdAnim.playSpine(window._HuanZhuGeLiang.SSHW_ruhuan_ruhuan, "skel", {
							speed: 1,
							scale: lib.device ? 0.8 : 1,
							x: [0, 0.5],
							y: [0, 0.5],
						});
					});
					player.storage.isInHuan = true;
					//huanzhugeliang_qiepi
					player.changeSkin({ characterName: "huan_zhugeliang" }, "huan_zhugeliang_shadow");
					if (lib.config.extension_无名美化_huanzhugeliang_qiepi) {
						try {
							game.qhly_changeDynamicSkin(player.name, "天意可叹");
						} catch (error) {
						}
					}
					player.changeSkills(get.info("twhunyou").derivation, ["twhunyou"]);
				});
		},
	});
}
