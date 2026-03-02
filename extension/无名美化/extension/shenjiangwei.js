import { lib, game, ui, get, ai, _status } from "../../../noname.js";

export function shenjiangwei() {
	window._MBShenJiangwei = {
		SS_Sjw_skill1: {
			name: "../../../无名美化/animation/shenJiangWei/SS_Sjw_skill1",
		},
		SS_Sjw_mask: {
			name: "../../../无名美化/animation/shenJiangWei/SS_Sjw_mask",
			action: "play2",
			loop: true,
		},
		SS_Sjw_skill2: {
			name: "../../../无名美化/animation/shenJiangWei/SS_Sjw_skill2",
		},
        SS_Sjw_dead: {
			name: "../../../无名美化/animation/shenJiangWei/SS_Sjw_dead",
		},
	};

	Object.assign(lib.skill.mbshenpei, {
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			function platAn() {
				return new Promise((resolve, reject) => {
					dcdAnim.loadSpine(window._MBShenJiangwei.SS_Sjw_mask.name, "skel", function () {
						player.storage.SS_Sjw_mask = dcdAnim.playSpine(window._MBShenJiangwei.SS_Sjw_mask);
					});
					dcdAnim.loadSpine(window._MBShenJiangwei.SS_Sjw_skill1.name, "skel", function () {
						player.storage.SS_Sjw_skill1 = dcdAnim.playSpine(window._MBShenJiangwei.SS_Sjw_skill1);
						player.storage.SS_Sjw_skill1.oncomplete = () => {
							dcdAnim.stopSpine(player.storage.SS_Sjw_mask);
							player.storage.SS_Sjw_mask = undefined;
							resolve();
						};
					});
				});
			}
			await platAn();
			const num = game.getAllGlobalHistory("everything", evt => {
				if (evt.name != "dying" || evt.player != player) {
					return false;
				}
				return true;
			}).length;
			if (num > 0) {
				await player.recover(num);
				const result = await player
					.chooseTarget(`绝烬：选择一名角色对其造成${num}点火焰伤害`, true)
					.set("ai", target => {
						const { player } = get.event();
						return get.damageEffect(target, player, player, "fire");
					})
					.forResult();
				if (result?.bool && result.targets?.length) {
					player.line(result.targets, "fire");
					await result.targets[0].damage(num, "fire");
				}
			}
			await player.addSkills("mbhuitian");
		},
	});
	Object.assign(lib.skill.mbhuitian, {
		async content(event, tigger, player) {
			function platAn() {
				return new Promise((resolve, reject) => {
					dcdAnim.loadSpine(window._MBShenJiangwei.SS_Sjw_mask.name, "skel", function () {
						player.storage.SS_Sjw_mask2 = dcdAnim.playSpine(window._MBShenJiangwei.SS_Sjw_mask);
					});
					dcdAnim.loadSpine(window._MBShenJiangwei.SS_Sjw_skill2.name, "skel", function () {
						player.storage.SS_Sjw_skill1 = dcdAnim.playSpine(window._MBShenJiangwei.SS_Sjw_skill2);
						player.storage.SS_Sjw_skill1.oncomplete = () => {
							dcdAnim.stopSpine(player.storage.SS_Sjw_mask2);
							player.storage.SS_Sjw_mask2 = undefined;
							resolve();
						};
					});
				});
			}
			await platAn();
			if (event.triggername == "roundStart") {
				await player.die();
			} else {
				player.insertPhase(event.name);
			}
		},
	});

	lib.skill._ss_sjw_die = {
		trigger: { player: "dieBefore" },
		direct: true,
		firstDo: true,
		charlotte: true,
		priority: Infinity,
		filter: function (event, player) {
			return player.name == "mb_shen_jiangwei" || player.name1 == "mb_shen_jiangwei" || player.name2 == "mb_shen_jiangwei";
		},
		async content(event, tigger, player) {
			function platAn() {
				return new Promise((resolve, reject) => {
					dcdAnim.loadSpine(window._MBShenJiangwei.SS_Sjw_dead.name, "skel", function () {
						player.storage.SS_Sjw_dead = dcdAnim.playSpine(window._MBShenJiangwei.SS_Sjw_dead,{
                            y:[0,0.3],
                            x:[0,0.54],
                            scale:lib.device?0.8:1
                        });
                        player.storage.SS_Sjw_dead.oncomplete = () => {
							player.storage.SS_Sjw_dead = undefined;
							resolve();
						};
					});
				});
			}
			await platAn();
		},
	};
}
