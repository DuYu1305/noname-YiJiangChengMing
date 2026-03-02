import { lib, game, ui, get, _status } from "../../noname.js";
import { ensureDialogCompat } from "./utils/dialog.js";
import { gainPlayerCard, initgainPlayerCardCss } from "./extension/gainPlayerCard.js";
import { discardPlayerCard, initdiscardPlayerCardCss } from "./extension/discardPlayerCard.js";
import { choosePlayerCard, initchoosePlayerCardCss } from "./extension/choosePlayerCard.js";
import { wugu, initwuguCss } from "./extension/wugu.js";
import { cixiongshuanggujian } from "./extension/cixiongshuanggujian.js";
import { tuozhuaizhishixian } from "./extension/tuozhuai.js";
import { applyHistoryLogFeatures } from "./extension/historyLog.js";
import { xuanjiangjiemian, initxuanjiangjiemianCss } from "./extension/xuanjiangjiemian.js";

game.import("extension", function () {
	return {
		name: "美化补充",
		content: function () {
			// 兼容武将美化里依赖的 dialog.newadd 接口
			ensureDialogCompat();

			if (
				lib.config.extension_美化补充_shoushalog ||
				lib.config.extension_美化补充_conciselog ||
				lib.config.extension_美化补充_pause
			) {
				// 搬运自“星之梦”的历史记录相关功能
				try {
					applyHistoryLogFeatures();
				} catch (e) {
					console.error("[美化补充] 历史记录功能初始化失败", e);
				}
			}

			if (lib.config.extension_美化补充_tongmingchongxuan) {
				// 搬运自“武将美化”的“开局同名武将AI重选”
				lib.skill._wjmh_tongmingchongxuan_ = {
					charlotte: true,
					forced: true,
					trigger: {
						global: "gameStart",
					},
					filter: function (event, player) {
						return game.me == player && ["doudizhu", "identity"].includes(lib.config.mode);
					},
					content: function () {
						"step 0";
						event.rawName = function (str) {
							var str2 = lib.translate[str];
							if (lib.translate[str + "_ab"]) str2 = lib.translate[str + "_ab"];
							if (!str2) return "";
							if (lib.translate[str + "_prefix"] && str2.startsWith(lib.translate[str + "_prefix"])) {
								str2 = str2.slice(lib.translate[str + "_prefix"].length);
							} else if (str2.indexOf("SP") == 0) {
								str2 = str2.slice(2);
							} else if (str2.indexOf("TW") == 0) {
								str2 = str2.slice(2);
							} else if (str2.indexOf("OL") == 0) {
								str2 = str2.slice(2);
							} else if (str2.indexOf("JSP") == 0) {
								str2 = str2.slice(3);
							} else if (str2.indexOf("☆SP") == 0) {
								str2 = str2.slice(3);
							} else if (str2.indexOf("手杀") == 0) {
								str2 = str2.slice(2);
							} else if (str2.indexOf("界") == 0 && lib.characterPack.refresh && lib.characterPack.refresh[str]) {
								str2 = str2.slice(1);
							} else if (
								str2.indexOf("旧") == 0 &&
								(lib.characterPack.old || lib.characterPack.mobile) &&
								(lib.characterPack.old[str] || lib.characterPack.mobile[str])
							) {
								str2 = str2.slice(1);
							} else if (str2.indexOf("新") == 0 && (str.indexOf("re_") == 0 || str.indexOf("new_") == 0)) {
								str2 = str2.slice(1);
							}
							return str2;
						};

						"step 1";
						event.targets = [];
						var targets = game.players.concat(game.dead).sortBySeat(player);
						for (var tar of targets) {
							var start = false;
							for (var cur of targets) {
								if (cur == tar) {
									start = true;
									continue;
								}
								if (!start) continue;

								var trn = event.rawName(tar.name);
								var crn = event.rawName(cur.name);
								if (trn && trn.length && crn && crn.length && trn == crn) {
									event.targets.push(cur);
									break;
								}
							}
						}
						if (!event.targets.length) event.finish();

						"step 2";
						var list = get.gainableCharacters(function (info) {
							return info[3].length > 0;
						});
						var allTargets = game.players.concat(game.dead);
						for (var i = 0; i < allTargets.length; i++) {
							list.remove(allTargets[i].name);
							list.remove(allTargets[i].name1);
							list.remove(allTargets[i].name2);
						}
						list.randomSort();
						var dupTargets = event.targets;
						event.target = dupTargets[0];
						var target = event.target;
						if (list.length > 50) list = list.slice(0, 50);
						for (var cur of list) {
							for (var tar of dupTargets) {
								var trn = event.rawName(tar.name);
								var crn = event.rawName(cur);
								if (trn && trn.length && crn && crn.length && trn == crn) {
									list.remove(cur);
									break;
								}
							}
						}
						target.chooseButton(["重选武将", [list.randomGets(3), "character"]], true);

						"step 3";
						if (result.bool && result.links && result.links.length) {
							var current = event.target;
							current.reinit(current.name, result.links[0]);
							current.changeGroup(lib.character[current.name][1]);
							current.update();
						}

						"step 4";
						event.goto(1);
					},
				};
			}

			if (lib.config.extension_美化补充_qianzhui) {
				// 搬运自“武将美化”的“隐藏武将前缀”
				var styleId = "mhbc-hide-character-prefix-style";
				if (!document.getElementById(styleId)) {
					var style = document.createElement("style");
					style.id = styleId;
					style.innerHTML = `
						.player>.camp-wrap>.avatar-name>span[data-nature],
						.button.character>.name>span[data-nature] {
							display: none;
						}
					`;
					document.head.appendChild(style);
				}
			}

			if (lib.config.extension_美化补充_gainPlayerCard) {
				// 搬运自“武将美化”的“顺牌框美化”
				initgainPlayerCardCss();
				gainPlayerCard();
			}

			if (lib.config.extension_美化补充_discardPlayerCard) {
				// 搬运自“武将美化”的“拆牌框美化”
				initdiscardPlayerCardCss();
				discardPlayerCard();
			}

			if (lib.config.extension_美化补充_choosePlayerCard) {
				// 搬运自“武将美化”的“选牌框美化”
				initchoosePlayerCardCss();
				choosePlayerCard();
			}

			if (lib.config.extension_美化补充_wugu) {
				// 搬运自“武将美化”的“五谷丰登框美化”
				initwuguCss();
				wugu();
			}

			const enableDoudizhuXuanjiang =
				lib.config.mode == "doudizhu" &&
				lib.config.extension_美化补充_doudizhuxuanjiangjiemian &&
				lib.config.extension_美化补充_doudizhuxuanjiangjiemian != "off";
			const enableDuijueXuanjiang =
				lib.config.mode == "versus" &&
				lib.config.extension_美化补充_duijuexuanjiangjiemian &&
				lib.config.extension_美化补充_duijuexuanjiangjiemian != "off";
			const enableJunzhengXuanjiang =
				lib.config.mode == "identity" &&
				lib.config.extension_美化补充_junzhengxuanjiangjiemian &&
				lib.config.extension_美化补充_junzhengxuanjiangjiemian == "shousha";

			if (enableDoudizhuXuanjiang || enableDuijueXuanjiang || enableJunzhengXuanjiang) {
				// 搬运自“武将美化”的“斗地主选将界面/对决选将界面”
				initxuanjiangjiemianCss();
				xuanjiangjiemian();
			}

			if (lib.config.extension_美化补充_dizhuruchang) {
				// 搬运自“武将美化”的“斗地主-地主入场特效”
				window._MHBC_DIZHU_RUCHANG = {
					SF_paiju_jie_zuowei5: {
						name: "../../../美化补充/animation/doudizhu/SF_paiju_jie_zuowei5",
					},
				};
				lib.skill._mhbc_ddz_dizhu_ruchang = {
					priority: 114514,
					charlotte: true,
					popup: false,
					direct: true,
					silent: true,
					trigger: {
						global: "gameStart",
					},
					filter: function (event, player) {
						return lib.config.mode == "doudizhu" && player.identity == "zhu";
					},
					content: function () {
						if (typeof dcdAnim == "undefined" || !dcdAnim.loadSpine || !dcdAnim.playSpine) return;
						dcdAnim.loadSpine(window._MHBC_DIZHU_RUCHANG.SF_paiju_jie_zuowei5.name, "skel", function () {
							dcdAnim.playSpine(window._MHBC_DIZHU_RUCHANG.SF_paiju_jie_zuowei5, {
								speed: 0.7,
								scale: 0.8,
								x: [0, 0.435],
								y: [0, 0.5],
								parent: player,
							});
						});
						game.delay(1.5);
					},
				};
			}

			if (lib.config.extension_美化补充_jiuwo && lib.config.extension_美化补充_jiuwo != "off") {
				// 搬运自“武将美化”的“其他特效-濒死特效/救我特效”
				window._MHBCJIUWOTEXIAO = {
					binsi: {
						name: "../../../美化补充/animation/globaltexiao/jiuwo/shizhounian/binsi",
					},
					jiuwo: {
						name: "../../../美化补充/animation/globaltexiao/jiuwo/shizhounian/jiuwo",
					}, // 十周年
					Xjiuwo: {
						name: "../../../美化补充/animation/globaltexiao/jiuwo/shousha/Xjiuwo",
					}, // 手杀
					XXjiuwo: {
						name: "../../../美化补充/animation/globaltexiao/jiuwo/nuyansanguo/XXjiuwo",
					}, // 怒焰三国
				};

				game.mhbcClearJiuwoForPlayer = function (target) {
					if (!target) return;
					var canStop = typeof dcdAnim != "undefined" && !!dcdAnim.stopSpine;
					if (target._mhbc_jiuwo_eff_1_) {
						if (canStop) dcdAnim.stopSpine(target._mhbc_jiuwo_eff_1_);
						target._mhbc_jiuwo_eff_1_ = undefined;
					}
					if (target._mhbc_jiuwo_eff_2_) {
						if (canStop) dcdAnim.stopSpine(target._mhbc_jiuwo_eff_2_);
						target._mhbc_jiuwo_eff_2_ = undefined;
					}
					if (target._mhbc_jiuwo_eff_3_) {
						if (canStop) dcdAnim.stopSpine(target._mhbc_jiuwo_eff_3_);
						target._mhbc_jiuwo_eff_3_ = undefined;
					}
					if (target._mhbc_jiuwo_eff_4_) {
						if (canStop) dcdAnim.stopSpine(target._mhbc_jiuwo_eff_4_);
						target._mhbc_jiuwo_eff_4_ = undefined;
					}
					if (target._mhbc_jiuwo_time_3_) {
						clearTimeout(target._mhbc_jiuwo_time_3_);
						target._mhbc_jiuwo_time_3_ = undefined;
					}
					if (target._mhbc_jiuwo_time_2_) {
						clearTimeout(target._mhbc_jiuwo_time_2_);
						target._mhbc_jiuwo_time_2_ = undefined;
					}
					if (target._mhbc_jiuwo_time_1_) {
						clearTimeout(target._mhbc_jiuwo_time_1_);
						target._mhbc_jiuwo_time_1_ = undefined;
					}
					if (target._mhbc_jiuwo_) {
						if (canStop) dcdAnim.stopSpine(target._mhbc_jiuwo_);
						target._mhbc_jiuwo_ = undefined;
					}
				};
				game.mhbc_clearJiuwoEffects = function () {
					var targets = game.players.concat(game.dead);
					targets.forEach(function (target) {
						game.mhbcClearJiuwoForPlayer(target);
						// loadSpine 可能异步回调，二次清理兜底防止残留
						setTimeout(function () {
							game.mhbcClearJiuwoForPlayer(target);
						}, 2000);
					});
				};
				if (!game._mhbc_jiuwo_over_hooked_) {
					game._mhbc_jiuwo_over_hooked_ = true;
					lib.skill._mhbc_jiuwo_over_cleanup_ = {
						charlotte: true,
						forced: true,
						trigger: {
							global: "gameOver",
						},
						content: function () {
							game.mhbc_clearJiuwoEffects();
						},
					};
					lib.onover.push(function () {
						game.mhbc_clearJiuwoEffects();
					});
				}

				lib.skill._mhbc_add_jiuwo_ = {
					charlotte: true,
					forced: true,
					popup: false,
					forceDie: true,
					trigger: {
						player: "dyingBegin",
					},
					content: function () {
						if (typeof dcdAnim == "undefined" || !dcdAnim.loadSpine || !dcdAnim.playSpine || !dcdAnim.stopSpine) return;
						var mode = lib.config.extension_美化补充_jiuwo;
						var eff_anim;
						var eff_args = {
							speed: 1,
							scale: 0.78,
							x: [10, 0.4],
							parent: player,
							loop: true,
						};
						if (mode == "shizhounian") {
							eff_anim = "binsi";

							eff_args.action = "play";
							dcdAnim.loadSpine(window._MHBCJIUWOTEXIAO[eff_anim].name, "skel", function () {
								player._mhbc_jiuwo_eff_1_ = dcdAnim.playSpine(window._MHBCJIUWOTEXIAO[eff_anim], eff_args);
							});
							player._mhbc_jiuwo_time_1_ = setTimeout(function () {
								if (player._mhbc_jiuwo_ && player._mhbc_jiuwo_eff_1_) {
									dcdAnim.stopSpine(player._mhbc_jiuwo_eff_1_);
									player._mhbc_jiuwo_eff_1_ = undefined;

									eff_args.action = "play2";
									dcdAnim.loadSpine(window._MHBCJIUWOTEXIAO[eff_anim].name, "skel", function () {
										player._mhbc_jiuwo_eff_2_ = dcdAnim.playSpine(window._MHBCJIUWOTEXIAO[eff_anim], eff_args);
									});

									player._mhbc_jiuwo_time_2_ = setTimeout(function () {
										if (player._mhbc_jiuwo_ && player._mhbc_jiuwo_eff_2_) {
											dcdAnim.stopSpine(player._mhbc_jiuwo_eff_2_);
											player._mhbc_jiuwo_eff_2_ = undefined;

											eff_args.action = "play3";
											dcdAnim.loadSpine(window._MHBCJIUWOTEXIAO[eff_anim].name, "skel", function () {
												player._mhbc_jiuwo_eff_3_ = dcdAnim.playSpine(window._MHBCJIUWOTEXIAO[eff_anim], eff_args);
											});

											player._mhbc_jiuwo_time_3_ = setTimeout(function () {
												if (player._mhbc_jiuwo_ && player._mhbc_jiuwo_eff_3_) {
													dcdAnim.stopSpine(player._mhbc_jiuwo_eff_3_);
													player._mhbc_jiuwo_eff_3_ = undefined;

													eff_args.action = "play4";
													dcdAnim.loadSpine(window._MHBCJIUWOTEXIAO[eff_anim].name, "skel", function () {
														player._mhbc_jiuwo_eff_4_ = dcdAnim.playSpine(window._MHBCJIUWOTEXIAO[eff_anim], eff_args);
													});
												}
											}, 2000);
										}
									}, 2000);
								}
							}, 2000);
						}

						var anim;
						var args = {
							loop: true,
							tqload: true,
							parent: player,
						};
						if (mode == "shizhounian") {
							anim = "jiuwo";
							args.speed = 0.34;
							args.scale = 0.65;
							args.action = "play";
						} else if (mode == "shousha") {
							anim = "Xjiuwo";
							args.speed = 0.34;
							args.scale = 0.8;
							args.action = "Xjiuwo";
						} else if (mode == "nuyansanguo") {
							anim = "XXjiuwo";
							args.speed = 0.34;
							args.scale = 0.65;
							args.action = "play1";
						}
						if (anim) {
							dcdAnim.loadSpine(window._MHBCJIUWOTEXIAO[anim].name, "skel", function () {
								window._MHBCJIUWOTEXIAO[anim].loop = true;
								player._mhbc_jiuwo_ = dcdAnim.playSpine(window._MHBCJIUWOTEXIAO[anim], args);
							});
						}
					},
				};

				lib.skill._mhbc_delete_jiuwo_ = {
					charlotte: true,
					forced: true,
					forceDie: true,
					trigger: {
						player: ["dyingAfter", "die", "dieBegin", "dieAfter"],
					},
					filter: function (event, player, name) {
						// 仍处于濒死时不要清理特效，避免“闪一下就消失”
						// 该引擎在 dyingAfter 阶段可能短暂不算 isDying，但 hp 仍<=0
						// 因此按血量判断：只有脱离濒死（hp>0）才清理
						if (name == "dyingAfter" || event.name == "dying") return player.hp > 0 || player.isDead();
						return true;
					},
					content: function () {
						if (game.mhbcClearJiuwoForPlayer) game.mhbcClearJiuwoForPlayer(player);
					},
				};
			}

			if (lib.config.extension_美化补充_loseMaxHp) {
				// 搬运自“武将美化”的“音效-失去体力上限音效”
				lib.skill._mhbc_loseMaxHp = {
					priority: -Infinity,
					ruleSkill: true,
					charlotte: true,
					direct: true,
					lastDo: true,
					trigger: {
						player: "loseMaxHpBegin",
					},
					content: function () {
						game.playAudio("..", "extension", "美化补充", "audio", "yinxiao", "loseMaxHp", "loseMaxHp");
					},
				};
			}

			if (lib.config.extension_美化补充_cixiongshuanggujian) {
				// 搬运自“武将美化”的“雌雄双股剑优化”
				cixiongshuanggujian();
			}

			if (lib.config.extension_美化补充_zhishixian) {
				// 搬运自“武将美化”的“拖拽指示线”
				tuozhuaizhishixian();
			}

			if (lib.config.extension_美化补充_tiesuotexiao && lib.config.extension_美化补充_tiesuotexiao != "off") {
				// 搬运自“武将美化”的“其他特效-铁索连环特效”
				window._MHBCTIESUOTEXIAO = {
					// 手杀
					shousha_tiesuo: {
						name: "../../../美化补充/animation/globaltexiao/tiesuo/shousha/tiesuolianhuan",
					},
					shousha_tiesuo2: {
						name: "../../../美化补充/animation/globaltexiao/tiesuo/shousha/tiesuolianhuan2",
					},
					// 十周年
					shizhounian_tiesuo: {
						name: "../../../美化补充/animation/globaltexiao/tiesuo/shizhounian/tiesuolianhuan",
					},
					// OL
					ol_tiesuo: {
						name: "../../../美化补充/animation/globaltexiao/tiesuo/ol/tiesuo",
					},
					ol_tiesuo_shouji: {
						name: "../../../美化补充/animation/globaltexiao/tiesuo/ol/tiesuo_shouji",
					},
				};

				const tiesuoMode = lib.config.extension_美化补充_tiesuotexiao;
				if (tiesuoMode == "shousha") {
					var style = document.createElement("style");
					style.innerHTML = `
						.player.linked2>.chain {
							top: 30%;
							background-image: url("${lib.assetURL}extension/美化补充/animation/globaltexiao/tiesuo/shousha/静态素材/tiesuolianhuan.png");
						}
						.player.mhbc_linked.linked2>.chain {
							top: 30%;
							background-image: url("${lib.assetURL}extension/美化补充/animation/globaltexiao/tiesuo/shousha/静态素材/tiesuolianhuan2.png");
						}
					`;
					document.head.appendChild(style);

					lib.skill._mhbc_tiesuotexiao_ = {
						priority: 2020,
						charlotte: true,
						forced: true,
						forceDie: true,
						trigger: {
							player: ["linkBefore", "die"],
						},
						filter: function (event, player) {
							return true;
						},
						content: function () {
							if (typeof dcdAnim == "undefined" || !dcdAnim.loadSpine || !dcdAnim.playSpine || !dcdAnim.stopSpine) return;
							var anim = "shousha_tiesuo";
							if (player.hasSkill("nzry_jieying_1") || player.hasSkill("jslbjy")) anim = "shousha_tiesuo2";
							if (player.hasSkill("nzry_jieying_1") || player.hasSkill("jslbjy")) player.classList.add("mhbc_linked");
							else player.classList.remove("mhbc_linked");
							var args = {
								scale: 0.65,
								speed: 1,
								follow: true,
								x: [0, 0.7],
								y: [0, 0.55],
								loop: true,
								tqload: true,
								parent: player,
							};
							if (event.triggername == "die") {
								if (player.mhbc_tiesuo_link) {
									dcdAnim.stopSpine(player.mhbc_tiesuo_link);
									player.mhbc_tiesuo_link = undefined;

									dcdAnim.loadSpine(window._MHBCTIESUOTEXIAO[anim].name, "skel", function () {
										args.action = "play4";
										player.mhbc_tiesuo_link = dcdAnim.playSpine(window._MHBCTIESUOTEXIAO[anim], args);
									});

									setTimeout(function () {
										dcdAnim.stopSpine(player.mhbc_tiesuo_link);
										player.mhbc_tiesuo_link = undefined;
									}, 700);
								}
							} else {
								if (player.isLinked()) {
									var parent = _status.event.getParent("damage");
									if (parent && parent.nature) {
										if (player.mhbc_tiesuo_link) {
											dcdAnim.stopSpine(player.mhbc_tiesuo_link);
											player.mhbc_tiesuo_link = undefined;
										}

										dcdAnim.loadSpine(window._MHBCTIESUOTEXIAO[anim].name, "skel", function () {
											args.action = "play4";
											player.mhbc_tiesuo_link = dcdAnim.playSpine(window._MHBCTIESUOTEXIAO[anim], args);
										});

										setTimeout(function () {
											dcdAnim.stopSpine(player.mhbc_tiesuo_link);
											player.mhbc_tiesuo_link = undefined;
										}, 700);
									} else {
										if (player.mhbc_tiesuo_link) {
											dcdAnim.stopSpine(player.mhbc_tiesuo_link);
											player.mhbc_tiesuo_link = undefined;
										}

										dcdAnim.loadSpine(window._MHBCTIESUOTEXIAO[anim].name, "skel", function () {
											game.playAudio("../extension/美化补充/animation/globaltexiao/audio/tiesuo/tiesuo2.mp3");
											args.action = "play3";
											player.mhbc_tiesuo_link = dcdAnim.playSpine(window._MHBCTIESUOTEXIAO[anim], args);
										});

										setTimeout(function () {
											dcdAnim.stopSpine(player.mhbc_tiesuo_link);
											player.mhbc_tiesuo_link = undefined;
										}, 1000);
									}
								} else {
									if (player.mhbc_tiesuo_link) {
										dcdAnim.stopSpine(player.mhbc_tiesuo_link);
										player.mhbc_tiesuo_link = undefined;
									}

									dcdAnim.loadSpine(window._MHBCTIESUOTEXIAO[anim].name, "skel", function () {
										game.playAudio("../extension/美化补充/animation/globaltexiao/audio/tiesuo/tiesuo.wav");
										args.action = "play";
										player.mhbc_tiesuo_link = dcdAnim.playSpine(window._MHBCTIESUOTEXIAO[anim], args);
									});

									setTimeout(function () {
										dcdAnim.stopSpine(player.mhbc_tiesuo_link);
										player.mhbc_tiesuo_link = undefined;
									}, 1300);
								}
							}
						},
					};
				} else if (tiesuoMode == "shizhounian") {
					lib.skill._mhbc_tiesuotexiao_ = {
						priority: 2,
						charlotte: true,
						forced: true,
						trigger: {
							player: "linkBefore",
						},
						filter: function (event, player) {
							return true;
						},
						content: function () {
							if (
								typeof skinSwitch == "undefined" ||
								!skinSwitch.chukuangWorkerApi ||
								!skinSwitch.chukuangWorkerApi.playEffect
							)
								return;
							var tiesuo = {
								name: window._MHBCTIESUOTEXIAO.shizhounian_tiesuo.name,
								version: "3.6",
							};
							var tiesuo_args = {
								scale: 0.6,
								speed: 0.8,
								x: [0, 0.4],
								y: [0, 0.53],
								parent: player,
							};
							if (player.isLinked()) {
								var parent = _status.event.getParent("damage");
								if (parent && parent.nature) {
									var naturedict = {
										fire: "play2",
										thunder: "play3",
									};
									if (parent.nature in naturedict) {
										tiesuo.action = naturedict[parent.nature];
										skinSwitch.chukuangWorkerApi.playEffect(tiesuo, tiesuo_args);
									} else {
										tiesuo.action = "play4";
										skinSwitch.chukuangWorkerApi.playEffect(tiesuo, tiesuo_args);
									}
								} else {
									game.playAudio("../extension/美化补充/animation/globaltexiao/audio/tiesuo/tiesuo2.mp3");
									tiesuo.action = "play5";
									skinSwitch.chukuangWorkerApi.playEffect(tiesuo, tiesuo_args);
								}
							} else {
								game.playAudio("../extension/美化补充/animation/globaltexiao/audio/tiesuo/tiesuo.wav");
								tiesuo.action = "play1";
								skinSwitch.chukuangWorkerApi.playEffect(tiesuo, tiesuo_args);
							}
						},
					};
				} else if (tiesuoMode == "ol") {
					lib.skill._mhbc_tiesuotexiao_ = {
						priority: 2,
						charlotte: true,
						forced: true,
						trigger: {
							player: "linkBefore",
						},
						filter: function (event, player) {
							return true;
						},
						content: function () {
							if (
								typeof skinSwitch == "undefined" ||
								!skinSwitch.chukuangWorkerApi ||
								!skinSwitch.chukuangWorkerApi.playEffect
							)
								return;
							var tiesuo = {
								name: window._MHBCTIESUOTEXIAO.ol_tiesuo.name,
								version: "4.0",
								json: true,
							};
							var tiesuo_args = {
								scale: 0.78,
								speed: 0.8,
								x: [0, 0.45],
								y: [0, 0.57],
								parent: player,
							};
							if (player.isLinked()) {
								var parent = _status.event.getParent("damage");
								if (parent && parent.nature) {
									var shouji = {
										name: window._MHBCTIESUOTEXIAO.ol_tiesuo_shouji.name,
										version: "4.0",
										json: true,
									};
									var shouji_args = {
										scale: 0.84,
										speed: 0.8,
										x: [0, 0.54],
										y: [0, 0.5],
										parent: player,
									};
									var naturedict = {
										fire: "play",
										thunder: "play2",
										ice: "play3",
									};
									if (parent.nature in naturedict) {
										shouji.action = naturedict[parent.nature];
										skinSwitch.chukuangWorkerApi.playEffect(shouji, shouji_args);
									} else {
										tiesuo.action = "play3";
										skinSwitch.chukuangWorkerApi.playEffect(tiesuo, tiesuo_args);
									}
								} else {
									game.playAudio("../extension/美化补充/animation/globaltexiao/audio/tiesuo/tiesuo2.mp3");
									tiesuo.action = "play4";
									skinSwitch.chukuangWorkerApi.playEffect(tiesuo, tiesuo_args);
								}
							} else {
								game.playAudio("../extension/美化补充/animation/globaltexiao/audio/tiesuo/tiesuo.wav");
								tiesuo.action = "play";
								skinSwitch.chukuangWorkerApi.playEffect(tiesuo, tiesuo_args);
							}
						},
					};
				}
			}

			if (lib.config.extension_美化补充_oljinnangjuedoutexiao) {
				// 搬运自“标记补充”的“OL特效-OL锦囊-决斗特效”
				window._MHBCOLJINNANGJUEDOUTEXIAO = {
					Juedou_Blue: {
						name: "../../../美化补充/animation/globaltexiao/oljinnang/juedou/Juedou_Blue",
					},
					Juedou_Red: {
						name: "../../../美化补充/animation/globaltexiao/oljinnang/juedou/Juedou_Red",
					},
				};
				lib.skill._mhbc_oljinnangjuedoutexiao_ = {
					firstDo: true,
					charlotte: true,
					forced: true,
					trigger: {
						player: ["useCardBegin", "respondBegin"],
					},
					filter: function (event, player) {
						return (
							event.card &&
							event.card.name == "juedou" &&
							get.type(event.card) == "trick" &&
							typeof skinSwitch != "undefined" &&
							skinSwitch.chukuangWorkerApi &&
							skinSwitch.chukuangWorkerApi.playEffect
						);
					},
					content: function () {
						var args = {
							scale: 0.8,
						};
						var effectParent =
							trigger.card && typeof trigger.card.getBoundingClientRect == "function" ? trigger.card : null;
						if (effectParent) {
							args.parent = effectParent;
						} else {
							args.x = [0, 0.5];
							args.y = [0, 0.5];
						}
						skinSwitch.chukuangWorkerApi.playEffect(
							{
								name: window._MHBCOLJINNANGJUEDOUTEXIAO.Juedou_Blue.name,
								version: "4.0",
								action: "play",
							},
							Object.assign({}, args)
						);
						skinSwitch.chukuangWorkerApi.playEffect(
							{
								name: window._MHBCOLJINNANGJUEDOUTEXIAO.Juedou_Red.name,
								version: "4.0",
								action: "play",
							},
							Object.assign({}, args)
						);
						game.playAudio("../extension/美化补充/animation/globaltexiao/audio/ol/juedou.mp3");
					},
				};
			}
		},
		config: {
			tongmingchongxuan: {
				name: "开局同名武将AI重选",
				intro: "斗地主和身份模式下，开局若出现同名武将，AI将自动重选武将。",
				init: false,
			},
			qianzhui: {
				name: "隐藏武将前缀",
				intro: "游戏开始后，比如“神郭嘉”会显示为“郭嘉”。",
				init: false,
			},
			dizhuruchang: {
				name: "斗地主-地主入场特效",
				intro: "斗地主模式中，地主在开局播放入场特效。",
				init: false,
			},
			doudizhuxuanjiangjiemian: {
				name: "斗地主选将界面",
				init: "off",
				intro: "仅限休闲斗地主",
				item: {
					off: "关闭",
					onlyshoushabuju: "仅手杀布局",
					shousha: "手杀样式",
				},
			},
			duijuexuanjiangjiemian: {
				name: "对决选将界面",
				init: "off",
				intro: "替补模式无效",
				item: {
					off: "关闭",
					onlyshoushabuju: "仅手杀布局",
					shousha: "手杀样式",
				},
			},
			jiuwo: {
				name: "濒死特效/救我特效",
				init: "off",
				item: {
					off: "关闭",
					shizhounian: "十周年",
					shousha: "手杀",
					nuyansanguo: "怒焰三国",
				},
			},
			loseMaxHp: {
				name: "失去体力上限音效",
				init: false,
			},
			shoushalog: {
				name: "手杀出牌记录",
				intro: "开启后，屏幕中间显示手杀样式的出牌记录",
				init: false,
				onclick: function () {
					if (lib.config.extension_美化补充_shoushalog == false) {
						game.saveConfig("extension_美化补充_shoushalog", true);
						game.saveConfig("show_log", "center");
						game.saveConfig("clear_log", true);
					} else {
						game.saveConfig("extension_美化补充_shoushalog", false);
						game.saveConfig("show_log", "off");
					}
					game.reload();
				},
			},
			conciselog: {
				name: "精简历史记录",
				intro: "开启后，将精简化屏幕中间显示的出牌记录，联机建议关闭",
				init: false,
			},
			pause: {
				name: "历史记录栏美化",
				intro: "开启后替换暂停界面的历史记录栏样式",
				init: false,
			},
			pausescrollsize_enable: {
				name: "历史记录栏|滚轮横向调整",
				intro: "开启后使用下方数值调整滚轮的横向位置",
				init: false,
			},
			pausescrollsize: {
				name: "滚轮横向偏移(%)",
				clear: true,
				onclick: function () {
					if (this.pausescroll_size == undefined) {
						var dv = document.createElement("div");
						dv.style.whiteSpace = "nowrap";
						dv.style.width = "calc(100% - 10px)";

						var jianwu = document.createElement("button");
						jianwu.style.width = "50px";
						jianwu.textContent = "-5%";

						var jianyi = document.createElement("button");
						jianyi.style.width = "50px";
						jianyi.textContent = "-1%";

						function getConfig(ext, id, def) {
							var str = ["extension", ext, id].join("_");
							var val = lib.config[str];
							return typeof val !== "undefined" || val ? val : def;
						}
						var text = document.createElement("div");
						text.style.width = "60px";
						text.textContent = getConfig("美化补充", "pausescrollsize", 22).toFixed(1) + "%";

						var jiayi = document.createElement("button");
						jiayi.style.width = "50px";
						jiayi.textContent = "+1%";

						var jiawu = document.createElement("button");
						jiawu.style.width = "50px";
						jiawu.textContent = "+5%";

						dv.appendChild(jianwu);
						dv.appendChild(jianyi);
						dv.appendChild(text);
						dv.appendChild(jiayi);
						dv.appendChild(jiawu);

						var div = ui.create.div();
						div.appendChild(dv);

						function changeValue(val = 0) {
							val = getConfig("美化补充", "pausescrollsize", 22) + val;
							text.textContent = val.toFixed(1) + "%";
							game.saveConfig("extension_美化补充_pausescrollsize", val);
							game.saveConfig("pausescrollsize", val);
							let element = document.querySelector(".pausedbg>.scrollbar");
							if (element) element.style.right = val.toFixed(1) + "%";
						}
						jianwu.onclick = () => changeValue(-5);
						jianyi.onclick = () => changeValue(-1);
						jiayi.onclick = () => changeValue(1);
						jiawu.onclick = () => changeValue(5);
						this.parentNode.insertBefore(div, this.nextSibling);
						this.pausescroll_size = div;
					} else {
						this.parentNode.removeChild(this.pausescroll_size);
						delete this.pausescroll_size;
					}
				},
			},
			cixiongshuanggujian: {
				name: "雌雄双股剑优化",
				init: false,
			},
			zhishixian: {
				name: "拖拽指示线",
				intro: "设置卡牌拖拽指示线，使用前需先开启本体的拖拽指示线功能",
				init: false,
			},
			tiesuotexiao: {
				name: "铁索连环特效",
				init: "off",
				item: {
					off: "关闭",
					shousha: "手杀",
					shizhounian: "十周年",
					ol: "OL",
				},
			},
			oljinnangjuedoutexiao: {
				name: "OL锦囊-决斗特效",
				intro: "搬运自标记补充，使用【决斗】时播放OL锦囊决斗特效。",
				init: false,
			},
			wugu: {
				name: "五谷丰登框美化",
				init: false,
			},
			gainPlayerCard: {
				name: "顺牌框美化",
				init: false,
			},
			discardPlayerCard: {
				name: "拆牌框美化",
				init: false,
			},
			choosePlayerCard: {
				name: "选牌框美化",
				init: false,
			},
		},
		help: {},
		package: {
			intro: "武将美化功能补充",
			author: "",
			diskURL: "",
			forumURL: "",
			version: "1.0",
		},
		files: {
			character: [],
			card: [],
			skill: [],
			audio: [],
		},
	};
});
