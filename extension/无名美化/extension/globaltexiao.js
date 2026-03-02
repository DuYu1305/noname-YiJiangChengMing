import { lib, game, ui, get, ai, _status } from "../../../noname.js";
import { NewAnimation4 } from "../utils/NewAnimation4.js";

//来源/参考自 无名美化(作者@浴皇大帝)
//来源/参考自 琳琅满目(作者@柳下跖)
//来源/参考自 特效测试(作者@永远的萌新)
//来源/参考自 特效补充(作者@珂赛特@u佬)
//来源/参考自 标记补充(作者@西瓜)

export function globaltexiao() {
	// 游戏结束时，清除（酒、救我、铁索连环、连斩）特效，防止特效残留
	if (true) {
		game.wjmh_canliutexiao = function () {
			var targets = game.players.concat(game.dead);
			targets.forEach(function (player) {
				// 连斩特效
				if (player.texiao_lianzhan != undefined) {
					dcdAnim.stopSpine(player.texiao_lianzhan);
					player.texiao_lianzhan = undefined;
				}
				if (ui._OLMIHENGGU) {
					ui.anManagerCustZ.getAnimation("4.0").stopSpine(ui._OLMIHENGGU);
					ui._OLMIHENGGU = null;
				}
				if (ui._OLMIHENGBANG) {
					ui.anManagerCustZ.getAnimation("4.0").stopSpine(ui._OLMIHENGBANG);
					ui._OLMIHENGBANG = null;
				}
				if (ui._NISIWOHUO) {
					ui.anManagerCustZ.getAnimation("3.6").stopSpine(ui._NISIWOHUO);
					ui._NISIWOHUO = null;
				}
				if (ui._nswhBg) {
					document.body.removeChild(ui._nswhBg);
					ui._nswhBg = null;
				}
				if (player.texiao_lianzhan) {
					dcdAnim.stopSpine(player.texiao_lianzhan);
					player.texiao_lianzhan = undefined;
				}
				if (player._wjmh_jiubuff_) {
					dcdAnim.stopSpine(player._wjmh_jiubuff_);
					player._wjmh_jiubuff_ = undefined;
				}
			});
		};
		lib.skill._wjmh_texiaobugfix = {
			charlotte: true,
			forced: true,
			trigger: {
				global: "gameOver",
			},
			content: function () {
				game.wjmh_canliutexiao();
			},
		};
		lib.onover.push(function (bool) {
			// 如果 bool 为 true 那么 游戏胜利 如果 bool 为 false 那么 游戏失败 如果都不是 那么 游戏平局
			game.wjmh_canliutexiao();
		});
	}
	// 开战动画
	if (lib.config.extension_无名美化_kaizhan && lib.config.extension_无名美化_kaizhan != "off") {
		window._KAIZHAN = {
			// OL
			ol_kaizhannew: {
				name: "../../../无名美化/animation/globaltexiao/kaizhan/ol/kaizhannew",
				version: "4.0",
			},
			ol_kaizhannew2: {
				name: "../../../无名美化/animation/globaltexiao/kaizhan/ol/kaizhannew2",
				version: "4.0",
			},
			ol_kaizhannew3: {
				name: "../../../无名美化/animation/globaltexiao/kaizhan/ol/kaizhannew3",
				version: "4.0",
			},
			// 手杀
			shousha_play: {
				name: "../../../无名美化/animation/globaltexiao/kaizhan/shousha/youxikaishi/effect_youxikaishi_shousha",
			},
			shousha_play1: {
				name: "../../../无名美化/animation/globaltexiao/kaizhan/shousha/shoushakaizhan",
			},
			shousha_play2: {
				name: "../../../无名美化/animation/globaltexiao/kaizhan/shousha/shoushakaizhan",
			},
			shousha_play3: {
				name: "../../../无名美化/animation/globaltexiao/kaizhan/shousha/shoushakaizhan",
			},
			// 十周年
			shizhounian_youxikaishi: {
				name: "../../../无名美化/animation/globaltexiao/kaizhan/shizhounian/youxikaishi/effect_youxikaishi",
			},
			shizhounian_cheqijiangjun: {
				name: "../../../无名美化/animation/globaltexiao/kaizhan/shizhounian/SF_kaizhan_eff_cheqijiangjun",
			},
			shizhounian_dajiangjun: {
				name: "../../../无名美化/animation/globaltexiao/kaizhan/shizhounian/SF_kaizhan_eff_dajiangjun",
			},
			shizhounian_dasima: {
				name: "../../../无名美化/animation/globaltexiao/kaizhan/shizhounian/SF_kaizhan_eff_dasima",
			},
			shizhounian_jiangjun: {
				name: "../../../无名美化/animation/globaltexiao/kaizhan/shizhounian/SF_kaizhan_eff_jiangjun",
			},
			shizhounian_piaoqijiangjun: {
				name: "../../../无名美化/animation/globaltexiao/kaizhan/shizhounian/SF_kaizhan_eff_piaoqijiangjun",
			},
			shizhounian_putong: {
				name: "../../../无名美化/animation/globaltexiao/kaizhan/shizhounian/SF_kaizhan_eff_putong",
			},
			shizhounian_weijiangjun: {
				name: "../../../无名美化/animation/globaltexiao/kaizhan/shizhounian/SF_kaizhan_eff_weijiangjun",
			},
			// 其他
			other_play: {
				name: "../../../无名美化/animation/globaltexiao/kaizhan/other/dayuanshuai",
			},
			other_play2: {
				name: "../../../无名美化/animation/globaltexiao/kaizhan/other/dayuanshuai",
			},
			other_play3: {
				name: "../../../无名美化/animation/globaltexiao/kaizhan/other/dayuanshuai",
			},
		};
		//有时候会比十周年UI先加载了 配置就不生效了 加个宏任务延迟执行
		setTimeout(() => {
			lib.skill.mx_start = {
				priority: 114514,
				superChalotte: true,
				direct: true,
				silent: true,
				popup: false,
				trigger: {
					global: "gameDrawAfter",
				},
				filter: function (event, player) {
					return game.me == player;
				},
				content: function () {
					var [style, anim] = lib.config.extension_无名美化_kaizhan.split("|");
					var args;
					if (anim == "-1") {
						if (style == "ol") anim = ["kaizhannew", "kaizhannew2", "kaizhannew3"].randomGet();
						else if (style == "shousha") anim = ["play1", "play2", "play3"].randomGet();
						else if (style == "shizhounian") anim = ["putong", "jiangjun", "weijiangjun", "cheqijiangjun", "piaoqijiangjun", "dajiangjun", "dasima"].randomGet();
						else if (style == "other") anim = ["play", "play2", "play3"].randomGet();
					}
					if (style == "ol") {
						args = {
							scale: 0.7,
							speed: 1.0,
							x: [0, 0.5],
							y: [0, 0.6],
						};
					} else if (style == "shousha") {
						args = {
							scale: 0.75,
							speed: 1.2,
						};
						args["action"] = anim;
					} else if (style == "shizhounian") {
						args = {
							scale: 0.75,
							speed: 1.2,
						};
					} else if (style == "other") {
						args = {
							scale: 0.75,
							speed: 1.2,
						};
						args["action"] = anim;
					}
					game.playAudio("ext:无名美化/animation/globaltexiao/audio/kaizhan/gamestart.mp3");
					skinSwitch.chukuangWorkerApi.playEffect(
						{
							...window._KAIZHAN[style + "_" + anim],
							action: args["action"],
						},
						args
					);
					game.delay(1);
				},
			};
		}, 0);
	}
	// 游戏结算特效
	if (lib.config.extension_无名美化_gameovertexiao && lib.config.extension_无名美化_gameovertexiao != "off") {
		window._WJMHGAMEOVERTEXIAO = {
			// 十周年
			pingju: {
				name: "../../../无名美化/animation/globaltexiao/gameover/shizhounian/pingju",
			},
			shibai: {
				name: "../../../无名美化/animation/globaltexiao/gameover/shizhounian/shibai",
			},
			shengli: {
				name: "../../../无名美化/animation/globaltexiao/gameover/shizhounian/shengli",
			},
			Xnoshengli: {
				name: "../../../无名美化/animation/globaltexiao/gameover/shizhounian/Xnoshengli",
			},
			Xshengli: {
				name: "../../../无名美化/animation/globaltexiao/gameover/shizhounian/Xshengli",
			},
			SF_jiesuan_eff_fanzeishengli: {
				name: "../../../无名美化/animation/globaltexiao/gameover/shizhounian/SF_jiesuan_eff_fanzeishengli",
			},
			SF_jiesuan_eff_neijianshengli: {
				name: "../../../无名美化/animation/globaltexiao/gameover/shizhounian/SF_jiesuan_eff_neijianshengli",
			},
			SF_jiesuan_eff_zczgshengli: {
				name: "../../../无名美化/animation/globaltexiao/gameover/shizhounian/SF_jiesuan_eff_zczgshengli",
			},
			// 手杀
			XXpingju: {
				name: "../../../无名美化/animation/globaltexiao/gameover/shousha/XXpingju",
			},
			XXshibai: {
				name: "../../../无名美化/animation/globaltexiao/gameover/shousha/XXshibai",
			},
			XXshengli: {
				name: "../../../无名美化/animation/globaltexiao/gameover/shousha/XXshengli",
			},
		};
		function hanleGameRusltAn(bool) {
			return new Promise((resolve, reject) => {
				// ui.dialogs[0] && ui.dialogs[0].hide();
				var files = {
					shizhounian: {
						doudizhu: {
							pingju: function () {
								var args = {
									speed: 1,
									scale: 0.7,
									y: [300, 0],
									audio: true,
									tqload: true,
								};
								dcdAnim.loadSpine(window._WJMHGAMEOVERTEXIAO.Xnoshengli.name, "skel", function () {
									args["action"] = "play3";
									window.gotx = dcdAnim.playSpine(
										{
											...window._WJMHGAMEOVERTEXIAO.Xnoshengli,
											action: "play3",
										},
										args
									);
									window.gotx.oncomplete = () => {
										dcdAnim.stopSpine(window.gotx);
										window.gotx = undefined;
										resolve();
									};
								});
							},
							shibai: function () {
								var args = {
									speed: 1,
									scale: 0.7,
									y: [300, 0],
									audio: true,
									tqload: true,
								};
								dcdAnim.loadSpine(window._WJMHGAMEOVERTEXIAO.Xnoshengli.name, "skel", function () {
									args["action"] = "play";
									window.gotx = dcdAnim.playSpine(window._WJMHGAMEOVERTEXIAO.Xnoshengli, args);
									window.gotx.oncomplete = () => {
										dcdAnim.stopSpine(window.gotx);
										window.gotx = undefined;
										resolve();
									};
								});
							},
							shengli: function () {
								var args = {
									speed: 1,
									scale: 0.7,
									y: [300, 0],
									audio: true,
									tqload: true,
								};
								dcdAnim.loadSpine(window._WJMHGAMEOVERTEXIAO.Xshengli.name, "skel", function () {
									args["action"] = "play";
									window.gotx = dcdAnim.playSpine(window._WJMHGAMEOVERTEXIAO.Xshengli, args);
									window.gotx.oncomplete = () => {
										dcdAnim.stopSpine(window.gotx);
										window.gotx = undefined;
										resolve();
									};
								});
							},
						},
						default: {
							pingju: function () {
								var args = {
									speed: 1,
									scale: 0.7,
									y: [-30, 0],
									audio: true,
								};
								dcdAnim.loadSpine(window._WJMHGAMEOVERTEXIAO.pingju.name, "skel", function () {
									args["action"] = "play";
									window.gotx = dcdAnim.playSpine(window._WJMHGAMEOVERTEXIAO.pingju, args);
									window.gotx.oncomplete = () => {
										dcdAnim.stopSpine(window.gotx);
										window.gotx = undefined;
										resolve();
									};
								});
							},
							shibai: function () {
								var args = {
									speed: 1,
									scale: 0.7,
									y: [-30, 0],
									audio: true,
								};
								dcdAnim.loadSpine(window._WJMHGAMEOVERTEXIAO.shibai.name, "skel", function () {
									args["action"] = "play";
									window.gotx = dcdAnim.playSpine(window._WJMHGAMEOVERTEXIAO.shibai, args);
									window.gotx.oncomplete = () => {
										dcdAnim.stopSpine(window.gotx);
										window.gotx = undefined;
										resolve();
									};
								});
							},
							shengli: function () {
								var args = {
									speed: 1,
									scale: 0.7,
									y: [-30, 0],
									audio: true,
								};
								var name = "shengli";
								var action = "play";
								var time = 2600;
								if (get.mode() == "identity") {
									switch (game.me.identity) {
										case "zhu": {
											name = "SF_jiesuan_eff_zczgshengli";
											action = "play3";
											time = 2700;
											args["y"] = [0, 0.5];
											break;
										}
										case "zhong": {
											name = "SF_jiesuan_eff_zczgshengli";
											time = 2700;
											args["y"] = [0, 0.5];
											break;
										}
										case "fan": {
											name = "SF_jiesuan_eff_fanzeishengli";
											time = 2700;
											args["y"] = [0, 0.5];
											break;
										}
										case "nei": {
											name = "SF_jiesuan_eff_neijianshengli";
											time = 2700;
											args["y"] = [0, 0.5];
											break;
										}
									}
								}
								dcdAnim.loadSpine(window._WJMHGAMEOVERTEXIAO[name].name, "skel", function () {
									args["action"] = action;
									window.gotx = dcdAnim.playSpine(
										{
											...window._WJMHGAMEOVERTEXIAO[name],
											action,
										},
										args
									);
									window.gotx.oncomplete = () => {
										dcdAnim.stopSpine(window.gotx);
										window.gotx = undefined;
										resolve();
									};
								});
							},
						},
					},
					shousha: {
						default: {
							pingju: function () {
								var args = {
									speed: 0.5,
									scale: 1,
									y: [300, 0],
									audio: true,
								};
								dcdAnim.loadSpine(window._WJMHGAMEOVERTEXIAO.XXpingju.name, "skel", function () {
									args["action"] = "jiesuan_pingju";
									window.gotx = dcdAnim.playSpine(
										{
											...window._WJMHGAMEOVERTEXIAO.XXpingju,
											action: "jiesuan_pingju",
										},
										args
									);
									window.gotx.oncomplete = () => {
										dcdAnim.stopSpine(window.gotx);
										window.gotx = undefined;
										resolve();
									};
								});
							},
							shibai: function () {
								var args = {
									speed: 0.5,
									scale: 2,
									y: [300, 0],
									audio: true,
								};
								dcdAnim.loadSpine(window._WJMHGAMEOVERTEXIAO.XXshibai.name, "skel", function () {
									args["action"] = "animation";
									window.gotx = dcdAnim.playSpine(
										{
											...window._WJMHGAMEOVERTEXIAO.XXshibai,
											action: "animation",
										},
										args
									);
									window.gotx.oncomplete = () => {
										dcdAnim.stopSpine(window.gotx);
										window.gotx = undefined;
										resolve();
									};
								});
							},
							shengli: function () {
								var args = {
									speed: 0.5,
									scale: 3,
									x: [400, 0],
									y: [140, 0],
									audio: true,
								};
								dcdAnim.loadSpine(window._WJMHGAMEOVERTEXIAO.XXshengli.name, "skel", function () {
									args["action"] = "animation";
									window.gotx = dcdAnim.playSpine(
										{
											...window._WJMHGAMEOVERTEXIAO.XXshengli,
											action: "animation",
										},
										args
									);
									window.gotx.oncomplete = () => {
										dcdAnim.stopSpine(window.gotx);
										window.gotx = undefined;
										resolve();
									};
								});
							},
						},
					},
				};
				// 如果 bool 为 true 那么 游戏胜利 如果 bool 为 false 那么 游戏失败 如果都不是 那么 游戏平局
				var result = "pingju";
				if (bool == true) result = "shengli";
				else if (bool == false) result = "shibai";
				var type = lib.config.extension_无名美化_gameovertexiao;
				var mode = get.mode();
				if (!(mode in files[type])) mode = "default";
				files[type][mode][result]();
			});
		}
		//调用一将的函数 在排位动画之前执行
		if (window._pushYjcmJsFn) {
			window._pushYjcmJsFn({
				index: 103,
				fn: hanleGameRusltAn,
			});
		} else {
			lib.onover.push(hanleGameRusltAn);
		}
	}
	// 连斩武将冒火特效
	if (lib.config.extension_无名美化_lianzhantexiao && lib.config.extension_无名美化_lianzhantexiao != "off" && get.mode() != "taixuhuanjing") {
		window._WJMHLIANZHANTEXIAO = {
			shizhounian: {
				SF_eff_lianzhan_m_lv2: {
					name: "../../../无名美化/animation/globaltexiao/lianzhan/shizhounian/SF_eff_lianzhan_m_lv2",
				}, // 二连斩特效
				SF_eff_lianzhan_m_lv4: {
					name: "../../../无名美化/animation/globaltexiao/lianzhan/shizhounian/SF_eff_lianzhan_m_lv4",
				}, // 四连斩特效
				SF_eff_lianzhan_m_lv6: {
					name: "../../../无名美化/animation/globaltexiao/lianzhan/shizhounian/SF_eff_lianzhan_m_lv6",
				}, // 六连斩特效
			},
			shizhounian2: {
				SF_eff_lianzhan_m_lv2: {
					name: "../../../无名美化/animation/globaltexiao/lianzhan/shizhounian2/SF_eff_lianzhan_m_lv2",
				}, // 二连斩特效
				SF_eff_lianzhan_m_lv4: {
					name: "../../../无名美化/animation/globaltexiao/lianzhan/shizhounian2/SF_eff_lianzhan_m_lv4",
				}, // 四连斩特效
				SF_eff_lianzhan_m_lv6: {
					name: "../../../无名美化/animation/globaltexiao/lianzhan/shizhounian2/SF_eff_lianzhan_m_lv6",
				}, // 六连斩特效
			},
		};
		// 连斩开始
		lib.skill._wjmh_lianzhan_kaishi_ = {
			priority: 2022,
			charlotte: true,
			forced: true,
			silent: true,
			trigger: {
				source: "dieBegin",
			},
			content: function () {
				if (!player.storage.texiao_lianzhan) player.storage.texiao_lianzhan = 0;
				player.storage.texiao_lianzhan++;

				var name = lib.config.extension_无名美化_lianzhantexiao;
				if (["shizhounian", "shizhounian2"].includes(name)) {
					var args = {
						scale: 0.8,
						x: [0, 0.45],
						parent: player,
					};
					if (name == "shizhounian2") {
						args["y"] = [0, 0.55];
					}
					// 二连
					if (player.storage.texiao_lianzhan == 2) {
						if (player.texiao_lianzhan != undefined) {
							dcdAnim.stopSpine(player.texiao_lianzhan);
							player.texiao_lianzhan = undefined;
						}
						window._WJMHLIANZHANTEXIAO[name].SF_eff_lianzhan_m_lv2.loop = true;
						dcdAnim.loadSpine(window._WJMHLIANZHANTEXIAO[name].SF_eff_lianzhan_m_lv2.name, "skel", function () {
							player.texiao_lianzhan = dcdAnim.playSpine(window._WJMHLIANZHANTEXIAO[name].SF_eff_lianzhan_m_lv2, args);
						});
					}
					// 四连
					if (player.storage.texiao_lianzhan == 4) {
						if (player.texiao_lianzhan != undefined) {
							dcdAnim.stopSpine(player.texiao_lianzhan);
							player.texiao_lianzhan = undefined;
						}
						window._WJMHLIANZHANTEXIAO[name].SF_eff_lianzhan_m_lv4.loop = true;
						dcdAnim.loadSpine(window._WJMHLIANZHANTEXIAO[name].SF_eff_lianzhan_m_lv4.name, "skel", function () {
							player.texiao_lianzhan = dcdAnim.playSpine(window._WJMHLIANZHANTEXIAO[name].SF_eff_lianzhan_m_lv4, args);
						});
					}
					// 六连
					if (player.storage.texiao_lianzhan == 6) {
						if (player.texiao_lianzhan != undefined) {
							dcdAnim.stopSpine(player.texiao_lianzhan);
							player.texiao_lianzhan = undefined;
						}
						window._WJMHLIANZHANTEXIAO[name].SF_eff_lianzhan_m_lv6.loop = true;
						dcdAnim.loadSpine(window._WJMHLIANZHANTEXIAO[name].SF_eff_lianzhan_m_lv6.name, "skel", function () {
							player.texiao_lianzhan = dcdAnim.playSpine(window._WJMHLIANZHANTEXIAO[name].SF_eff_lianzhan_m_lv6, args);
						});
					}
				}
				// game.delay(4.2);
			},
		};
		// 连斩消失
		lib.skill._wjmh_lianzhan_xiaoshi_ = {
			priority: 20,
			charlotte: true,
			forced: true,
			popup: false,
			firstDo: true,
			forceDie: true,
			audio: false,
			trigger: {
				player: ["die", "dieAfter"],
				global: ["phaseAfter"],
			},
			content: function () {
				if (player.storage.texiao_lianzhan != undefined) {
					player.storage.texiao_lianzhan = undefined;
					delete player.storage.texiao_lianzhan;
				}
				if (player.texiao_lianzhan != undefined) {
					dcdAnim.stopSpine(player.texiao_lianzhan);
					player.texiao_lianzhan = undefined;
				}
			},
		};
	}
	// 连杀特效
	if (lib.config.extension_无名美化_liansha && lib.config.extension_无名美化_liansha != "off") {
		window._WJMHLIANSHATEXIAO = {
			// OL
			// 连破
			kill_1: {
				name: "../../../无名美化/animation/globaltexiao/liansha/ol/animation/OL_PaiJu_BaoDian_YXPJ",
				json: true,
			},
			kill_2: {
				name: "../../../无名美化/animation/globaltexiao/liansha/ol/animation/OL_PaiJu_BaoDian_ELSXPM",
				json: true,
			},
			kill_3: {
				name: "../../../无名美化/animation/globaltexiao/liansha/ol/animation/OL_PaiJu_BaoDian_SLSBKD",
				json: true,
			},
			kill_4: {
				name: "../../../无名美化/animation/globaltexiao/liansha/ol/animation/silian",
				json: true,
			},
			kill_5: {
				name: "../../../无名美化/animation/globaltexiao/liansha/ol/animation/wulian",
				json: true,
			},
			kill_6: {
				name: "../../../无名美化/animation/globaltexiao/liansha/ol/animation/liulian",
				json: true,
			},
			kill_7: {
				name: "../../../无名美化/animation/globaltexiao/liansha/ol/animation/OL_PaiJu_BaoDian_QLHTMD",
				json: true,
			},
			// 手杀
			// 特殊
			diankuangtulu: {
				name: "../../../无名美化/animation/globaltexiao/liansha/shousha/animation/diankuangtulu",
			},
			wanjunqushou: {
				name: "../../../无名美化/animation/globaltexiao/liansha/shousha/animation/wanjunqushou",
			},
			// 连破
			shoushajisha: {
				name: "../../../无名美化/animation/globaltexiao/liansha/shousha/animation/shoushajisha",
			},
			// 十周年
			// 特殊
			SF_pojun_eff_hit: {
				name: "../../../无名美化/animation/globaltexiao/liansha/shizhounian/animation/SF_pojun_eff_hit",
			},
			wanfumodi: {
				name: "../../../无名美化/animation/globaltexiao/liansha/shizhounian/animation/wanfumodi",
			},
			shenweizhengqiankun: {
				name: "../../../无名美化/animation/globaltexiao/liansha/shizhounian/animation/shenweizhengqiankun",
			},
			// 连破
			shoupo: {
				name: "../../../无名美化/animation/globaltexiao/liansha/shizhounian/animation/shoupo",
			},
			lianpo: {
				name: "../../../无名美化/animation/globaltexiao/liansha/shizhounian/animation/lianpo",
			},
			sanpo: {
				name: "../../../无名美化/animation/globaltexiao/liansha/shizhounian/animation/sanpo",
			},
			sipo: {
				name: "../../../无名美化/animation/globaltexiao/liansha/shizhounian/animation/sipo",
			},
			wupo: {
				name: "../../../无名美化/animation/globaltexiao/liansha/shizhounian/animation/wupo",
			},
			liupo: {
				name: "../../../无名美化/animation/globaltexiao/liansha/shizhounian/animation/liupo",
			},
			qipo: {
				name: "../../../无名美化/animation/globaltexiao/liansha/shizhounian/animation/qipo",
			},
			// 连斩
			erlianzhan: {
				name: "../../../无名美化/animation/globaltexiao/liansha/shizhounian/animation/erlianzhan",
			},
			sanlianzhan: {
				name: "../../../无名美化/animation/globaltexiao/liansha/shizhounian/animation/sanlianzhan",
			},
			silianzhan: {
				name: "../../../无名美化/animation/globaltexiao/liansha/shizhounian/animation/silianzhan",
			},
			wulianzhan: {
				name: "../../../无名美化/animation/globaltexiao/liansha/shizhounian/animation/wulianzhan",
			},
			liulianzhan: {
				name: "../../../无名美化/animation/globaltexiao/liansha/shizhounian/animation/liulianzhan",
			},
			qilianzhan: {
				name: "../../../无名美化/animation/globaltexiao/liansha/shizhounian/animation/qilianzhan",
			},
		};
		lib.skill.decadeUI_dieKillEffect = {
			priority: 2024,
			charlotte: true,
			forced: true,
			silent: true,
			trigger: {
				source: "dieBegin",
			},
			content: function () {
				if (trigger._wjmh_lianshaPlayed) return;
				trigger._wjmh_lianshaPlayed = true;
				//player.phaseNumber
				var val = null;
				var lianshaName = "texiao_liansha";
				if (lib.config.extension_无名美化_lianshaType == "round") {
					lianshaName += player.phaseNumber;
				}
				if (!player.storage[lianshaName]) player.storage[lianshaName] = 0;
				player.storage[lianshaName]++;
				player.storage[lianshaName] = Math.min(player.storage[lianshaName], 7);
				val = player.storage[lianshaName];
				console.log("lianshaName", lianshaName);
				console.log("val", val);

				//一破只播放一次
				/*if (val == 1) {
					if (!game.wmmh_yp) {
						game.wmmh_yp = true;
					} else {
						return;
					}
				}*/
				if (lib.config.extension_无名美化_liansha == "shousha") {
					var files = {
						audio: {
							1: "yipo",
							2: "shuanglian",
							3: "sanlian",
							4: "silian",
							5: "wulian",
							6: "liulian",
							7: "qilian",
						},
						action: {
							1: "yipo",
							2: "shuanglian",
							3: "sanlian",
							4: "silian",
							5: "wulian",
							6: "liulian",
							7: "qilian",
						},
					};
					if ([1, 2, 3, 4, 5, 6, 7].includes(val)) {
						if (val in files["audio"]) {
							game.playAudio(`../extension/无名美化/animation/globaltexiao/liansha/shousha/audio/${files["audio"][val]}.mp3`);
						}
						if (val in files["action"]) {
							dcdAnim.loadSpine(window._WJMHLIANSHATEXIAO.shoushajisha.name, "skel", function () {
								dcdAnim.playSpine(
									{
										...window._WJMHLIANSHATEXIAO.shoushajisha,
										action: files["action"][val],
									},
									{
										scale: 0.8,
										speed: 1.3,
									}
								);
							});
						}
						game.delay(4);
					}
				} else if (lib.config.extension_无名美化_liansha == "shizhounian") {
					var files = {
						audio: {
							1: "shoupo",
							2: "lianpo",
							3: "sanpo",
							4: "sipo",
							5: "wupo",
							6: "liupo",
							7: "qipo",
						},
						lianpo: {
							1: "shoupo",
							2: "lianpo",
							3: "sanpo",
							4: "sipo",
							5: "wupo",
							6: "liupo",
							7: "qipo",
						},
						lianzhan: {
							// 1: null,
							2: "erlianzhan",
							3: "sanlianzhan",
							4: "silianzhan",
							5: "wulianzhan",
							6: "liulianzhan",
							7: "qilianzhan",
						},
					};
					if ([1, 2, 3, 4, 5, 6, 7].includes(val)) {
						if (val in files["audio"]) {
							game.playAudio(`../extension/无名美化/animation/globaltexiao/liansha/shizhounian/audio/${files["audio"][val]}.mp3`);
						}
						if (val in files["lianpo"]) {
							dcdAnim.loadSpine(window._WJMHLIANSHATEXIAO[files["lianpo"][val]].name, "skel", function () {
								dcdAnim.playSpine(
									{
										...window._WJMHLIANSHATEXIAO[files["lianpo"][val]],
										action: "play",
									},
									{
										scale: 0.8,
										speed: 1,
									}
								);
							});
						}
						/*setTimeout(() => {
							game.playAudio("../extension/无名美化/animation/globaltexiao/liansha/shizhounian/audio/jisha.mp3");
						}, 1900);*/
						if (val in files["lianzhan"]) {
							dcdAnim.loadSpine(window._WJMHLIANSHATEXIAO[files["lianzhan"][val]].name, "skel", function () {
								dcdAnim.playSpine(window._WJMHLIANSHATEXIAO[files["lianzhan"][val]], {
									speed: 0.8,
									scale: 0.7,
									parent: player,
								});
							});
						}
						game.delay(4);
					}
				} else if (lib.config.extension_无名美化_liansha == "ol") {
					var files = {
						audio: {
							1: "kill_1",
							2: "kill_2",
							3: "kill_3",
							4: "kill_4",
							5: "kill_5",
							6: "kill_6",
							7: "kill_7",
						},
						lianpo: {
							1: "kill_1",
							2: "kill_2",
							3: "kill_3",
							4: "kill_4",
							5: "kill_5",
							6: "kill_6",
							7: "kill_7",
						},
					};
					if ([1, 2, 3, 4, 5, 6, 7].includes(val)) {
						if (val in files["audio"]) {
							game.playAudio(`../extension/无名美化/animation/globaltexiao/liansha/ol/audio/${files["audio"][val]}.mp3`);
						}
						if (val in files["lianpo"]) {
							skinSwitch.chukuangWorkerApi.playEffect(window._WJMHLIANSHATEXIAO[files["lianpo"][val]], {
								speed: 1,
								scale: 1,
							});
						}
						game.delay(4);
					}
				}
			},
		};
		lib.skill._wjmh_liansha_buchong_ = {
			charlotte: true,
			forced: true,
			silent: true,
			trigger: {
				source: "damageBegin4",
			},
			filter: function (event, player) {
				return event.num > 1;
			},
			async content(event, trigger, player) {
				let dtime = 500;
				if (lib.config.extension_无名美化_liansha == "shousha") {
					if (trigger.num == 3) {
						// 癫狂屠戮
						dcdAnim.loadSpine(window._WJMHLIANSHATEXIAO.diankuangtulu.name, "skel", function () {
							dcdAnim.playSpine(window._WJMHLIANSHATEXIAO.diankuangtulu, {
								scale: 0.5,
								speed: 1,
							});
						});
						game.playAudio("../extension/无名美化/animation/globaltexiao/liansha/shousha/audio/diankuangtulu.mp3");
					} else if (trigger.num >= 4) {
						// 万军取首
						dcdAnim.loadSpine(window._WJMHLIANSHATEXIAO.wanjunqushou.name, "skel", function () {
							dcdAnim.playSpine(window._WJMHLIANSHATEXIAO.wanjunqushou, {
								scale: 0.75,
								speed: 1,
								y: [0, 0.5],
							});
						});
						game.playAudio("../extension/无名美化/animation/globaltexiao/liansha/shousha/audio/wanjunqushou.mp3");
					}
					await game.delay(0, dtime);
				} else if (lib.config.extension_无名美化_liansha == "shizhounian") {
					if (trigger.num > 1 && trigger.player) {
						// 暴击
						dcdAnim.loadSpine(window._WJMHLIANSHATEXIAO.SF_pojun_eff_hit.name, "skel", function () {
							dcdAnim.playSpine(window._WJMHLIANSHATEXIAO.SF_pojun_eff_hit, {
								scale: 0.75,
								speed: 0.8,
								parent: trigger.player,
							});
						});
					}
					if (trigger.num == 3) {
						// 万夫莫敌
						dcdAnim.loadSpine(window._WJMHLIANSHATEXIAO.wanfumodi.name, "skel", function () {
							dcdAnim.playSpine(window._WJMHLIANSHATEXIAO.wanfumodi, {
								scale: 0.75,
								speed: 0.8,
							});
						});
						game.playAudio("../extension/无名美化/animation/globaltexiao/liansha/shizhounian/audio/wanfumodi.mp3");
						await game.delay(0, dtime);
					} else if (trigger.num >= 4) {
						// 神威镇乾坤
						dcdAnim.loadSpine(window._WJMHLIANSHATEXIAO.shenweizhengqiankun.name, "skel", function () {
							dcdAnim.playSpine(window._WJMHLIANSHATEXIAO.shenweizhengqiankun, {
								scale: 0.75,
								speed: 0.8,
							});
						});
						game.playAudio("../extension/无名美化/animation/globaltexiao/liansha/shizhounian/audio/shenweizhengqiankun.mp3");
						await game.delay(0, dtime);
					}
				}
			},
		};
	}
	// 连救特效
	if (lib.config.extension_无名美化_lianjiu && lib.config.extension_无名美化_lianjiu != "off") {
		window._WJMHLIANJIUTEXIAO = {
			// 手杀
			miaoshouhuichun: {
				name: "../../../无名美化/animation/globaltexiao/lianjiu/shousha/animation/miaoshouhuichun",
			},
			yishugaochao: {
				name: "../../../无名美化/animation/globaltexiao/lianjiu/shousha/animation/yishugaochao",
			},
			// 十周年
			shenyimiaoshou: {
				name: "../../../无名美化/animation/globaltexiao/lianjiu/shizhounian/animation/shenyimiaoshou",
			},
			qingnangjishi: {
				name: "../../../无名美化/animation/globaltexiao/lianjiu/shizhounian/animation/qingnangjishi",
			},
		};
		lib.skill._wjmh_lianjiu_kaishi_ = {
			priority: 2022,
			charlotte: true,
			forced: true,
			silent: true,
			trigger: {
				player: "recoverEnd",
			},
			content: function () {
				var files = {
					shousha: {
						zi: "miaoshouhuichun",
						ai: "yishugaochao",
					},
					shizhounian: {
						zi: "shenyimiaoshou",
						ai: "qingnangjishi",
					},
				};
				var type = lib.config.extension_无名美化_lianjiu;
				var target = trigger.source;
				if (target == player) {
					if (_status.currentPhase == player) {
						if (!player.storage.texiao_zilianjiu) player.storage.texiao_zilianjiu = 0;
						var bool = player.storage.texiao_zilianjiu >= 3;
						player.storage.texiao_zilianjiu = player.storage.texiao_zilianjiu + trigger.num;
						if (!bool && player.storage.texiao_zilianjiu >= 3) {
							while (player.storage.texiao_zilianjiu >= 3) {
								player.storage.texiao_zilianjiu = player.storage.texiao_zilianjiu - 3;
							}
							dcdAnim.loadSpine(window._WJMHLIANJIUTEXIAO[files[type]["zi"]].name, "skel", function () {
								dcdAnim.playSpine(window._WJMHLIANJIUTEXIAO[files[type]["zi"]], {
									scale: 0.8,
									speed: 1,
								});
							});
							game.playAudio(`../extension/无名美化/animation/globaltexiao/lianjiu/${type}/audio/${[files[type]["zi"]]}.mp3`);
							game.delay(3);
						}
						player.when({ player: ["phaseEnd"] }).then(() => {
							delete player.storage.texiao_zilianjiu;
						});
					}
				} else if (target && trigger.num >= player.hp && player.hp > 0) {
					if (!target.storage.texiao_ailianjiu) target.storage.texiao_ailianjiu = 0;
					var bool = target.storage.texiao_ailianjiu >= 3;
					target.storage.texiao_ailianjiu++;
					if (!bool && target.storage.texiao_ailianjiu >= 3) {
						while (target.storage.texiao_ailianjiu >= 3) {
							target.storage.texiao_ailianjiu = target.storage.texiao_ailianjiu - 3;
						}
						dcdAnim.loadSpine(window._WJMHLIANJIUTEXIAO[files[type]["ai"]].name, "skel", function () {
							dcdAnim.playSpine(window._WJMHLIANJIUTEXIAO[files[type]["ai"]], {
								scale: 0.8,
								speed: 1,
							});
						});
						game.playAudio(`../extension/无名美化/animation/globaltexiao/lianjiu/${type}/audio/${[files[type]["ai"]]}.mp3`);
						game.delay(3);
					}
					target.when({ global: ["roundStart"] }).then(() => {
						delete player.storage.texiao_ailianjiu;
					});
				}
			},
		};
	}
	// if (lib.config.extension_无名美化_jinengfadong) {
	// 	window._WMMHEFFECT = {
	// 		wei_1: "../../../无名美化/animation/globaltexiao/jinengfadong/SF_jinengfadong_eff_fangyugaoji",
	// 		wei_2: "../../../无名美化/animation/globaltexiao/jinengfadong/SF_jinengfadong_eff_fumiangaoji",
	// 		shu_1: "../../../无名美化/animation/globaltexiao/jinengfadong/SF_jinengfadong_eff_gongjigaoji",
	// 		shu_2: "../../../无名美化/animation/globaltexiao/jinengfadong/SF_jinengfadong_eff_baofagaoji",
	// 		wu_1: "../../../无名美化/animation/globaltexiao/jinengfadong/SF_jinengfadong_eff_fuzhugaoji",
	// 		wu_2: "../../../无名美化/animation/globaltexiao/jinengfadong/SF_jinengfadong_eff_kongzhigaoji",
	// 		other_1: "../../../无名美化/animation/globaltexiao/jinengfadong/SF_jinengfadong_eff_zhongxinggaoji",
	// 		other_2: "../../../无名美化/animation/globaltexiao/jinengfadong/SF_jinengfadong_eff_maixuegaoji",
	// 	};
	// 	lib.skill._useskill = {
	// 		trigger: {
	// 			player: "logSkillBegin",
	// 		},
	// 		filter(event, player, name) {
	// 			if (!game.hasExtension("十周年UI")) return false;
	// 			if (!get.info(event.skill) || !get.skillInfoTranslation(event.skill, player)) return false;
	// 			return true;
	// 		},
	// 		direct: true,
	// 		popup: false,
	// 		silent: true,
	// 		priority: 114514,
	// 		superChalotte: true,
	// 		content() {
	// 			let skills = player.getSkills(null, false, false);
	// 			let name = (["wei", "shu", "wu"].includes(player.group) ? player.group : "other") + "_" + (trigger.skill == skills[0] ? 1 : 2);
	// 			dcdAnim.loadSpine(window._WMMHEFFECT[name], "skel", function () {
	// 				dcdAnim.playSpine({ name: window._WMMHEFFECT[name], speed: 1.3 }, { scale: 0.7, parent: player, referFollow: true });
	// 			});
	// 		},
	// 	};
	// }
	// 卡牌命中
	if (lib.config.extension_无名美化_kapaishiyong && lib.config.extension_无名美化_kapaishiyong != "off") {
		window._WJMHKAPAISHIYONGTEXIAO = {
			aar_longxingzhixiang: {
				name: "../../../无名美化/animation/globaltexiao/kapaishiyong/aar_longxingzhixiang",
			},
		};
		lib.skill._wjmh_kapaishiyong_ = {
			priority: 100,
			charlotte: true,
			forced: true,
			popup: false,
			audio: false,
			firstDo: true,
			trigger: {
				player: "useCardBegin",
			},
			filter: function (event, player) {
				if (lib.config.extension_无名美化_kapaishiyong == "damage") {
					if (get.tag(event.card, "damage")) return true;
				} else if (lib.config.extension_无名美化_kapaishiyong == "-1") {
					return true;
				}
				return false;
			},
			content: function () {
				if (player != game.me) {
					dcdAnim.loadSpine(window._WJMHKAPAISHIYONGTEXIAO.aar_longxingzhixiang.name, "skel", function () {
						dcdAnim.playSpine(window._WJMHKAPAISHIYONGTEXIAO.aar_longxingzhixiang, {
							speed: 0.5,
							scale: 0.6,
							parent: player,
						});
					});
				}
				if (player == game.me) {
					dcdAnim.loadSpine(window._WJMHKAPAISHIYONGTEXIAO.aar_longxingzhixiang.name, "skel", function () {
						dcdAnim.playSpine(window._WJMHKAPAISHIYONGTEXIAO.aar_longxingzhixiang, {
							speed: 0.4,
							scale: 0.6,
							y: [0, 0.3],
						});
					});
				}
				//这个效果是绑定卡牌的还是啥？没见过预留吧 下面这个方法是绑卡牌上的
				// dcdAnim.loadSpine(window._WJMHKAPAISHIYONGTEXIAO.aar_longxingzhixiang.name, "skel", function () {
				// 	dcdAnim.playSpine(window._WJMHKAPAISHIYONGTEXIAO.aar_longxingzhixiang, {
				// 		speed: 0.4,
				// 		scale: 0.6,
				// 		parent:trigger.card,
				// 		referFollow: true,
				// 	});
				// });
			},
		};
	}

	// 免伤特效
	if (lib.config.extension_无名美化_mianshangtexiao) {
		window._WJMHMIANSHANGTEXIAO = {
			mianshang: {
				name: "../../../无名美化/animation/globaltexiao/mianshang/mianshang",
			},
		};
		lib.skill._wmmh_mianshang_ = {
			forced: true,
			trigger: {
				player: ["damageZero", "damageCancelled"],
			},
			content: function () {
				dcdAnim.loadSpine(window._WJMHMIANSHANGTEXIAO.mianshang.name, "skel", function () {
					dcdAnim.playSpine(window._WJMHMIANSHANGTEXIAO.mianshang, {
						scale: 0.75,
						parent: player,
					});
				});
			},
		};
	}
	// 目标特效
	// if (lib.config.extension_无名美化_mubiaotexiao && lib.config.extension_无名美化_mubiaotexiao != "off") {
	// 	window._MUBIAOZHISHI = {
	// 		// 十周年
	// 		SF_xuanzhong_eff_weijiangjun: {
	// 			name: "../../../无名美化/animation/globaltexiao/mubiaotexiao/shizhounian/SF_xuanzhong_eff_weijiangjun",
	// 			loop: true,
	// 		},
	// 		SF_xuanzhong_eff_jiangjun: {
	// 			name: "../../../无名美化/animation/globaltexiao/mubiaotexiao/shizhounian/SF_xuanzhong_eff_jiangjun",
	// 			loop: true,
	// 		},
	// 		SF_xuanzhong_eff_dasima: {
	// 			name: "../../../无名美化/animation/globaltexiao/mubiaotexiao/shizhounian/SF_xuanzhong_eff_dasima",
	// 			loop: true,
	// 		},
	// 		SF_xuanzhong_eff_dajiangjun: {
	// 			name: "../../../无名美化/animation/globaltexiao/mubiaotexiao/shizhounian/SF_xuanzhong_eff_dajiangjun",
	// 			loop: true,
	// 		},
	// 		SF_xuanzhong_eff_cheqijiangjun: {
	// 			name: "../../../无名美化/animation/globaltexiao/mubiaotexiao/shizhounian/SF_xuanzhong_eff_cheqijiangjun",
	// 			loop: true,
	// 		},
	// 		SF_xuanzhong_eff_biaoqijiangjun: {
	// 			name: "../../../无名美化/animation/globaltexiao/mubiaotexiao/shizhounian/SF_xuanzhong_eff_biaoqijiangjun",
	// 			loop: true,
	// 		},
	// 		// 手杀
	// 		aar_chupaizhishi: {
	// 			name: "../../../无名美化/animation/globaltexiao/mubiaotexiao//shousha/aar_chupaizhishi",
	// 			loop: true,
	// 		},
	// 		// aar_chupaizhishiX: {
	// 		//     name: "../../../无名美化/animation/globaltexiao/mubiaotexiao/shousha/aar_chupaizhishiX",
	// 		//     loop: true,
	// 		// },
	// 	};
	// 	let val = lib.config.extension_无名美化_mubiaotexiao;
	// 	let gp = val.split("|");
	// 	if (gp[0] == "shizhounian") {
	// 		//随机的全部预加载
	// 		if (gp[1] == "-1") {
	// 			Object.keys(window._MUBIAOZHISHI).forEach(key => {
	// 				dcdAnim.loadSpine(window._MUBIAOZHISHI[key].name, "skel", function () {
	// 					dcdAnim.prepSpine(window._MUBIAOZHISHI[key].name);
	// 				});
	// 			});
	// 		} else {
	// 			dcdAnim.loadSpine(window._MUBIAOZHISHI["SF_xuanzhong_eff_" + gp[1]].name, "skel", function () {
	// 				dcdAnim.prepSpine(window._MUBIAOZHISHI["SF_xuanzhong_eff_" + gp[1]].name);
	// 			});
	// 		}
	// 	} else {
	// 		dcdAnim.loadSpine(window._MUBIAOZHISHI["aar_" + gp[1]].name, "skel", function () {
	// 			dcdAnim.prepSpine(window._MUBIAOZHISHI["aar_" + gp[1]].name);
	// 		});
	// 	}

	// 	lib.element.player.inits = [].concat(lib.element.player.inits || []).concat(player => {
	// 		if (player.mubiaozhishiObserver) return;
	// 		const mubiaozhishi = {
	// 			attributes: true,
	// 			attributeFilter: ["class"],
	// 		};
	// 		let timer = null;
	// 		const mubiaozhishiObserver = new globalThis.MutationObserver(mutationRecords => {
	// 			for (let mutationRecord of mutationRecords) {
	// 				if (mutationRecord.attributeName !== "class") continue;
	// 				const targetElement = mutationRecord.target;
	// 				if (targetElement.classList.contains("selectable")) {
	// 					if (!targetElement.mubiaozhishiid) {
	// 						if (!window.chupaiload) {
	// 							window.chupaiload = true;
	// 						}
	// 						if (timer) return;
	// 						timer = setTimeout(() => {
	// 							function playMubiaozhishi(type, name) {
	// 								if (type == "shizhounian") {
	// 									var args = {
	// 										parent: targetElement,
	// 										scale: 0.7,
	// 										loop: true,
	// 										referFollow: true,
	// 									};
	// 									if (name == "biaoqijiangjun") args.scale = 0.5;
	// 									// dcdAnim.loadSpine(window._MUBIAOZHISHI["SF_xuanzhong_eff_" + name].name, "skel", function () {
	// 									targetElement.mubiaozhishiid = dcdAnim.playSpine(window._MUBIAOZHISHI["SF_xuanzhong_eff_" + name], args);
	// 									// });
	// 								} else if (type == "shousha") {
	// 									var args = {
	// 										parent: targetElement,
	// 										scale: 0.7,
	// 										loop: true,
	// 										referFollow: true,
	// 									};
	// 									// dcdAnim.loadSpine(window._MUBIAOZHISHI["aar_" + name].name, "skel", function () {
	// 									targetElement.mubiaozhishiid = dcdAnim.playSpine(window._MUBIAOZHISHI["aar_" + name], args);
	// 									// });
	// 								}
	// 							}
	// 							let val = lib.config.extension_无名美化_mubiaotexiao;
	// 							let gp = val.split("|");
	// 							if (gp[0] == "shizhounian") {
	// 								if (gp[1] == "-1") {
	// 									gp[1] = ["jiangjun", "weijiangjun", "cheqijiangjun", "biaoqijiangjun", "dajiangjun", "dasima"].randomGet();
	// 									playMubiaozhishi(gp[0], gp[1]);
	// 								} else playMubiaozhishi(gp[0], gp[1]);
	// 							} else if (gp[0] == "shousha") {
	// 								playMubiaozhishi(gp[0], gp[1]);
	// 							}
	// 							timer = null;
	// 						}, 300);
	// 					}
	// 				} else {
	// 					if (targetElement.mubiaozhishiid) {
	// 						dcdAnim.stopSpine(targetElement.mubiaozhishiid);
	// 						delete targetElement.mubiaozhishiid;
	// 						if (timer) {
	// 							clearTimeout(timer);
	// 							timer = null;
	// 						}
	// 					}
	// 				}
	// 			}
	// 		});
	// 		mubiaozhishiObserver.observe(player, mubiaozhishi);
	// 		player.mubiaozhishiObserver = mubiaozhishiObserver;
	// 	});
	// }
	// 随机刀剑斧
	const wjmhDaojianfuConfigRaw = lib.config.extension_无名美化_daojianfu;
	const wjmhDaojianfuConfig = ["off", "shousha", "4.5", "yjchuizi", "yjfuzi", "yjjian", "yjsuiji"].includes(wjmhDaojianfuConfigRaw)
		? wjmhDaojianfuConfigRaw
		: "4.5";
	if (wjmhDaojianfuConfig != "off") {
		window._DAOJIANFU = {
			fuzi: {
				name: "../../../无名美化/animation/globaltexiao/daojianfu/fuzi",
				speed: 0.6,
			},
			dao: {
				name: "../../../无名美化/animation/globaltexiao/daojianfu/dao",
				speed: 0.7,
			},
			jian: {
				name: "../../../无名美化/animation/globaltexiao/daojianfu/jian",
				speed: 0.7,
			},
			baoji: {
				name: "../../../无名美化/animation/globaltexiao/daojianfu/baoji",
				speed: 0.4,
			},
			putong: {
				name: "../../../无名美化/animation/globaltexiao/daojianfu/effect_shoujidonghua",
				speed: 0.75,
			},
			huo: {
				name: "../../../无名美化/animation/globaltexiao/daojianfu/fire",
				speed: 0.75,
			},
			lei: {
				name: "../../../无名美化/animation/globaltexiao/daojianfu/thunder",
				speed: 0.75,
			},
			huoshouji: {
				name: "../../../无名美化/animation/globaltexiao/daojianfu/huoshouji",
				speed: 0.5,
			},
			leishouji: {
				name: "../../../无名美化/animation/globaltexiao/daojianfu/leishouji",
				speed: 0.5,
			},
			huodao: {
				name: "../../../无名美化/animation/globaltexiao/daojianfu/fire_daojianfu",
				speed: 0.6,
			},
			leidao: {
				name: "../../../无名美化/animation/globaltexiao/daojianfu/SSXF_SX_guanjielei",
				speed: 0.7,
			},
			leifu: {
				name: "../../../无名美化/animation/globaltexiao/daojianfu/lei_daojianfu",
				speed: 0.7,
			},
			wanjian: {
				name: "../../../无名美化/animation/globaltexiao/daojianfu/wanjian",
				speed: 0.75,
			}, //万剑受击
			nanman: {
				name: "../../../无名美化/animation/globaltexiao/daojianfu/nanman",
				speed: 0.75,
			}, //南蛮受击
			huogong: {
				name: "../../../无名美化/animation/globaltexiao/daojianfu/SSZBB_DDZ_eff_huogong",
				speed: 0.75,
			}, //火攻受击
			juedou: {
				name: "../../../无名美化/animation/globaltexiao/daojianfu/aar_juedoushouji",
				speed: 0.75,
			}, //决斗受击
			//标记补充
			yjfuzi: {
				name: "../../../无名美化/animation/globaltexiao/yjdaojianfu/shoujidonghua_fuzi1",
				speed: 0.75,
			}, //一将成名斧子
			yjchuizi: {
				name: "../../../无名美化/animation/globaltexiao/yjdaojianfu/shoujidonghua_chuizi",
				speed: 0.75,
			}, //一将成名锤子
			yjjian: {
				name: "../../../无名美化/animation/globaltexiao/yjdaojianfu/shoujidonghua_jian",
				speed: 0.75,
			}, //一将成名剑
			yjshouji: {
				name: "../../../无名美化/animation/globaltexiao/yjdaojianfu/shoujidonghua_wuwuqi",
				speed: 0.5,
			}, //一将成名受击
		};
		if (wjmhDaojianfuConfig == "shousha") {
			lib.skill._wjmh_suijidaojianfu_shousha_ = {
				charlotte: true,
				forced: true,
				trigger: {
					player: "damageBegin4",
				},
				content: function () {
					if (typeof dcdAnim === "undefined" || !dcdAnim || typeof dcdAnim.loadSpine !== "function" || typeof dcdAnim.playSpine !== "function") return;
					let pt = trigger.source;
					let mma, mmb, mmc, mmd, mme;
					if (pt && !pt.storage.shoujitype) pt.storage.shoujitype = ["dao", "jian", "fuzi", "no"].randomGet();
					if (!pt) mma = "jian";
					else mma = pt.storage.shoujitype;

					if (mma == "dao") ((mmb = ["play", "play2"]), (mmc = ["play", "play2"]));
					if (mma == "fuzi") ((mmb = ["play3", "play4"]), (mmc = ["play3", "play4"]));
					if (mma == "jian") ((mmb = ["play5", "play6"]), (mmc = ["play5", "play6"]));
					if (mma == "no") ((mmb = ["play5", "play6"]), (mmc = ["play5", "play6"]));
					if (trigger.num <= 1) {
						if (!trigger.nature) {
							if (mma == "dao") {
								dcdAnim.loadSpine(window._DAOJIANFU.dao.name, "skel", function () {
									window._DAOJIANFU.dao.action = "play";
									dcdAnim.playSpine(window._DAOJIANFU.dao, {
										scale: 0.8,
										y: [0, 0.55],
										parent: player,
									});
								});
							} else if (mma == "jian") {
								dcdAnim.loadSpine(window._DAOJIANFU.jian.name, "skel", function () {
									window._DAOJIANFU.jian.action = "play";
									dcdAnim.playSpine(window._DAOJIANFU.jian, {
										scale: 0.8,
										parent: player,
									});
								});
							} else if (mma == "fuzi") {
								dcdAnim.loadSpine(window._DAOJIANFU.fuzi.name, "skel", function () {
									window._DAOJIANFU.fuzi.action = "play";
									dcdAnim.playSpine(window._DAOJIANFU.fuzi, {
										scale: 0.7,
										x: [0, 0.55],
										y: [0, 0.485],
										parent: player,
									});
								});
							} else if (mma == "no") {
								dcdAnim.loadSpine(window._DAOJIANFU.putong.name, "skel", function () {
									window._DAOJIANFU.putong.action = "play1";
									setTimeout(function () {
										dcdAnim.playSpine(window._DAOJIANFU.putong, {
											scale: 1.2,
											x: [0, 0.55],
											y: [0, 0.485],
											parent: player,
										});
									}, 200);
								});
							}
							// game.playAudio('../extension/无名美化/animation/globaltexiao/audio/daojianfu/damage.mp3');
						}
						if (trigger.nature == "fire") {
							if (mma == "dao") {
								//火刀
								dcdAnim.loadSpine(window._DAOJIANFU.dao.name, "skel", function () {
									window._DAOJIANFU.dao.action = "play";
									dcdAnim.playSpine(window._DAOJIANFU.dao, {
										scale: 0.8,
										y: [0, 0.55],
										parent: player,
									});
								});
								dcdAnim.loadSpine(window._DAOJIANFU.huoshouji.name, "skel", function () {
									setTimeout(function () {
										dcdAnim.playSpine(window._DAOJIANFU.huoshouji, {
											scale: 0.5,
											y: [0, 0.58],
											parent: player,
										});
									}, 300);
								});
							} else if (mma == "jian") {
								//火剑
								dcdAnim.loadSpine(window._DAOJIANFU.jian.name, "skel", function () {
									window._DAOJIANFU.jian.action = "play";
									dcdAnim.playSpine(window._DAOJIANFU.jian, {
										scale: 0.8,
										parent: player,
									});
								});
								dcdAnim.loadSpine(window._DAOJIANFU.huoshouji.name, "skel", function () {
									setTimeout(function () {
										dcdAnim.playSpine(window._DAOJIANFU.huoshouji, {
											scale: 0.5,
											y: [0, 0.58],
											parent: player,
										});
									}, 300);
								});
							} else if (mma == "fuzi") {
								//火斧
								dcdAnim.loadSpine(window._DAOJIANFU.fuzi.name, "skel", function () {
									window._DAOJIANFU.fuzi.action = "play";
									dcdAnim.playSpine(window._DAOJIANFU.fuzi, {
										scale: 0.7,
										x: [0, 0.55],
										y: [0, 0.485],
										parent: player,
									});
								});
								dcdAnim.loadSpine(window._DAOJIANFU.huoshouji.name, "skel", function () {
									setTimeout(function () {
										dcdAnim.playSpine(window._DAOJIANFU.huoshouji, {
											scale: 0.5,
											y: [0, 0.58],
											parent: player,
										});
									}, 300);
								});
							} else if (mma == "no") {
								//普通火受击
								dcdAnim.loadSpine(window._DAOJIANFU.huo.name, "skel", function () {
									setTimeout(function () {
										dcdAnim.playSpine(window._DAOJIANFU.huo, {
											scale: 0.75,
											x: [0, 0.25],
											y: [0, 0.25],
											parent: player,
										});
									}, 200);
								});
							}
							// game.playAudio('../extension/无名美化/animation/globaltexiao/audio/daojianfu/damage_fire.mp3');
						}
						if (trigger.nature == "thunder") {
							if (mma == "dao") {
								//雷刀
								dcdAnim.loadSpine(window._DAOJIANFU.dao.name, "skel", function () {
									window._DAOJIANFU.dao.action = "play";
									dcdAnim.playSpine(window._DAOJIANFU.dao, {
										scale: 0.8,
										y: [0, 0.55],
										parent: player,
									});
								});
								dcdAnim.loadSpine(window._DAOJIANFU.lei.name, "skel", function () {
									setTimeout(function () {
										dcdAnim.playSpine(
											{
												name: window._DAOJIANFU.lei.name,
												opacity: 1.5,
												action: "dian",
											},
											{
												scale: 0.8,
												parent: player,
											}
										);
									}, 300);
								});
							} else if (mma == "jian") {
								//雷剑
								dcdAnim.loadSpine(window._DAOJIANFU.jian.name, "skel", function () {
									window._DAOJIANFU.jian.action = "play";
									dcdAnim.playSpine(window._DAOJIANFU.jian, {
										scale: 0.8,
										parent: player,
									});
								});
								dcdAnim.loadSpine(window._DAOJIANFU.lei.name, "skel", function () {
									setTimeout(function () {
										dcdAnim.playSpine(
											{
												name: window._DAOJIANFU.lei.name,
												opacity: 1.5,
												action: "dian",
											},
											{
												scale: 0.8,
												parent: player,
											}
										);
									}, 300);
								});
							} else if (mma == "fuzi") {
								//雷斧
								dcdAnim.loadSpine(window._DAOJIANFU.fuzi.name, "skel", function () {
									window._DAOJIANFU.fuzi.action = "play";
									dcdAnim.playSpine(window._DAOJIANFU.fuzi, {
										scale: 0.7,
										x: [0, 0.55],
										y: [0, 0.485],
										parent: player,
									});
								});
								dcdAnim.loadSpine(window._DAOJIANFU.lei.name, "skel", function () {
									setTimeout(function () {
										dcdAnim.playSpine(
											{
												name: window._DAOJIANFU.lei.name,
												opacity: 1.5,
												action: "dian",
											},
											{
												scale: 0.8,
												parent: player,
											}
										);
									}, 300);
								});
							} else if (mma == "no") {
								//普通雷受击
								dcdAnim.loadSpine(window._DAOJIANFU.lei.name, "skel", function () {
									setTimeout(function () {
										dcdAnim.playSpine(
											{
												name: window._DAOJIANFU.lei.name,
												opacity: 1.5,
												action: "gonjian",
											},
											{
												scale: 0.4,
												x: [0, 0.25],
												y: [0, 0.25],
												parent: player,
											}
										);
									}, 200);
								});
							}
							// game.playAudio('../extension/无名美化/animation/globaltexiao/audio/daojianfu/damage_thunder.mp3');
						}
					} else if (trigger.num > 1) {
						// 两点伤害
						dcdAnim.loadSpine(window._DAOJIANFU.baoji.name, "skel", function () {
							dcdAnim.playSpine(window._DAOJIANFU.baoji, {
								scale: 0.6,
								x: [0, 0.55],
								parent: player,
							});
						});
						if (!trigger.nature) {
							if (mma == "dao") {
								dcdAnim.loadSpine(window._DAOJIANFU.dao.name, "skel", function () {
									window._DAOJIANFU.dao.action = "play2";
									dcdAnim.playSpine(window._DAOJIANFU.dao, {
										scale: 0.8,
										y: [0, 0.58],
										parent: player,
									});
								});
							} else if (mma == "jian") {
								dcdAnim.loadSpine(window._DAOJIANFU.jian.name, "skel", function () {
									window._DAOJIANFU.jian.action = "play2";
									dcdAnim.playSpine(window._DAOJIANFU.jian, {
										scale: 0.8,
										parent: player,
									});
								});
							} else if (mma == "fuzi") {
								dcdAnim.loadSpine(window._DAOJIANFU.fuzi.name, "skel", function () {
									window._DAOJIANFU.fuzi.action = "play2";
									dcdAnim.playSpine(window._DAOJIANFU.fuzi, {
										scale: 0.7,
										x: [0, 0.55],
										y: [0, 0.485],
										parent: player,
									});
								});
							} else if (mma == "no") {
								dcdAnim.loadSpine(window._DAOJIANFU.putong.name, "skel", function () {
									window._DAOJIANFU.putong.action = "play1";
									setTimeout(function () {
										dcdAnim.playSpine(window._DAOJIANFU.putong, {
											scale: 1.2,
											x: [0, 0.55],
											y: [0, 0.485],
											parent: player,
										});
									}, 200);
								});
							}
							//  game.playAudio('../extension/无名美化/animation/globaltexiao/audio/daojianfu/damage2.mp3');
						}
						if (trigger.nature == "fire") {
							if (mma == "dao") {
								//火刀
								dcdAnim.loadSpine(window._DAOJIANFU.dao.name, "skel", function () {
									window._DAOJIANFU.dao.action = "play2";
									dcdAnim.playSpine(window._DAOJIANFU.dao, {
										scale: 0.8,
										y: [0, 0.58],
										parent: player,
									});
								});
								dcdAnim.loadSpine(window._DAOJIANFU.huoshouji.name, "skel", function () {
									setTimeout(function () {
										dcdAnim.playSpine(window._DAOJIANFU.huoshouji, {
											scale: 0.5,
											y: [0, 0.58],
											parent: player,
										});
									}, 300);
								});
							} else if (mma == "jian") {
								//火剑
								dcdAnim.loadSpine(window._DAOJIANFU.jian.name, "skel", function () {
									window._DAOJIANFU.jian.action = "play2";
									dcdAnim.playSpine(window._DAOJIANFU.jian, {
										scale: 0.8,
										parent: player,
									});
								});
								dcdAnim.loadSpine(window._DAOJIANFU.huoshouji.name, "skel", function () {
									setTimeout(function () {
										dcdAnim.playSpine(window._DAOJIANFU.huoshouji, {
											scale: 0.5,
											y: [0, 0.58],
											parent: player,
										});
									}, 300);
								});
							} else if (mma == "fuzi") {
								//火斧
								dcdAnim.loadSpine(window._DAOJIANFU.fuzi.name, "skel", function () {
									window._DAOJIANFU.fuzi.action = "play2";
									dcdAnim.playSpine(window._DAOJIANFU.fuzi, {
										scale: 0.7,
										x: [0, 0.55],
										y: [0, 0.485],
										parent: player,
									});
								});
								dcdAnim.loadSpine(window._DAOJIANFU.huoshouji.name, "skel", function () {
									setTimeout(function () {
										dcdAnim.playSpine(window._DAOJIANFU.huoshouji, {
											scale: 0.5,
											y: [0, 0.58],
											parent: player,
										});
									}, 300);
								});
							} else if (mma == "no") {
								//普通火受击
								dcdAnim.loadSpine(window._DAOJIANFU.huo.name, "skel", function () {
									// window._DAOJIANFU.huo.action = "play";
									setTimeout(function () {
										dcdAnim.playSpine(window._DAOJIANFU.huo, {
											scale: 0.75,
											x: [0, 0.25],
											y: [0, 0.25],
											parent: player,
										});
									}, 200);
								});
							}
							//  game.playAudio('../extension/无名美化/animation/globaltexiao/audio/daojianfu/damage_fire2.mp3');
						}
						if (trigger.nature == "thunder") {
							if (mma == "dao") {
								//雷刀
								dcdAnim.loadSpine(window._DAOJIANFU.dao.name, "skel", function () {
									window._DAOJIANFU.dao.action = "play2";
									dcdAnim.playSpine(window._DAOJIANFU.dao, {
										scale: 0.8,
										y: [0, 0.58],
										parent: player,
									});
								});
								dcdAnim.loadSpine(window._DAOJIANFU.lei.name, "skel", function () {
									setTimeout(function () {
										dcdAnim.playSpine(
											{
												name: window._DAOJIANFU.lei.name,
												opacity: 1.5,
												action: "dian",
											},
											{
												scale: 0.8,
												parent: player,
											}
										);
									}, 300);
								});
							} else if (mma == "jian") {
								//雷剑
								dcdAnim.loadSpine(window._DAOJIANFU.jian.name, "skel", function () {
									window._DAOJIANFU.jian.action = "play2";
									dcdAnim.playSpine(window._DAOJIANFU.jian, {
										scale: 0.8,
										parent: player,
									});
								});
								dcdAnim.loadSpine(window._DAOJIANFU.lei.name, "skel", function () {
									setTimeout(function () {
										dcdAnim.playSpine(
											{
												name: window._DAOJIANFU.lei.name,
												opacity: 1.5,
												action: "dian",
											},
											{ scale: 0.8, parent: player }
										);
									}, 300);
								});
							} else if (mma == "fuzi") {
								//雷斧
								dcdAnim.loadSpine(window._DAOJIANFU.fuzi.name, "skel", function () {
									window._DAOJIANFU.fuzi.action = "play2";
									dcdAnim.playSpine(window._DAOJIANFU.fuzi, {
										scale: 0.7,
										x: [0, 0.55],
										y: [0, 0.485],
										parent: player,
									});
								});
								dcdAnim.loadSpine(window._DAOJIANFU.lei.name, "skel", function () {
									setTimeout(function () {
										dcdAnim.playSpine(
											{
												name: window._DAOJIANFU.lei.name,
												opacity: 1.5,
												action: "dian",
											},
											{
												scale: 0.8,
												parent: player,
											}
										);
									}, 300);
								});
							} else if (mma == "no") {
								//普通雷受击
								dcdAnim.loadSpine(window._DAOJIANFU.lei.name, "skel", function () {
									setTimeout(function () {
										dcdAnim.playSpine(
											{
												name: window._DAOJIANFU.lei.name,
												opacity: 1.5,
												action: "gonjian",
											},
											{
												scale: 0.4,
												x: [0, 0.25],
												y: [0, 0.25],
												parent: player,
											}
										);
									}, 200);
								});
							}
							// game.playAudio('../extension/无名美化/animation/globaltexiao/audio/daojianfu/damage_thunder2.mp3');
						}
					}
				},
			};
		} else if (wjmhDaojianfuConfig == "4.5") {
			lib.skill._wjmh_suijidaojianfu_sidianwu_ = {
				charlotte: true,
				forced: true,
				trigger: {
					player: "damageBegin4",
				},
				content: function () {
					if (typeof dcdAnim === "undefined" || !dcdAnim || typeof dcdAnim.loadSpine !== "function" || typeof dcdAnim.playSpine !== "function") return;
					let pt = trigger.source;
					let mma, mmb, mmc, mmd, mme;
					if (pt && !pt.storage.shoujitype) pt.storage.shoujitype = ["dao", "jian", "fuzi"].randomGet();
					if (!pt) mma = "jian";
					else mma = pt.storage.shoujitype;

					if (mma == "dao") ((mmb = ["play", "play2"]), (mmc = ["play", "play2"]));
					if (mma == "fuzi") ((mmb = ["play3", "play4"]), (mmc = ["play3", "play4"]));
					if (mma == "jian") ((mmb = ["play5", "play6"]), (mmc = ["play5", "play6"]));
					if (trigger.parent && ["nanman", "wanjian", "huogong", "juedou"].includes(trigger.parent.name)) {
						dcdAnim.loadSpine(window._DAOJIANFU[trigger.parent.name].name, "skel", function () {
							dcdAnim.playSpine(window._DAOJIANFU[trigger.parent.name], {
								scale: 0.6,
								x: [0, 0.55],
								y: [0, 0.485],
								parent: player,
							});
						});
						game.playAudio("../extension/无名美化/animation/globaltexiao/audio/daojianfu/" + trigger.parent.name + ".mp3");
						if (trigger.num > 1) game.playAudio("../extension/无名美化/animation/globaltexiao/audio/daojianfu/damage2.mp3");
					} else if (trigger.parent && trigger.parent.name == "shandian") {
						game.playAudio("../extension/无名美化/animation/globaltexiao/audio/daojianfu/" + trigger.parent.name + ".mp3");
					} else if (trigger.num <= 1) {
						// 一点伤害
						if (!trigger.nature) {
							//无属性刀
							if (mma == "dao") {
								dcdAnim.loadSpine(window._DAOJIANFU.dao.name, "skel", function () {
									window._DAOJIANFU.dao.action = "play";
									dcdAnim.playSpine(window._DAOJIANFU.dao, {
										scale: 0.7,
										y: [0, 0.55],
										parent: player,
									});
								});
							} else if (mma == "jian") {
								dcdAnim.loadSpine(window._DAOJIANFU.jian.name, "skel", function () {
									window._DAOJIANFU.jian.action = "play";
									dcdAnim.playSpine(window._DAOJIANFU.jian, {
										scale: 0.7,
										parent: player,
									});
								});
							} else if (mma == "fuzi") {
								dcdAnim.loadSpine(window._DAOJIANFU.fuzi.name, "skel", function () {
									window._DAOJIANFU.fuzi.action = "play";
									dcdAnim.playSpine(window._DAOJIANFU.fuzi, {
										scale: 0.6,
										x: [0, 0.55],
										y: [0, 0.485],
										parent: player,
									});
								});
							}
							// game.playAudio('../extension/无名美化/animation/globaltexiao/audio/daojianfu/damage.mp3');
						}
						if (trigger.nature == "fire") {
							if (mma == "dao") {
								//火刀
								dcdAnim.loadSpine(window._DAOJIANFU.huodao.name, "skel", function () {
									window._DAOJIANFU.huodao.action = "play";
									dcdAnim.playSpine(window._DAOJIANFU.huodao, {
										scale: 0.7,
										parent: player,
									});
								});
							} else if (mma == "jian") {
								//火剑
								dcdAnim.loadSpine(window._DAOJIANFU.huodao.name, "skel", function () {
									window._DAOJIANFU.huodao.action = "play5";
									dcdAnim.playSpine(window._DAOJIANFU.huodao, {
										scale: 0.7,
										parent: player,
									});
								});
							} else if (mma == "fuzi") {
								//火斧
								dcdAnim.loadSpine(window._DAOJIANFU.huodao.name, "skel", function () {
									window._DAOJIANFU.huodao.action = "play3";
									dcdAnim.playSpine(window._DAOJIANFU.huodao, {
										scale: 0.7,
										parent: player,
									});
								});
							}
							dcdAnim.loadSpine(window._DAOJIANFU.huoshouji.name, "skel", function () {
								setTimeout(function () {
									dcdAnim.playSpine(window._DAOJIANFU.huoshouji, {
										scale: 0.5,
										y: [0, 0.58],
										parent: player,
									});
								}, 300);
							});
							// game.playAudio('../extension/无名美化/animation/globaltexiao/audio/daojianfu/damage_fire.mp3');
						}
						if (trigger.nature == "thunder") {
							if (mma == "dao") {
								//雷刀
								dcdAnim.loadSpine(window._DAOJIANFU.leidao.name, "skel", function () {
									window._DAOJIANFU.leidao.action = "play";
									dcdAnim.playSpine(window._DAOJIANFU.leidao, {
										scale: 0.6,
										y: [0, 0.55],
										parent: player,
									});
								});
							} else if (mma == "jian") {
								//雷剑
								dcdAnim.loadSpine(window._DAOJIANFU.leidao.name, "skel", function () {
									window._DAOJIANFU.leidao.action = "play5";
									dcdAnim.playSpine(window._DAOJIANFU.leidao, {
										scale: 0.65,
										y: [0, 0.55],
										parent: player,
									});
								});
							} else if (mma == "fuzi") {
								//雷斧
								dcdAnim.loadSpine(window._DAOJIANFU.leifu.name, "skel", function () {
									window._DAOJIANFU.leifu.action = "play3";
									dcdAnim.playSpine(window._DAOJIANFU.leifu, {
										scale: 0.7,
										parent: player,
									});
								});
							}
							dcdAnim.loadSpine(window._DAOJIANFU.leishouji.name, "skel", function () {
								setTimeout(function () {
									dcdAnim.playSpine(window._DAOJIANFU.leishouji, {
										scale: 0.6,
										y: [0, 0.58],
										parent: player,
									});
								}, 300);
							});
							// game.playAudio('../extension/无名美化/animation/globaltexiao/audio/daojianfu/damage_thunder.mp3');
						}
					} else if (trigger.num > 1) {
						// 两点伤害
						dcdAnim.loadSpine(window._DAOJIANFU.baoji.name, "skel", function () {
							dcdAnim.playSpine(window._DAOJIANFU.baoji, {
								scale: 0.6,
								x: [0, 0.55],
								parent: player,
							});
						});
						if (!trigger.nature) {
							if (mma == "dao") {
								dcdAnim.loadSpine(window._DAOJIANFU.dao.name, "skel", function () {
									window._DAOJIANFU.dao.action = "play2";
									dcdAnim.playSpine(window._DAOJIANFU.dao, {
										scale: 0.7,
										y: [0, 0.58],
										parent: player,
									});
								});
							} else if (mma == "jian") {
								dcdAnim.loadSpine(window._DAOJIANFU.jian.name, "skel", function () {
									window._DAOJIANFU.jian.action = "play2";
									dcdAnim.playSpine(window._DAOJIANFU.jian, {
										scale: 0.6,
										parent: player,
									});
								});
							} else if (mma == "fuzi") {
								dcdAnim.loadSpine(window._DAOJIANFU.fuzi.name, "skel", function () {
									window._DAOJIANFU.fuzi.action = "play2";
									dcdAnim.playSpine(window._DAOJIANFU.fuzi, {
										scale: 0.6,
										x: [0, 0.55],
										y: [0, 0.485],
										parent: player,
									});
								});
							}
							// game.playAudio('../extension/无名美化/animation/globaltexiao/audio/daojianfu/damage2.mp3');
						}
						if (trigger.nature == "fire") {
							if (mma == "dao") {
								//火刀
								dcdAnim.loadSpine(window._DAOJIANFU.huodao.name, "skel", function () {
									window._DAOJIANFU.huodao.action = "play2";
									dcdAnim.playSpine(window._DAOJIANFU.huodao, {
										scale: 0.65,
										parent: player,
									});
								});
							} else if (mma == "jian") {
								//火剑
								dcdAnim.loadSpine(window._DAOJIANFU.huodao.name, "skel", function () {
									window._DAOJIANFU.huodao.action = "play6";
									dcdAnim.playSpine(window._DAOJIANFU.huodao, {
										scale: 0.65,
										parent: player,
									});
								});
							} else if (mma == "fuzi") {
								//火斧
								dcdAnim.loadSpine(window._DAOJIANFU.huodao.name, "skel", function () {
									window._DAOJIANFU.huodao.action = "play4";
									dcdAnim.playSpine(window._DAOJIANFU.huodao, {
										scale: 0.6,
										parent: player,
									});
								});
							}
							dcdAnim.loadSpine(window._DAOJIANFU.huoshouji.name, "skel", function () {
								setTimeout(function () {
									dcdAnim.playSpine(window._DAOJIANFU.huoshouji, {
										scale: 0.5,
										y: [0, 0.58],
										parent: player,
									});
								}, 300);
							});
							// game.playAudio('../extension/无名美化/animation/globaltexiao/audio/daojianfu/damage_fire2.mp3');
						}
						if (trigger.nature == "thunder") {
							if (mma == "dao") {
								//雷刀
								dcdAnim.loadSpine(window._DAOJIANFU.leidao.name, "skel", function () {
									window._DAOJIANFU.leidao.action = "play2";
									dcdAnim.playSpine(window._DAOJIANFU.leidao, {
										scale: 0.6,
										y: [0, 0.55],
										parent: player,
									});
								});
							} else if (mma == "jian") {
								//雷剑
								dcdAnim.loadSpine(window._DAOJIANFU.leidao.name, "skel", function () {
									window._DAOJIANFU.leidao.action = "play6";
									dcdAnim.playSpine(window._DAOJIANFU.leidao, {
										scale: 0.65,
										y: [0, 0.55],
										parent: player,
									});
								});
							} else if (mma == "fuzi") {
								//雷斧
								dcdAnim.loadSpine(window._DAOJIANFU.leifu.name, "skel", function () {
									window._DAOJIANFU.leifu.action = "play4";
									dcdAnim.playSpine(window._DAOJIANFU.leifu, {
										scale: 0.6,
										parent: player,
									});
								});
							}
							dcdAnim.loadSpine(window._DAOJIANFU.leishouji.name, "skel", function () {
								setTimeout(function () {
									dcdAnim.playSpine(window._DAOJIANFU.leishouji, {
										scale: 0.6,
										y: [0, 0.55],
										parent: player,
									});
								}, 300);
							});
							// game.playAudio('../extension/无名美化/animation/globaltexiao/audio/daojianfu/damage_thunder2.mp3');
						}
					}
				},
			};
		} else {
			// 创建一个统一的函数来处理不同武器的伤害效果
			window._playWeaponEffect = function playWeaponEffect(weaponType, trigger, player) {
				if (
					typeof skinSwitch === "undefined" ||
					!skinSwitch ||
					!skinSwitch.chukuangWorkerApi ||
					typeof skinSwitch.chukuangWorkerApi.playEffect !== "function" ||
					!trigger
				)
					return;
				// 根据武器类型确定动画文件名
				let weaponAnimName;
				if (weaponType === "yjfuzi") {
					weaponAnimName = "shoujidonghua_fuzi1";
				} else if (weaponType === "yjchuizi") {
					weaponAnimName = "shoujidonghua_chuizi";
				} else if (weaponType === "yjjian") {
					weaponAnimName = "shoujidonghua_jian";
				}
				if (!weaponAnimName) weaponAnimName = "shoujidonghua_jian";
				console.log("weaponAnimName", weaponAnimName);
				// 一点伤害
				if (trigger.num <= 1) {
					skinSwitch.chukuangWorkerApi.playEffect(
						{
							name: "../../../无名美化/animation/globaltexiao/yjdaojianfu/" + weaponAnimName,
							version: "4.0",
							action: "play1",
						},
						{
							speed: 0.9,
							scale: 0.8,
							parent: player,
						}
					);
					if (!trigger.nature) {
						skinSwitch.chukuangWorkerApi.playEffect(
							{
								name: "../../../无名美化/animation/globaltexiao/yjdaojianfu/shoujidonghua_wuwuqi",
								version: "4.0",
								action: "play1",
							},
							{
								speed: 0.9,
								scale: 0.8,
								parent: player,
							}
						);
						game.playAudio("../extension/无名美化/animation/globaltexiao/yjdaojianfu/audio/hurt.mp3");
					}
					//一点火属性伤害
					if (trigger.nature == "fire") {
						skinSwitch.chukuangWorkerApi.playEffect(
							{
								name: "../../../无名美化/animation/globaltexiao/yjdaojianfu/" + weaponAnimName,
								version: "4.0",
								action: "play3",
							},
							{
								speed: 0.9,
								scale: 0.8,
								parent: player,
							}
						);
						skinSwitch.chukuangWorkerApi.playEffect(
							{
								name: "../../../无名美化/animation/globaltexiao/yjdaojianfu/shoujidonghua_wuwuqi",
								version: "4.0",
								action: "play3",
							},
							{
								speed: 0.9,
								scale: 0.8,
								parent: player,
							}
						);
						game.playAudio("../extension/无名美化/animation/globaltexiao/yjdaojianfu/audio/huo_hurt.mp3");
					}
					//一点雷属性伤害
					if (trigger.nature == "thunder") {
						skinSwitch.chukuangWorkerApi.playEffect(
							{
								name: "../../../无名美化/animation/globaltexiao/yjdaojianfu/" + weaponAnimName,
								version: "4.0",
								action: "play5",
							},
							{
								speed: 0.9,
								scale: 0.8,
								parent: player,
							}
						);
						skinSwitch.chukuangWorkerApi.playEffect(
							{
								name: "../../../无名美化/animation/globaltexiao/yjdaojianfu/shoujidonghua_wuwuqi",
								version: "4.0",
								action: "play5",
							},
							{
								speed: 0.9,
								scale: 0.8,
								parent: player,
							}
						);
						game.playAudio("../extension/无名美化/animation/globaltexiao/yjdaojianfu/audio/lei_hurt.mp3");
					}
				}
				// 两点伤害
				if (trigger.num > 1) {
					skinSwitch.chukuangWorkerApi.playEffect(
						{
							name: "../../../无名美化/animation/globaltexiao/yjdaojianfu/" + weaponAnimName,
							version: "4.0",
							action: "play2",
						},
						{
							speed: 0.9,
							scale: 0.8,
							parent: player,
						}
					);
					if (!trigger.nature) {
						skinSwitch.chukuangWorkerApi.playEffect(
							{
								name: "../../../无名美化/animation/globaltexiao/yjdaojianfu/shoujidonghua_wuwuqi",
								version: "4.0",
								action: "play2",
							},
							{
								speed: 0.9,
								scale: 0.8,
								parent: player,
							}
						);
						game.playAudio("../extension/无名美化/animation/globaltexiao/yjdaojianfu/audio/hurt2.mp3");
					}
					//两点火属性伤害
					if (trigger.nature == "fire") {
						skinSwitch.chukuangWorkerApi.playEffect(
							{
								name: "../../../无名美化/animation/globaltexiao/yjdaojianfu/" + weaponAnimName,
								version: "4.0",
								action: "play4",
							},
							{
								speed: 0.9,
								scale: 0.8,
								parent: player,
							}
						);
						skinSwitch.chukuangWorkerApi.playEffect(
							{
								name: "../../../无名美化/animation/globaltexiao/yjdaojianfu/shoujidonghua_wuwuqi",
								version: "4.0",
								action: "play4",
							},
							{
								speed: 0.9,
								scale: 0.8,
								parent: player,
							}
						);
						game.playAudio("../extension/无名美化/animation/globaltexiao/yjdaojianfu/audio/huo_hurt2.mp3");
					}
					//两点雷属性伤害
					if (trigger.nature == "thunder") {
						skinSwitch.chukuangWorkerApi.playEffect(
							{
								name: "../../../无名美化/animation/globaltexiao/yjdaojianfu/" + weaponAnimName,
								version: "4.0",
								action: "play6",
							},
							{
								speed: 0.9,
								scale: 0.8,
								parent: player,
							}
						);
						skinSwitch.chukuangWorkerApi.playEffect(
							{
								name: "../../../无名美化/animation/globaltexiao/yjdaojianfu/shoujidonghua_wuwuqi",
								version: "4.0",
								action: "play6",
							},
							{
								speed: 0.9,
								scale: 0.8,
								parent: player,
							}
						);
						game.playAudio("../extension/无名美化/animation/globaltexiao/yjdaojianfu/audio/lei_hurt2.mp3");
					}
				}
			};

			// 创建对应的skill
			const skillName = "_player_daojianfu_xxgg_yjdjf_";
			lib.skill[skillName] = {
				trigger: {
					player: "damageBegin4",
				},
				charlotte: true,
				forced: true,
				content: function () {
					// 支持随机选择武器或使用配置的武器
					if (typeof window._playWeaponEffect !== "function") return;
					let weaponTypes = ["yjfuzi", "yjchuizi", "yjjian"];
					let weaponType;
					// 检查是否是预设的三种武器类型之一
					let setType = lib.config.extension_无名美化_daojianfu;
					console.log("setType", setType);
					if (weaponTypes.includes(setType)) {
						// 使用配置的武器类型
						weaponType = setType;
					} else if (setType === "yjsuiji") {
						// 随机选择一种武器
						weaponType = weaponTypes.randomGet();
					} else {
						// 默认使用yjjian
						weaponType = "yjjian";
					}
					console.log("weaponType", weaponType);
					window._playWeaponEffect(weaponType, trigger, player);
				},
			};
		}
	}
	// 酒特效
	if (lib.config.extension_无名美化_jiubuff && get.mode() != "taixuhuanjing") {
		window._WJMHJIUBUFFTEXIAO = {
			jiubuff: {
				name: "../../../无名美化/animation/globaltexiao/jiubuff/jiubuff",
			},
		};
		//酒特效开始
		lib.skill._jiubuff_kaishi_ = {
			charlotte: true,
			forced: true,
			popup: false,
			firstDo: true,
			audio: false,
			trigger: {
				player: "useCard",
			},
			filter: function (event, player) {
				return event.card && event.card.name == "jiu" && !player.isDying();
			},
			content: function () {
				if (player._wjmh_jiubuff_ == undefined) {
					var args = {
						scale: 0.50,
						x: [0, 0.47],
						y: [0, 0.52],
						parent: player,
					};
					var name = "jiubuff";
					dcdAnim.loadSpine(window._WJMHJIUBUFFTEXIAO[name].name, "skel", function () {
						window._WJMHJIUBUFFTEXIAO[name].loop = true;
						player._wjmh_jiubuff_ = dcdAnim.playSpine(window._WJMHJIUBUFFTEXIAO[name], args);
					});
				}
			},
		};
		//酒特效消失
		lib.skill._jiubuff_xiaoshi_ = {
			priority: 20,
			charlotte: true,
			forced: true,
			popup: false,
			firstDo: true,
			forceDie: true,
			audio: false,
			trigger: {
				player: ["useCard", "die", "dieAfter"],
				global: ["phaseAfter"],
			},
			filter: function (event, player) {
				if (event.name == "phase" || event.name == "die") return true;
				if (event.name == "useCard") return event.card && event.card.name == "sha";
				return true;
			},
			content: function () {
				if (player._wjmh_jiubuff_ != undefined) {
					dcdAnim.stopSpine(player._wjmh_jiubuff_);
					player._wjmh_jiubuff_ = undefined;
				}
			},
		};
	}

	window._WMMH_CARDEFFECT = {
		nanmanruqin: {
			ol: {
				name: "../../../无名美化/animation/globaltexiao/nanmanruqin/ol/EFF_NanManRuQing",
				scale: 0.8,
				version: "4.0",
			},
			shizhounian: {
				name: "../../../无名美化/animation/globaltexiao/nanmanruqin/shizhounian/nanmanruqin",
				scale: 0.8,
			},
			shousha: {
				name: "../../../无名美化/animation/globaltexiao/nanmanruqin/shousha/effect_nanmanruqin",
				scale: 0.8,
			},
		},
		wanjianqifa: {
			name: "../../../无名美化/animation/globaltexiao/wanjianqifa/effect_wanjianqifa_full",
			scale: 0.8,
		},
		nisiwohuo: {
			name: lib.assetURL + "extension/无名美化/animation/nisiwohuo/SF_wenheluanwu_eff_luanwu",
			loop: true,
			version: "3.6",
		},
	};
	lib.skill._wmmhshiyongkapaitexiao_ = {
		trigger: {
			player: ["useCardBegin"],
		},
		charlotte: true,
		forced: true,
		popup: false,
		firstDo: true,
		audio: false,
		content: function () {
			let nmConfigName = lib.config.extension_无名美化_nanmanruqin;
			//南蛮入侵特效
			if (nmConfigName != "off") {
				if (trigger.card.name == "nanman" && get.type(trigger.card) == "trick") {
					game.playAudio("ext:无名美化/animation/globaltexiao/audio/nanmanruqin/effect_nanmanruqin.mp3");
					skinSwitch.chukuangWorkerApi.playEffect(window._WMMH_CARDEFFECT.nanmanruqin[nmConfigName]);
				}
			}
			let wjConfig = lib.config.extension_无名美化_wanjianqifa;
			if (wjConfig) {
				if (trigger.card.name == "wanjian" && get.type(trigger.card) == "trick") {
					game.playAudio("ext:无名美化/animation/globaltexiao/audio/wanjianqifa/wanjianqifa.mp3");
					skinSwitch.chukuangWorkerApi.playEffect(window._WMMH_CARDEFFECT.wanjianqifa);
				}
			}

			let nswhConfig = lib.config.extension_无名美化_nisiwohuo;
			if (nswhConfig && get.mode() != "taixuhuanjing") {
				if (trigger.card.name == "nisiwohuo" && get.type(trigger.card) == "trick") {
					if (!ui.anManagerCustZ) {
						let an4 = new window.NewAnimation4Class("", document.body, "decadeUI-canvas4");
						an4.canvas.style["z-index"] = 3;
						ui.anManagerCustZ = an4.anManager;
					}

					// game.playAudio("ext:无名美化/animation/globaltexiao/audio/wanjianqifa/wanjianqifa.mp3");
					let nswhBg = document.createElement("img");
					ui._nswhBg = nswhBg;
					nswhBg.src = `${lib.assetURL}extension/无名美化/animation/nisiwohuo/area_bg.png`;
					nswhBg.style.position = "absolute";
					nswhBg.style.top = "50%";
					nswhBg.style.left = "50%";
					nswhBg.style.transform = "translate(-50%,-50%)";
					nswhBg.style.zIndex = "2";
					document.body.appendChild(nswhBg);

					if (ui.anManagerCustZ) {
						ui.anManagerCustZ.loadAndPlay(
							window._WMMH_CARDEFFECT.nisiwohuo,
							node => {
								ui._NISIWOHUO = node;
							},
							null,
							{
								y: [-10, 0.5],
							}
						);
					}
				}
			}
		},
	};
	// 阵亡特效
	// if (
	//   lib.config.extension_无名美化_zhenwangtexiao &&
	//   lib.config.extension_无名美化_zhenwangtexiao != "off"
	// ) {
	//   window._WJMHZHENWANGTEXIAO = {
	//     SS_zhenwang: {
	//       name: "../../../无名美化/animation/globaltexiao/zhenwang/SS_zhenwang",
	//     }, // OL
	//     SZN_zhenwang: {
	//       name: "../../../无名美化/animation/globaltexiao/zhenwang/SZN_zhenwang",
	//     }, // 十周年
	//   };
	//   lib.skill._wjmh_zhenwangtexiao_ = {
	//     charlotte: true,
	//     forced: true,
	//     silent: true,
	//     trigger: {
	//       player: "dieBegin",
	//     },
	//     content: function () {
	//       var anim;
	//       if (lib.config.extension_无名美化_zhenwangtexiao == "ol")
	//         anim = "SS_zhenwang";
	//       else if (lib.config.extension_无名美化_zhenwangtexiao == "shizhounian")
	//         anim = "SZN_zhenwang";
	//       if (anim) {
	//         dcdAnim.loadSpine(
	//           window._WJMHZHENWANGTEXIAO[anim].name,
	//           "skel",
	//           function () {
	//             dcdAnim.playSpine(window._WJMHZHENWANGTEXIAO[anim], {
	//               speed: 1,
	//               scale: 0.8,
	//               parent: player,
	//             });
	//           }
	//         );
	//       }
	//     },
	//   };
	// }
	// 主内单挑特效
	if (lib.config.extension_无名美化_zhuneidantiao) {
		window._ZHUNEIDANTIAO = {
			neijian: {
				name: "../../../无名美化/animation/globaltexiao/zhuneidantiao/neijian",
			},
			neijian2: {
				name: "../../../无名美化/animation/globaltexiao/zhuneidantiao/neijian2",
			},
		};
		lib.skill._zhuneidantiao = {
			charlotte: true,
			forced: true,
			silent: true,
			trigger: {
				global: "dieAfter",
			},
			filter: function (event, player) {
				if (game.zhu && game.zhu.isAlive() && game.players.length == 2 && get.population("nei") == 1) return true;
			},
			content: function () {
				dcdAnim.loadSpine(window._ZHUNEIDANTIAO.neijian.name, "skel", function () {
					dcdAnim.playSpine(window._ZHUNEIDANTIAO.neijian, {
						speed: 1,
						scale: 0.7,
					});
				});
				game.playAudio("ext:无名美化/animation/globaltexiao/audio/zhuneidantiao/neijian.mp3");
				// dcdAnim.loadSpine(window._ZHUNEIDANTIAO.neijian2.name, "skel", function () {
				//     dcdAnim.playSpine(window._ZHUNEIDANTIAO.neijian2, {
				//         speed: 1,
				//         scale: 0.7,
				//     });
				// });
			},
		};
	}
	let gjrcName = lib.config.extension_无名美化_gjrc;
	if (gjrcName && gjrcName != "off") {
		let gjrcArr = ["biaoqijiangjun", "dajiangjun", "dasima", "guoduhu", "shangjiangjun"];
		window._WMMH_GJRC = {
			//手杀大元帅
			dayuanshuai: {
				name: `../../../无名美化/animation/globaltexiao/guanjieruchang/effect_youxikaishi_SSdys`,
			},
		};
		//十周年
		gjrcArr.forEach(name => {
			window._WMMH_GJRC[name] = {
				name: `../../../无名美化/animation/globaltexiao/guanjieruchang/SF_jinchang_eff_${name}`,
			};
		});
		//随机预加载
		if (gjrcName == "random" || gjrcName == "sznrandom") {
			let randomList = gjrcName == "random" ? [...gjrcArr, "dayuanshuai"] : gjrcArr;
			randomList.forEach(item => {
				dcdAnim.loadSpine(window._WMMH_GJRC[item].name, "skel", function () {
					dcdAnim.prepSpine(window._WMMH_GJRC[item].name);
				});
			});
		} else {
			//预加载指定
			dcdAnim.loadSpine(window._WMMH_GJRC[gjrcName].name, "skel", function () {
				dcdAnim.prepSpine(window._WMMH_GJRC[gjrcName].name);
			});
		}

		//
		lib.skill._wmmh_skill_gjrc = {
			trigger: { global: "gameStart", player: "enterGame" },
			forced: true,
			popup: false,
			silent: true,
			priority: Infinity,
			filter(event, player) {
				return get.mode() !== "taixuhuanjing" && game.me == player;
			},
			async content() {
				game.players.forEach(player => {
					let gjrcName = lib.config.extension_无名美化_gjrc;
					if (gjrcName == "sznrandom") {
						gjrcName = gjrcArr.randomGet();
					}
					if (gjrcName == "random") {
						gjrcName = [...gjrcArr, "dayuanshuai"].randomGet();
					}
					dcdAnim.loadSpine(window._WMMH_GJRC[gjrcName].name, "skel", function () {
						dcdAnim.playSpine(window._WMMH_GJRC[gjrcName], {
							parent: player,
							scale: gjrcName == "dayuanshuai" ? 0.25 : 0.5,
							speed: 1.2,
						});
					});
				});
				await game.delay(0, 800);
			},
		};
	}

	if (lib.config.extension_无名美化_nisiwohuo && get.mode() != "taixuhuanjing") {
		Object.assign(lib.skill.nisiwohuo_end, {
			async content(event, trigger, player) {
				if (ui._NISIWOHUO) {
					ui.anManagerCustZ.getAnimation("3.6").stopSpine(ui._NISIWOHUO);
					ui._NISIWOHUO = null;
				}
				if (ui._nswhBg) {
					document.body.removeChild(ui._nswhBg);
					ui._nswhBg = null;
				}
				game.broadcastAll(() => {
					if (_status.nisiwohuo?.length) {
						delete _status.nisiwohuo;
					}
				});
			},
		});
	}
}

