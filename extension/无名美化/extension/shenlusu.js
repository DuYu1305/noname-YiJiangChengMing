import { lib, game, ui, get, ai, _status } from "../../../noname.js";

export function shenlusu() {
	window._SHENLUSU = {
		shenlusu: {
			name: "../../../无名美化/animation/shenlusu/SS_jn_shenlusu",
			speed: 0.8,
		},
		slswj1: {
			name: "../../../无名美化/animation/shenlusu/Ss_Slusu_wujiang",
		},
		slswj2: {
			name: "../../../无名美化/animation/shenlusu/Ss_Slusu_wujiang2",
		},
		slswj3: {
			name: "../../../无名美化/animation/shenlusu/Ss_Slusu_wujiang3",
			speed: 0.3,
		},
	};
	Object.assign(lib.skill.tamo, {
		getTargets() {
			return game.filterPlayer(current => {
				console.log("current", current.seat);
				if (get.mode() == "doudizhu") {
					return current.seat != 3;
				}
				return !current.isZhu2();
			});
		},
		async content(event, trigger, player) {
			const toSortPlayers = get.info(event.name).getTargets();
			toSortPlayers.sortBySeat(game.findPlayer2(current => current.getSeatNum() == 1, true));
			const next = player.chooseToMove("榻谟：是否分配" + (get.mode() != "doudizhu" ? (game.hasPlayer(cur => cur.isZhu2()) ? "除主公外" : "") : "除三号位") + "所有角色的座次？");
			next.set("list", [["（以下排列的顺序即为发动技能后角色的座次顺序）", [toSortPlayers.map(i => `${i.getSeatNum()}|${i.name}`), lib.skill.tamo.$createButton]]]);
			next.set("toSortPlayers", toSortPlayers.slice(0));
			next.set("processAI", () => {
				const players = get.event()["toSortPlayers"],
					player = get.player();
				players.randomSort().sort((a, b) => get.attitude(player, b) - get.attitude(player, a));
				return [players.map(i => `${i.getSeatNum()}|${i.name}`)];
			});
			const result = await next.forResult();
			const moved = result?.moved;
			const resultList = moved[0].map(info => {
				return parseInt(info.split("|")[0]);
			});
			const toSwapList = [];
			const cmp = (a, b) => {
				return resultList.indexOf(a) - resultList.indexOf(b);
			};
			for (let i = 0; i < toSortPlayers.length; i++) {
				for (let j = 0; j < toSortPlayers.length; j++) {
					if (cmp(toSortPlayers[i].getSeatNum(), toSortPlayers[j].getSeatNum()) < 0) {
						toSwapList.push([toSortPlayers[i], toSortPlayers[j]]);
						[toSortPlayers[i], toSortPlayers[j]] = [toSortPlayers[j], toSortPlayers[i]];
					}
				}
			}
			let scale = 1.25;
			if (lib.device) {
				scale = 1;
			}
			dcdAnim.loadSpine(window._SHENLUSU.shenlusu.name, "skel", function () {
				game.playAudio("../extension/无名美化/audio/tamo/tamotx.mp3");
				dcdAnim.playSpine(window._SHENLUSU.shenlusu, {
					scale: scale,
					speed: 0.8,
					x: [0, 0.5],
					y: [0, 0.5],
				});
			});
			await game.delay(14);
			game.broadcastAll(toSwapList => {
				for (const list of toSwapList) {
					game.swapSeat(list[0], list[1], false);
				}
			}, toSwapList);
			if (trigger.name === "phase" && !trigger.player.isZhu2() && trigger.player !== toSortPlayers[0] && !trigger._finished) {
				trigger.finish();
				trigger._triggered = 5;
				const evt = toSortPlayers[0].insertPhase();
				delete evt.skill;
				const evt2 = trigger.getParent();
				if (evt2.name == "phaseLoop" && evt2._isStandardLoop) {
					evt2.player = toSortPlayers[0];
				}
				//跳过新回合的phaseBefore
				evt.pushHandler("onPhase", (event, option) => {
					if (event.step === 0 && option.state === "begin") {
						event.step = 1;
					}
				});
			}
			await game.delay();
		},
	});
}
