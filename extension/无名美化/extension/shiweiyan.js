import { lib, game, ui, get, ai, _status } from "../../../noname.js";
import { commonCreateImg } from "../utils/utils.js";
export function shiweiyan() {
	//自己扒的骨骼 天真佬教的pvr.czz转png感谢！
	window._SHIWEIYAN = {
		//
		SS_ShiWeiyanSkillJdt: {
			name: "../../../无名美化/animation/shiweiyan/SS_ShiWeiyanSkillJdt",
		},
		//使命成功失败动画
		SS_ShiWeiYanSkill: {
			name: "../../../无名美化/animation/shiweiyan/SS_ShiWeiYanSkill",
			scale: 1.15,
		},
		//壮誓
		SS_SWY_tongchang: {
			name: "../../../无名美化/animation/shiweiyan/SS_SWY_tongchang",
		},
		//壮誓
		SS_SWY_yinzhan: {
			name: "../../../无名美化/animation/shiweiyan/SS_SWY_yinzhan",
		},
		//狂骨
		SS_ShiWeiyanBeiDongSkill: {
			name: "../../../无名美化/animation/shiweiyan/SS_ShiWeiyanBeiDongSkill",
		},
		SS_ShiWeiyanFaDongSkill: {
			name: "../../../无名美化/animation/shiweiyan/SS_ShiWeiyanFaDongSkill",
		},
		//普通形态
		SS_SWY_zhuangtai1hongyan: {
			name: "../../../无名美化/animation/shiweiyan/SS_SWY_zhuangtai1hongyan",
		},
		//使命成功
		SS_SWY_zhuangtai2hongyan: {
			name: "../../../无名美化/animation/shiweiyan/SS_SWY_zhuangtai2hongyan",
		},
		SS_SWY_zhuangtai31hongyan: {
			name: "../../../无名美化/animation/shiweiyan/SS_SWY_zhuangtai31hongyan",
		},
		//使命失败特效 by扶苏
		SS_SWY_shibaitexiao: {
			name: "../../../无名美化/animation/shiweiyan/fusu",
		},
	};
	Object.assign(lib.skill.potkuanggu, {
		popup: false,
		async content(event, trigger, player) {
			const result = event.cost_data;
			if (result == "背水！" && player.skin.name === "pot_weiyan_achieve") {
				player.logSkill("potkuanggu", null, null, null, [player, get.rand(3, 4)]);
			} else {
				player.logSkill("potkuanggu", null, null, null, [player]);
			}

			if (result == "recover_hp" || result == "背水！") {
				await player.recover();
			}
			if (result == "draw_card" || result == "背水！") {
				await player.draw();
			}
			if (result == "背水！" && player.countCards("he")) {
				await player.chooseToDiscard("he", true);
				player.addTempSkill("potkuanggu_effect", "phaseChange");
				player.addMark("potkuanggu_effect", 1, false);
				game.broadcastAll(function (player) {
					dcdAnim.loadSpine(window._SHIWEIYAN.SS_ShiWeiyanFaDongSkill.name, "skel", function () {
						dcdAnim.playSpine({
							...window._SHIWEIYAN.SS_ShiWeiyanFaDongSkill,
							action: "play3",
						}, {
							speed: 1.2,
							x: [0, 0.6],
							y: [0, 0.53],
							scale: 0.85,
							parent: player,
						});
					});
				}, player);
			}
			if (result == "recover_hp") {
				game.broadcastAll(function (player) {
					dcdAnim.loadSpine(window._SHIWEIYAN.SS_ShiWeiyanFaDongSkill.name, "skel", function () {
						dcdAnim.playSpine({
							...window._SHIWEIYAN.SS_ShiWeiyanFaDongSkill,
							action: "play1",
						}, {
							speed: 1.2,
							x: [0, 0.6],
							y: [0, 0.53],
							scale: 0.85,
							parent: player,
						});
					});
				}, player);
			}
			if (result == "draw_card") {
				game.broadcastAll(function (player) {
					dcdAnim.loadSpine(window._SHIWEIYAN.SS_ShiWeiyanFaDongSkill.name, "skel", function () {
						dcdAnim.playSpine({
							...window._SHIWEIYAN.SS_ShiWeiyanFaDongSkill,
							action: "play2",
						}, {
							speed: 1.2,
							x: [0, 0.6],
							y: [0, 0.53],
							scale: 0.85,
							parent: player,
						});
					});
				}, player);
			}
		},
	});
	if (lib.skill.potzhongao) {
		Object.assign(lib.skill.potzhongao.subSkill.achieve, {
			async content(event, trigger, player) {
				player.awakenSkill(event.name.slice(0, -8));
				game.log(player, "成功完成使命");
				dcdAnim.loadSpine(window._SHIWEIYAN.SS_ShiWeiYanSkill.name, "skel", function () {
					dcdAnim.playSpine({
						...window._SHIWEIYAN.SS_ShiWeiYanSkill,
						action: "play2",
					});
				});
				game.broadcastAll(() => {
					_status.tempMusic = "effect_yinzhanBGM";
					game.playBackgroundMusic();
				});
				await game.delay(0, 4000);
				player.changeSkin("potzhongao", "pot_weiyan_achieve");
				if (get.mode() != "taixuhuanjing") {
					dcdAnim.loadSpine(window._SHIWEIYAN.SS_SWY_zhuangtai2hongyan.name, "skel", function () {
						dcdAnim.playSpine({
							...window._SHIWEIYAN.SS_SWY_zhuangtai2hongyan,
							loop: true,
						}, {
							referFollow: true,
							parent: player,
							loop: true,
						});
					});
				}

				player.setStorage("potkuanggu", 1);

				const num1 = player.countMark("potzhuangshi_limit"),
					num2 = player.countMark("potzhuangshi_directHit");
				if (num1 > 0) {
					await player.draw();
				}
				if (num2 > 0) {
					if (!player.isDamaged()) {
						await player.draw();
					} else {
						await player.recover();
					}
				}
			},
		});
		Object.assign(lib.skill.potzhongao.subSkill.fail, {
			async content(event, trigger, player) {
				player.awakenSkill(event.name.slice(0, -5));

				game.log(player, "使命失败");
				dcdAnim.loadSpine(window._SHIWEIYAN.SS_ShiWeiYanSkill.name, "skel", function () {
					dcdAnim.playSpine({
						...window._SHIWEIYAN.SS_ShiWeiYanSkill,
						action: "play1",
					});
				});
				game.broadcastAll(() => {
					_status.tempMusic = "effect_tuishouBGM";
					game.playBackgroundMusic();
				});
				await game.delay(0, 4000);
				dcdAnim.loadSpine(window._SHIWEIYAN.SS_SWY_shibaitexiao.name, "skel", function () {
					dcdAnim.playSpine(window._SHIWEIYAN.SS_SWY_shibaitexiao, {
						scale: 0.8,
						speed: 1,
						x: [0, 0.55],
						parent: player,
					});
				});
				player.changeSkin("potzhongao", "pot_weiyan_fail");
				if (ui._shiweiyanPw) {
					dcdAnim.loadSpine(window._SHIWEIYAN.SS_ShiWeiyanSkillJdt.name, "skel", function () {
						let anim = dcdAnim.playSpine(window._SHIWEIYAN.SS_ShiWeiyanSkillJdt, {
							parent: ui._shiweiyanPw,
						});
						// anim.oncomplete = function () {
						// 	document.body.removeChild(ui._shiweiyanPw);
						// };
						setTimeout(() => {
							document.body.removeChild(ui._shiweiyanPw);
						}, 700);
					});
				}
				//红眼特效
				if (get.mode() != "taixuhuanjing") {
					dcdAnim.loadSpine(window._SHIWEIYAN.SS_SWY_zhuangtai31hongyan.name, "skel", function () {
						dcdAnim.playSpine({
							...window._SHIWEIYAN.SS_SWY_zhuangtai31hongyan,
							loop: true,
						}, {
							referFollow: true,
							parent: player,
							loop: true,
						});
					});
				}
				await player.changeSkills(["kunfen"], ["potzhuangshi"]);
			},
		});
	}
	if (lib.skill.potzhuangshi) {
		function createPowLine(name, right) {
			let con = ui.create.div(`${name}`, document.body);
			con.style.cssText += `
				width: 4px;
				right:${right}px;
				height: 0;
				position:absolute;
				bottom:31px;
				z-index: 6;
				background-image: url("${lib.assetURL}extension/无名美化/animation/shiweiyan/paiju_shiweiyan_bar_02.png");
				background-repeat: no-repeat;
				background-size: unset;
				height: 9px;
				background-position: bottom;
				transition: height .6s linear;
			`;
			return con;
		}
		Object.assign(lib.skill.potzhuangshi, {
			init() {
				let img = commonCreateImg(`${lib.assetURL}extension/无名美化/animation/shiweiyan/paiju_shiweiyan_bar_01.png`, "shiweiyanPw");
				img.style.bottom = "0";
				img.style.right = "0";
				img.style.zIndex = "5";
			},
			createPower( loseHpNum, discardNum) {
					// 155 124 93 62 31
					if (discardNum > 0) {
						ui.shiweiyanCd = createPowLine(".shiweiyanCd", 24);
						setTimeout(() => {
							ui.shiweiyanCd.style.height = discardNum * 31 + "px";
						}, 0);
					}
					if (loseHpNum > 0) {
						ui.shiweiyanTl = createPowLine(".shiweiyanTl", 16);
						setTimeout(() => {
							ui.shiweiyanTl.style.height = loseHpNum * 31 + "px";
						}, 0);
					}
					
			},
			async content(event, trigger, player) {
				trigger.set("usedZhuangshi", true);
				const { cards, cost_data: numbers } = event;
				let loseHpNum = 0,
					discardNum = 0;
				if (cards) {
					const number = cards.length;
					discardNum = number;
					player.addTempSkill("potzhuangshi_directHit", "phaseChange");
					player.addMark("potzhuangshi_directHit", number, false);
					player.addTip("potzhuangshi_directHit", `不可响应 ${number}`);
					await player.modedDiscard(cards);
				}
				if (numbers) {
					const number = numbers[0];
					loseHpNum = number;
					player.addTempSkill("potzhuangshi_limit", "phaseChange");
					player.addMark("potzhuangshi_limit", number, false);
					player.addTip("potzhuangshi_limit", `不计次数 ${number}`);
					await player.loseHp(number);
				}
				lib.skill.potzhuangshi.createPower( loseHpNum, discardNum);
				//使命成功
				let name = "SS_SWY_yinzhan";
				if (player.getStorage("potkuanggu") != 1) {
					name = "SS_SWY_tongchang";
				}
				dcdAnim.loadSpine(window._SHIWEIYAN[name].name, "skel", function () {
					dcdAnim.playSpine(window._SHIWEIYAN[name]);
				});
				game.playAudio("../extension/无名美化/audio/wusheng/wushengTX.mp3");
			},
		});
		Object.assign(lib.skill.potzhuangshi.subSkill.limit, {
			async content(event, trigger, player) {
				if (trigger.addCount !== false) {
					trigger.addCount = false;
					player.getStat("card")[trigger.card.name]--;
				}
				player.removeMark("potzhuangshi_limit", 1, false);

				const num = player.countMark("potzhuangshi_limit");
				if (ui.shiweiyanTl) {
					ui.shiweiyanTl.style.height = num * 31 + "px";
				}

				if (num > 0) {
					player.addTip("potzhuangshi_limit", `不计次数 ${num}`);
				} else {
					setTimeout(() => {
						if (ui.shiweiyanTl) {
							ui.shiweiyanTl.remove();
							ui.shiweiyanTl = null;
						}
					}, 600);

					player.removeTip("potzhuangshi_limit");
				}
			},
			onremove(player, skill) {
				if (ui.shiweiyanTl) {
					ui.shiweiyanTl.remove();
					ui.shiweiyanTl = null;
				}
				player.clearMark(skill, false);
				player.removeTip(skill);
			},
		});
		Object.assign(lib.skill.potzhuangshi.subSkill.directHit, {
			async content(event, trigger, player) {
				trigger.directHit.addArray(game.players);
				player.removeMark("potzhuangshi_directHit", 1, false);
				const num = player.countMark("potzhuangshi_directHit");
				if (ui.shiweiyanCd) {
					ui.shiweiyanCd.style.height = num * 31 + "px";
				}

				if (num > 0) {
					player.addTip("potzhuangshi_directHit", `不可响应 ${num}`);
				} else {
					setTimeout(() => {
						if (ui.shiweiyanCd) {
							ui.shiweiyanCd.remove();
							ui.shiweiyanCd = null;
						}
					}, 600);
					player.removeTip("potzhuangshi_directHit");
				}
			},
			onremove(player, skill) {
				if (ui.shiweiyanCd) {
					ui.shiweiyanCd.remove();
					ui.shiweiyanCd = null;
				}
				player.clearMark(skill, false);
				player.removeTip(skill);
			},
		});
	}
	// let num = 1;
	// window.playHY = function () {
	// 	if (num == 3) {
	// 		num = 31;
	// 	}
	// 	dcdAnim.loadSpine(window._SHIWEIYAN[`SS_SWY_zhuangtai${num}hongyan`].name, "skel", function () {
	// 		dcdAnim.playSpine(window._SHIWEIYAN[`SS_SWY_zhuangtai${num}hongyan`], {
	// 			parent: game.players[0],
	// 		});
	// 		if (num == 31) {
	// 			num = 1;
	// 		} else {
	// 			num++;
	// 		}
	// 	});
	// };
}
