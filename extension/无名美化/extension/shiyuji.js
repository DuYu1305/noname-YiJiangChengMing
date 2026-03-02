import { lib, game, ui, get, ai, _status } from "../../../noname.js";

export function shiyuji() {
	window._SHIYUJI = {
		SS_pve_KaLiuShuigx: {
			name: "../../../无名美化/animation/shiyuji/SS_pve_KaLiuShuigx",
		},
		SS_pve_WJLiuShuigx: {
			name: "../../../无名美化/animation/shiyuji/SS_pve_WJLiuShuigx",
		},
		SS_pve_YJChuChang: {
			name: "../../../无名美化/animation/shiyuji/SS_pve_YJChuChang",
		},
		SS_pve_YJChuChangKuang: {
			name: "../../../无名美化/animation/shiyuji/SS_pve_YJChuChangKuang",
		},
	};
	Object.assign(lib.skill.potfuji, {
		async content(event, trigger, player) {
			const { targets, cards: links } = event;
			await player.showCards(links, get.translation(player) + "发动了【" + get.translation(event.name) + "】");
			const gain_list = targets.map((target, i) => [target, [links[i]]]);
			await game
				.loseAsync({
					gain_list: gain_list,
					player: player,
					cards: links,
					giver: player,
					animate: "give",
					gaintag: ["potfuji"],
				})
				.setContent("gaincardMultiple");
			for (const list of gain_list) {
				list[0].addSkill("potfuji_effect");
			}

			console.log("gain_list", gain_list);
			//---------修改原技能开始
			if (gain_list && gain_list.length) {
				let potfujiCards = player.storage.potfujiCards || [];
				gain_list.forEach(item => {
					let cards = item[1];
					if (cards && cards.length) {
						cards.forEach(card => {
							potfujiCards.push(card);
						});
					}
				});
				player.storage.potfujiCards = potfujiCards;
				console.log("potfujiCards", potfujiCards);
			}

			if (player.isMinHandcard()) {
				//---------修改原技能开始
				dcdAnim.loadSpine(window._SHIYUJI.SS_pve_YJChuChangKuang.name, "skel", function () {
					dcdAnim.playSpine(window._SHIYUJI.SS_pve_YJChuChangKuang, {
						parent: document.body,
						speed: 0.8,
						scale: lib.device ? 0.9 : 1,
					});
				});
				dcdAnim.loadSpine(window._SHIYUJI.SS_pve_YJChuChang.name, "skel", function () {
					dcdAnim.playSpine(window._SHIYUJI.SS_pve_YJChuChang, {
						parent: player,
						// scale: lib.device ? 0.8 : 1,
						scale: 0.8,
					});
				});
				await game.delay(0, 1000);
				dcdAnim.loadSpine(window._SHIYUJI.SS_pve_WJLiuShuigx.name, "skel", function () {
					ui.SS_pve_WJLiuShuigx = dcdAnim.playSpine({
						...window._SHIYUJI.SS_pve_WJLiuShuigx,
						loop: true,
					}, {
						parent: player,
						loop: true,
						// scale: lib.device ? 0.8 : 1,
						scale: 0.8,
						y: [0, 0.55],
					});
				});
				//---------修改原技能结束
				player.logSkill("potfuji", null, null, null, [3]);
				player.changeSkin({ characterName: "pot_yuji" }, "pot_yuji_shadow");
				get.info(event.name).dynamic(player);
				await player.draw(2);
				player.addTempSkill(["potfuji_sha", "potfuji_shan"], { player: "phaseBegin" });
			}
			player
				.when({ player: ["phaseBegin"] })
				.assign({
					lastDo: true,
				})
				.then(() => {
					if (ui.SS_pve_WJLiuShuigx) {
						dcdAnim.stopSpine(ui.SS_pve_WJLiuShuigx);
						ui.SS_pve_WJLiuShuigx = null;
					}
					player.changeSkin({ characterName: "pot_yuji" }, "pot_yuji");
					game.broadcastAll(function (player) {
						if (player.node.potfuji_dynamic) {
							player.node.potfuji_dynamic.delete();
							player.node.potfuji_dynamic2.delete();
							delete player.node.potfuji_dynamic;
							delete player.node.potfuji_dynamic2;
						}
					}, player);
				});
		},
		playAn(card, player) {
			var fujicards = player.storage.potfujiCards;
			if (fujicards && fujicards.length && card && card.cardid) {
				let playCard = fujicards.find(item => item.cardid == card.cardid);
				if (playCard) {
					dcdAnim.loadSpine(window._SHIYUJI.SS_pve_KaLiuShuigx.name, "skel", function () {
						dcdAnim.playSpine(window._SHIYUJI.SS_pve_KaLiuShuigx, {
							speed: 1.2,
							parent: card,
							referFollow: true,
							scale: lib.device ? 0.7 : 0.85,
						});
					});
					player.storage.potfujiCards = [...fujicards.filter(item => item.cardid != playCard.cardid)];
				}
			}
		},
		group: ["potfuji_useFjCard"],
	});
	Object.assign(lib.skill.potfuji.subSkill, {
		useFjCard: {
			charlotte: true,
			forced: true,
			popup: false,
			firstDo: true,
			trigger: { global: ["loseAfter", "useCard", "phaseAfter", "cardsDiscardAfter", "loseAsyncAfter"] },
			content(event, trigger, player) {
				if (trigger && trigger.card) {
					console.log("trigger", trigger);
					lib.skill.potfuji.playAn(trigger.card, player);
				}
			},
		},
	});
}