//代码参考 眯咪狗  侵删
export function globalTool() {
	//二改眯咪狗ai选将 地主选将可以有地主技能了
	if (lib.config.extension_无名美化_AIReChoose) {
		lib.skill._wmmh_AIReChoose_ = {
			trigger: {
				global: "gameStart",
			},
			forced: true,
			silent: true,
			popup: false,
			priority: 999,
			firstDo: true,
			filter(event, player) {
				return player === game.me && ["identity", "doudizhu", "versus"].contains(lib.config.mode);
			},
			async content(event, trigger, player) {
				await lib.skill._wmmh_AIReChoose_.chooseCharater(player);
			},
			async chooseCharater(player) {
				let { result } = await player.chooseTarget("请选择一名角色并替换其武将牌", lib.filter.all).set("ai", function (target) {
					return 0;
				});

				if (result.bool) {
					console.log(result.targets[0].skills);
					let feiyang = false,
						bahu = false;
					if (result.targets[0].skills.includes("feiyang")) {
						feiyang = true;
					}
					if (result.targets[0].skills.includes("bahu")) {
						bahu = true;
					}
					var dialog = ui.create.characterDialog("heightset");
					var select = [1];
					var result2 = await player.chooseButton(dialog, select).forResult();
					if (result2.bool) {
						lib.element.player.uninit.apply(result.targets[0]);
						lib.element.player.init.apply(result.targets[0], [result2.links[0]]);
						let arterSkill = result.targets[0].skills;
						if (feiyang && !arterSkill.includes("feiyang")) {
							result.targets[0].addSkill("feiyang");
						}
						if (bahu && !arterSkill.includes("bahu")) {
							result.targets[0].addSkill("bahu");
						}
						await lib.skill._wmmh_AIReChoose_.chooseCharater(player);
					}
				}
			},
		};
	}
	if (lib.config.extension_无名美化_wmluckyCards) {
		lib.skill._wmmh_luckyCards = {
			trigger: {
				global: "gameDrawAfter",
			},
			filter: function (event, player) {
				return player == game.me;
			},
			forced: true,
			silent: true,
			popup: false,
			priority: 999,
			firstDo: true,
			async content(event, trigger, player) {
				const {
					result: { control },
				} = await player
					.chooseControl("确定", "取消")
					.set("prompt", "是否发动定向手气卡")
					.set("ai", () => 1);
				if (control == "取消") {
					return;
				}
				var gainCards = [];
				while (true) {
					var list = [];
					var count = player.countCards("h") - gainCards.length;
					if (count <= 0) {
						break;
					}
					for (var i = 0; i < lib.inpile.length; i++) {
						var name = lib.inpile[i];
						var type = get.type(name);
						list.push([type, "", name]);
						if (lib.card[name].nature !== undefined && lib.card[name].nature.length > 0) {
							for (var j of lib.inpile_nature) list.push([type, "", name, j]);
						}
					}
					var next = player.chooseButton(["定向手气卡", [list, "vcard"]], 1);
					next.set("filterButton", function (button) {
						var n = [];
						var cardPile = Array.from(ui.cardPile.childNodes);
						for (var c = 0; c < cardPile.length; c++) {
							if (cardPile[c].name == button.link[2]) {
								n.push(cardPile[c].name);
							}
							if (cardPile[c].nature == button.link[3]) {
								n.push(cardPile[c].nature);
							}
						}
						if (n.includes(button.link[2]) && n.includes(button.link[3])) return true;
					});
					var result = await next.forResult();
					if (result.bool) {
						var choice = result.links[0];
						var cardPile = Array.from(ui.cardPile.childNodes);
						var list = cardPile;
						var cards = [];
						for (let index = 0; index < list.length; index++) {
							const card = list[index];
							if (card.name == choice[2] && card.nature == choice[3]) cards.push(card);
						}
						var result2 = await player.chooseCardButton("定向手气卡", cards, [1, count]).forResult();
						if (result2.bool) {
							gainCards.addArray(result2.links);
							await game.cardsGotoOrdering(result2.links);
						}
					} else if (gainCards.length) {
						gainCards.addArray(get.cards(count));
						break;
					} else {
						break;
					}
				}
				if (cards && cards.length) {
					var cards = gainCards;
					var hs = player.getCards("h");
					for (var i = 0; i < hs.length; i++) {
						hs[i].discard(false);
					}
					player._start_cards = cards;
					player.directgain(cards);
				}
			},
		};
	}
	if (lib.config.extension_无名美化_wmViewHandcard) {
		lib.skill._wmmh_viewHandCards = {
			charlotte: true,
			ai: {
				viewHandcard: true,
			},
		};
	}
}
