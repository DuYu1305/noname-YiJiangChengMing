import { lib, game, ui, get, ai, _status } from "../../../noname.js";

//来源/参考自 Sakura美化(作者@柴油鹿鹿)   搬运请标注来源
//来源/参考自 特效补充(作者@珂赛特@u佬)
export function skilltexiaoPC() {
	window.testtexiao = (index = 0) => {
		window._wmmh_ol_texiao(game.players[index]);
	};
	window._wmmh_skilltexiao = () => {
		let players = game.players;
		players.forEach(player => {
			if (!player.txanManager) {
				let canvas = document.createElement("canvas");
				canvas.className = "dynamic-wrap dynamic-wrap2";
				// let canvas = new newDuilib.AnimationPlayer(null, player, null).canvas;
				// canvas.className = "dynamic-wrap dynamic-wrap2";
				canvas.style["z-index"] = 88;
				player.appendChild(canvas);
				// player.appendChild(canvas);
				player.txanManager = new AnimationManager("", canvas, null, {
					offscreen: false,
				});
			}
		});
	};
	if (lib.config.extension_无名美化_skilltexiao && lib.config.extension_无名美化_skilltexiao != "off") {
		window._WJMHSKILLTEXIAO = {
			SF_liezhuan_eff_bossjineng: {
				name: "../../../无名美化/animation/skilltexiao/SF_liezhuan_eff_bossjineng",
				speed: 2,
			}, //城主技能
			SSZBB_dizhu_jineng: {
				name: "../../../无名美化/animation/skilltexiao/SSZBB_dizhu_jineng",
				speed: 2,
			}, //地主技能
			effect_jineng_SZN: {
				name: "../../../无名美化/animation/skilltexiao/effect_jineng_SZN",
				speed: 2,
			}, //十周年技能转圈
			jinengXX: {
				name: "../../../无名美化/animation/skilltexiao/jinengXX",
				speed: 2,
			}, //手杀技能转圈
			// --
			wei_1: {
				name: "../../../无名美化/animation/skilltexiao/SF_jinengfadong_eff_fangyugaoji",
				x: [0, 0.6],
			},
			wei_2: {
				name: "../../../无名美化/animation/skilltexiao/SF_jinengfadong_eff_fumiangaoji",
				x: [0, 0.6],
			},
			shu_1: {
				name: "../../../无名美化/animation/skilltexiao/SF_jinengfadong_eff_gongjigaoji",
			},
			shu_2: {
				name: "../../../无名美化/animation/skilltexiao/SF_jinengfadong_eff_baofagaoji",
			},
			wu_1: {
				name: "../../../无名美化/animation/skilltexiao/SF_jinengfadong_eff_fuzhugaoji",
			},
			wu_2: {
				name: "../../../无名美化/animation/skilltexiao/SF_jinengfadong_eff_kongzhigaoji",
			},
			qun_1: {
				name: "../../../无名美化/animation/skilltexiao/SF_jinengfadong_eff_zhongxinggaoji",
			},
			qun_2: {
				name: "../../../无名美化/animation/skilltexiao/SF_jinengfadong_eff_maixuegaoji",
			},
			SLjin: {
				name: "../../../无名美化/animation/skilltexiao/SLjin",
				x: [0, 0.6],
			},
			SLshen: {
				name: "../../../无名美化/animation/skilltexiao/SLshen",
			},
			// --
			ZWwei: {
				name: "../../../无名美化/animation/skilltexiao/ZWwei",
			},
			ZWshu: {
				name: "../../../无名美化/animation/skilltexiao/ZWshu",
			},
			ZWwu: {
				name: "../../../无名美化/animation/skilltexiao/ZWwu",
			},
			ZWqun: {
				name: "../../../无名美化/animation/skilltexiao/ZWqun",
			},
			ZWjin: {
				name: "../../../无名美化/animation/skilltexiao/ZWjin",
			},
			ZWshen: {
				name: "../../../无名美化/animation/skilltexiao/ZWshen",
			},
			// --
			baikuang: {
				name: "../../../无名美化/animation/skilltexiao/baikuang",
				speed: 1.2,
			}, //白框
			jineng: {
				name: "../../../无名美化/animation/skilltexiao/jineng",
			}, //技能金光
			zhuanhuanji: {
				name: "../../../无名美化/animation/skilltexiao/zhuanhuanji",
			}, //转换技
		};
		window._wmmh_doudizhu_texiao = function (player) {
			// 城主
			dcdAnim.loadSpine(window._WJMHSKILLTEXIAO.SF_liezhuan_eff_bossjineng.name, "skel", function () {
				dcdAnim.playSpine(window._WJMHSKILLTEXIAO.SF_liezhuan_eff_bossjineng, {
					speed: 2,
					scale: 1,
					parent: player,
				});
			});
		};
		window._wmmh_shousha_texiao = function (player) {
			// dcdAnim.loadSpine(window._WJMHSKILLTEXIAO.jinengXX.name, "skel", function () {
			// 	dcdAnim.playSpine(window._WJMHSKILLTEXIAO.jinengXX, {
			// 		speed: 2,
			// 		scale: 1,
			// 		x: [-15, 0.5],
			// 		parent: player,
			// 	});
			// });

			let obj = {
				...window._WJMHSKILLTEXIAO.jinengXX,
				name: lib.assetURL + "extension" + window._WJMHSKILLTEXIAO.jinengXX.name.replace("../../..", ""),
				version: "3.6",
				speed: 2,
				scale: 1,
				x: [-15, 0.5],
			};
			player.txanManager.loadAndPlay(obj);
		};
		//势力框闪烁
		window._wmmh_shizhounian_texiao = function (player) {
			var group = "qun";
			if (["wei", "shu", "wu", "qun", "jin", "shen"].includes(player.group)) group = player.group;
			var args = {
				speed: 0.8,
				scale: 0.82,
				x: [0, 0.43],
				y: [0, 0.49],
				parent: player,
			};
			dcdAnim.loadSpine(window._WJMHSKILLTEXIAO["ZW" + group].name, "skel", function () {
				dcdAnim.playSpine(window._WJMHSKILLTEXIAO["ZW" + group], args);
			});
		};
		//ol+十周年
		window._wmmh_ol_texiao = function (player, trigger) {
			var name = "qun_1";
			if (lib.config.extension_无名美化_skilltexiaoset == "random") {
				let arr = ["wei_1", "wei_2", "shu_1", "shu_2", "wu_1", "wu_2", "qun_1", "qun_2", "SLjin", "SLshen"];
				name = arr.randomGet();
			} else {
				var group = player.group || "qun";
				let skills = player.getSkills(null, false, false);
				let anType = "2";
				if (trigger && trigger.skill == skills[0]) {
					anType = "1";
				}
				if (["wei", "shu", "wu", "qun"].includes(group)) {
					name = group + "_" + anType;
				} else if (["jin", "shen"].includes(group)) {
					name = "SL" + group;
				}
			}

			var args = {
				// speed: 1,
				scale: 0.8,
				parent: player,
			};
			// if (["wei", "jin"].includes(group)) args["x"] = [0, 0.6];
			// dcdAnim.loadSpine(window._WJMHSKILLTEXIAO[name].name, "skel", function () {
			// 	dcdAnim.playSpine(window._WJMHSKILLTEXIAO[name], args);
			// });
			let obj = {
				...window._WJMHSKILLTEXIAO[name],
				name: lib.assetURL + "extension" + window._WJMHSKILLTEXIAO[name].name.replace("../../..", ""),
				version: "3.6",
				scale: 0.8,
				// loop:true
			};
			if (["wei", "jin"].includes(group)) obj["x"] = [0, 0.6];
			player.txanManager.loadAndPlay(obj);
		};
		//by 倘若
		//需要使用新版本皮切 不然触发有问题
		lib.skill._wmmh_skilltexiao = {
			charlotte: true,
			forced: true,
			popup: false,
			forceLoad: true,
			firstDo: true,
			trigger: {
				global: ["useSkill", "logSkillBegin"],
			},
			filter: function (event, player) {
				if (["global", "equip"].includes(event.type)) {
					return false;
				}
				let skill = get.sourceSkillFor(event);
				let info = get.info(skill);
				if (!info || info.charlotte || info.equipSkill) {
					return false;
				}
				return true;
			},
			content(event, trigger, player) {
				window._wmmh_skilltexiao();
				var info = get.info(trigger.skill);
				if (trigger.player != player) {
					return;
				}
				// console.log("触发技能特效",event, trigger, player);
				if (!info.equipSkill) {
					if (info.zhuanhuanji) {
						// 太极
						// dcdAnim.loadSpine(window._WJMHSKILLTEXIAO.zhuanhuanji.name, "skel", function () {
						// 	dcdAnim.playSpine(window._WJMHSKILLTEXIAO.zhuanhuanji, {
						// 		speed: 1,
						// 		scale: 0.8,
						// 		parent: player,
						// 	});
						// });
						let obj = {
							...window._WJMHSKILLTEXIAO.zhuanhuanji,
							name: lib.assetURL + "extension" + window._WJMHSKILLTEXIAO.zhuanhuanji.name.replace("../../..", ""),
							version: "3.6",
							scale: 0.8,
						};
						player.txanManager.loadAndPlay(obj);
					} else if ((info.enable || info.equipSkill) && !info.skillAnimation) {
						switch (lib.config.extension_无名美化_skilltexiao) {
							case "1": {
								window._wmmh_shousha_texiao(player);
								break;
							}
							case "2": {
								window._wmmh_doudizhu_texiao(player);
								break;
							}
							case "3": {
								window._wmmh_shizhounian_texiao(player);
								break;
							}
							case "4": {
								window._wmmh_ol_texiao(player, trigger);
								break;
							}
						}
					} else {
						if (info.skillAnimation) {
							return;
						}
						switch (lib.config.extension_无名美化_skilltexiao) {
							case "1": {
								// 手杀
								//白框
								let obj = {
									...window._WJMHSKILLTEXIAO.baikuang,
									name: lib.assetURL + "extension" + window._WJMHSKILLTEXIAO.baikuang.name.replace("../../..", ""),
									version: "3.6",
									speed: 1.2,
									scale: 0.6,
									x: [0, 0.51],
									y: [0, 0.49],
								};
								player.txanManager.loadAndPlay(obj);
								// dcdAnim.loadSpine(window._WJMHSKILLTEXIAO.baikuang.name, "skel", function () {
								// 	dcdAnim.playSpine(window._WJMHSKILLTEXIAO.baikuang, {
								// 		speed: 1.2,
								// 		scale: 0.6,
								// 		x: [0, 0.51],
								// 		y: [0, 0.49],
								// 		parent: player,
								// 	});
								// });
								//扫光
								// dcdAnim.loadSpine(window._WJMHSKILLTEXIAO.jineng.name, "skel", function () {
								// 	dcdAnim.playSpine(window._WJMHSKILLTEXIAO.jineng, {
								// 		speed: 0.9,
								// 		scale: 1,
								// 		x: [-70, 0],
								// 		y: [-60, 0],
								// 		parent: player,
								// 	});
								// });

								let obj2 = {
									...window._WJMHSKILLTEXIAO.jineng,
									name: lib.assetURL + "extension" + window._WJMHSKILLTEXIAO.jineng.name.replace("../../..", ""),
									version: "3.6",
									speed: 0.9,
									scale: 1,
									x: [-70, 0],
									y: [-60, 0],
								};
								player.txanManager.loadAndPlay(obj2);
								break;
							}
							case "2": {
								window._wmmh_doudizhu_texiao(player);
								break;
							}
							case "3": {
								window._wmmh_shizhounian_texiao(player);
								break;
							}
							case "4": {
								window._wmmh_ol_texiao(player, trigger);
								break;
							}
						}
					}
				}
			},
		};
	}
}
