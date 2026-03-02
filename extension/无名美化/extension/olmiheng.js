import { lib, game, ui, get, ai, _status } from "../../../noname.js";
import { NewAnimation4 } from "../utils/NewAnimation4.js";

export function olmiheng() {
	window._OLMIHENG = {
		url: lib.assetURL + "extension/无名美化",
		gu: {
			name: lib.assetURL + "extension/无名美化/animation/olmiheng/gu/OL_fx_duiju_miheng_dagu",
			version: "4.0",
		},
		bang: {
			name: lib.assetURL + "extension/无名美化/animation/olmiheng/bang/OL_fx_duiju_miheng_dagu",
			version: "4.0",
		},
	};
	Object.assign(lib.skill.olfeibian.subSkill, {
		dagu: {
			charlotte: true,
			forced: true,
			popup: false,
			firstDo: true,
			trigger: { player: "phaseUseBefore" },
			content(event, trigger, player) {
				ui.orgMusicSrc = lib.config.background_music;
				lib.config.background_music = `ext:无名美化/audio/fx_duiju_miheng/Skill_MiHeng [1].mp3`;
				game.playBackgroundMusic();
				ui.anManagerCustZ.loadAndPlay(window._OLMIHENG.gu);
				ui.anManagerCustZ.loadAndPlay(window._OLMIHENG.bang);
				setTimeout(() => {
					//考虑特殊情况 播放之前先清空上次的动画 防止特效重复
					if (ui._OLMIHENGGU) {
						ui.anManagerCustZ.getAnimation("4.0").stopSpine(ui._OLMIHENGGU);
					}
					if (ui._OLMIHENGBANG) {
						ui.anManagerCustZ.getAnimation("4.0").stopSpine(ui._OLMIHENGBANG);
					}
					lib.config.background_music = `ext:无名美化/audio/fx_duiju_miheng/Skill_MiHeng [2].mp3`;
					game.playBackgroundMusic();
					ui.anManagerCustZ.loadAndPlay(
						window._OLMIHENG.gu,
						node => {
							ui._OLMIHENGGU = node;
						},
						null,
						{ loop: true, action: "play2" }
					);
					ui.anManagerCustZ.loadAndPlay(
						window._OLMIHENG.bang,
						node => {
							ui._OLMIHENGBANG = node;
						},
						null,
						{ loop: true, action: "play2" }
					);
				}, 2000);
			},
		},
		daguend: {
			charlotte: true,
			forced: true,
			popup: false,
			firstDo: true,
			trigger: { player: ["phaseUseEnd", "phaseEnd"] },
			content(event, trigger, player) {
				if (ui.orgMusicSrc) {
					lib.config.background_music = ui.orgMusicSrc;
					game.playBackgroundMusic();
				}
				if (ui._OLMIHENGGU) {
					ui.anManagerCustZ.getAnimation("4.0").stopSpine(ui._OLMIHENGGU);
					ui._OLMIHENGGU = null;
				}
				if (ui._OLMIHENGBANG) {
					ui.anManagerCustZ.getAnimation("4.0").stopSpine(ui._OLMIHENGBANG);
					ui._OLMIHENGBANG = null;
				}
			},
		},
	});
	Object.assign(lib.skill.olfeibian, {
		async content(event, trigger, player) {
			const target = trigger.player;
			const cards = target.getDiscardableCards(target, "h");
			if (cards.length) await target.discard(cards.randomGets(1));
			const info = target.forceCountChoose;
			if (_status.countDown) return;
			let time;
			if (typeof info?.["chooseToUse"] === "number") time = info["chooseToUse"];
			else if (typeof info?.default === "number") time = info.default;
			else {
				if (!_status.connectMode) return;
				time = lib.configOL.choose_timeout;
			}
			if (time) {
				time = parseInt(time);
				if (time > 1) {
					time--;
					target.addTempSkill("olfeibian_time", "roundStart");
					target.addMark("olfeibian_time", 1, false);
					game.broadcastAll(
						(player, time) => {
							lib.skill.olfeibian.changeAnAndMusic(time);
							if (!player.forceCountChoose) player.forceCountChoose = {};
							player.forceCountChoose.chooseToUse = time;
						},
						target,
						time
					);
					game.log(target, "出牌时限", "#y-1s");
				}
			}
		},
		changeAnAndMusic(time) {
			if (ui._OLMIHENGGU && ui._OLMIHENGBANG) {
				let music = lib.config.background_music;
				if (time > 5 && time <= 10 && !music.includes("[3]")) {
					lib.config.background_music = `ext:无名美化/audio/fx_duiju_miheng/Skill_MiHeng [3].mp3`;
					game.playBackgroundMusic();
					ui._OLMIHENGGU.setAction("play3");
					ui._OLMIHENGBANG.setAction("play3");
				}
				if (time <= 5 && !music.includes("[4]")) {
					lib.config.background_music = `ext:无名美化/audio/fx_duiju_miheng/Skill_MiHeng [4].mp3`;
					game.playBackgroundMusic();
					ui._OLMIHENGGU.setAction("play4");
					ui._OLMIHENGBANG.setAction("play4");
				}
			}
		},
		init() {
			if (!ui.anManagerCustZ) {
				let an4 = new NewAnimation4("", document.body, "decadeUI-canvas4");
				an4.canvas.style["z-index"] = 3;
				ui.anManagerCustZ = an4.anManager;
			}
			game.broadcastAll(() => {
				const countDown = game.countDown;
				if (typeof countDown !== "function") return;
				game.countDown = function (time, onEnd) {
					const newOnEnd = () => {
						const event = get.event();
						if (event?.name === "chooseToUse" && event.player?.isIn()) event.player.addTempSkill("olfeibian_effect");
						if (typeof onEnd === "function") onEnd();
					};
					return countDown.call(this, time, newOnEnd);
				};
			});
		},
	});
	lib.skill.olfeibian.group.push("olfeibian_dagu", "olfeibian_daguend");
}
