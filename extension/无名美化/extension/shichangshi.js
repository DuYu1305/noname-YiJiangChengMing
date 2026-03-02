import { lib, game, ui, get, ai, _status } from "../../../noname.js";

export function initSCSCss() {
	lib.init.css(lib.assetURL + "extension/无名美化/css", "shichangshi");
}
export function mbshichangshi() {
	window._MBSHICHANGSHI = {
		name: "十常侍美化",
		url: lib.assetURL + "extension/无名美化",
		scs_bagua: {
			name: "../../../无名美化/animation/shichangshi/SS_scs_bagua",
		}, //十常侍八卦
		scs_bgf: {
			name: "../../../无名美化/animation/shichangshi/SS_scs_bgfw",
			speed: 1.7,
		}, //十常侍八卦符
		scs_qjf: {
			name: "../../../无名美化/animation/shichangshi/SS_scs_bgrw",
		}, //十常侍全家福
		scs_fuhuo: {
			name: "../../../无名美化/animation/shichangshi/Ss_BuSi_JueSe",
		},
		scs_obj: {
			scs_zhangrang: "huo10",
			scs_zhaozhong: "huo9",
			scs_sunzhang: "huo7",
			scs_bilan: "huo3",
			scs_xiayun: "huo2",
			scs_hankui: "huo1",
			scs_lisong: "huo5",
			scs_duangui: "huo8",
			scs_guosheng: "huo6",
			scs_gaowang: "huo4",
		},
	};
	// Object.assign(lib.skill.mbdanggu,{
	// 	init(player){
	//      //十常侍动皮兼容
	// 		player.doubleAvatar=true;
	// 	}
	// })
	lib.skill.mbmowang.content = async function (event, trigger, player) {
		if (event.triggername == "rest") {
			game.broadcastAll(
				function (player, list) {
					if (list.includes(player.name1) || player.name1 == "shichangshi") {
						player.smoothAvatar(false);
						player.skin.name = player.name1 + "_dead";
						player.node.avatar.setBackground(player.name1 + "_dead", "character");
					}
					if (list.includes(player.name2) || player.name2 == "shichangshi") {
						player.smoothAvatar(true);
						player.skin.name2 = player.name2 + "_dead";
						player.node.avatar2.setBackground(player.name2 + "_dead", "character");
					}
				},
				player,
				lib.skill.mbdanggu.changshi.map(i => i[0])
			);
		}
		else if (event.triggername == "dieAfter") {
			if (player.getStorage("mbdanggu").length) {
				game.broadcastAll(function () {
					if (lib.config.background_speak) {
						game.playAudio("die", "shichangshiRest");
					}
				});
				await player.rest({ type: "round", count: 1 });
			}
		}
		else {
			if (player.isRest()) {
				trigger.cancel();
			} else {
				var mbdangguStorage = player.getStorage("mbdanggu");
				if (mbdangguStorage && Array.isArray(mbdangguStorage)) {
					player.logSkill("mbmowang");

					game.pause();
					var over = !mbdangguStorage.length;
					if (over) game.playAudio("../extension/无名美化/audio/shichangshi/longerDisappear.mp3");
					else game.playAudio("../extension/无名美化/audio/shichangshi/shortDisappear.mp3");
					if (!ui.scsBg) {
						var scsBg = document.createElement("div");
						scsBg.classList.add("scsBg");
						scsBg.style.cssText = `
							display: block;
							position: absolute;
							top: 0;
							left: 0;
							width: 100%;
							height: 100%;
							background-image: url("${lib.assetURL}extension/无名美化/image/shichangshi/scsbg.jpg");
							background-repeat: no-repeat;
							background-size: 100% 100%;
							z-index: 13;
							transition: all 0.5s ease-in-out;
						`;
						ui.scsBg = scsBg;
						document.body.appendChild(scsBg);
					}
					ui.scsBg.style.display = "block";
					player._siwangtexiao = [];
					dcdAnim.loadSpine(window._MBSHICHANGSHI.scs_bagua.name, "skel", function () {
						window._MBSHICHANGSHI.scs_bagua.action = "play1";
						dcdAnim.playSpine(window._MBSHICHANGSHI.scs_bagua, {
							speed: 1,
							scale: lib.device ? 0.8 : 1,
						});
					});
					setTimeout(function () {
						dcdAnim.loadSpine(window._MBSHICHANGSHI.scs_bagua.name, "skel", function () {
							window._MBSHICHANGSHI.scs_bagua.action = "play2";
							var pan = dcdAnim.playSpine({
								...window._MBSHICHANGSHI.scs_bagua,
								loop: true,
							}, {
								speed: 1,
								scale: lib.device ? 0.8 : 1,
							});
							player._siwangtexiao.push(pan);
							dcdAnim.loadSpine(window._MBSHICHANGSHI.scs_bgf.name, "skel", function () {
								window._MBSHICHANGSHI.scs_bgf.action = "play";
								var bg = dcdAnim.playSpine({
									...window._MBSHICHANGSHI.scs_bgf,
									loop: true,
								}, {
									scale: lib.device ? 0.8 : 1,
									speed: 1,
								});
								player._siwangtexiao.push(bg);
							});
							var all = lib.skill.mbdanggu.changshi.map(lst => lst[0]);
							var have = mbdangguStorage;
							var lose = all.filter(item => !have.includes(item));
							for (var name of lose) {
								if (name in window._MBSHICHANGSHI.scs_obj) {
									var anim = dcdAnim.playSpine({
										...window._MBSHICHANGSHI.scs_bagua,
										action: window._MBSHICHANGSHI.scs_obj[name],
										loop: true,
									}, {
										scale: lib.device ? 0.8 : 1,
										speed: 1,
									});
									player._siwangtexiao.push(anim);
								}
							}
						});
					}, 1000);
					setTimeout(function () {
						dcdAnim.loadSpine(window._MBSHICHANGSHI.scs_bagua.name, "skel", function () {
							for (var anim of player._siwangtexiao) {
								dcdAnim.stopSpine(anim);
								anim = undefined;
							}
							window._MBSHICHANGSHI.scs_bagua.action = "play3";
							dcdAnim.playSpine({
								...window._MBSHICHANGSHI.scs_bagua,
								loop: false,
							}, {
								speed: 1,
								scale: lib.device ? 0.8 : 1,
							});
						});
						if (over) {
							dcdAnim.loadSpine(window._MBSHICHANGSHI.scs_qjf.name, "skel", function () {
								dcdAnim.playSpine(window._MBSHICHANGSHI.scs_qjf, {
									speed: 1,
									scale: 1,
									loop: false,
								});
							});
							setTimeout(() => {
								ui.scsBg.style.display = "none";
								game.resume();
							}, 2000);
						} else {
							ui.scsBg.style.display = "none";
							game.resume();
						}
					}, 4500);

					trigger.excludeMark.add("mbdanggu");
					trigger.noDieAudio = true;
					if (!over) {
						trigger.reserveOut = true;
					}
				} else {
					player.changeSkin("mbmowang", "shichangshi_dead");
				}
			}
		}
	};
	if (lib.skill.mbmowang.subSkill && lib.skill.mbmowang.subSkill.return) {
		Object.assign(lib.skill.mbmowang.subSkill.return, {
			async content(event, trigger, player) {
				dcdAnim.loadSpine(window._MBSHICHANGSHI.scs_fuhuo.name, "skel", function () {
					dcdAnim.playSpine(window._MBSHICHANGSHI.scs_fuhuo, {
						scale: 1,
						speed: 1,
						loop: false,
						parent: player,
					});
				});

				game.broadcastAll(function (player) {
					if (player.name1 == "shichangshi") {
						player.smoothAvatar(false);
						player.node.avatar.setBackground(player.name1, "character");
						if (!lib.skill.mbdanggu.isSingleShichangshi(player)) {
							player.skin.name = player.name1;
						}
					}
					if (player.name2 == "shichangshi") {
						player.smoothAvatar(true);
						player.node.avatar2.setBackground(player.name2, "character");
						if (!lib.skill.mbdanggu.isSingleShichangshi(player)) {
							player.skin.name2 = player.name2;
						}
					}
				}, player);

				delete player.storage.mbdanggu_current;
				if (lib.skill.mbdanggu.isSingleShichangshi(player)) {
					game.broadcastAll(function (player) {
						player.name1 = player.name;
						player.skin.name = player.name;
						player.smoothAvatar(false);
						player.node.avatar.setBackground(player.name, "character");
						player.node.name.innerHTML = get.slimName(player.name);
						delete player.name2;
						delete player.skin.name2;
						player.classList.remove("fullskin2");
						player.node.avatar2.classList.add("hidden");
						player.node.name2.innerHTML = "";
						if (player == game.me && ui.fakeme) {
							ui.fakeme.style.backgroundImage = player.node.avatar.style.backgroundImage;
						}
					}, player);
				}
				const next = game.createEvent("mbdanggu_clique");
				next.player = player;
				next.setContent(lib.skill.mbdanggu.contentx);
				await next;
				await player.draw();
			},
		});
	}
}
