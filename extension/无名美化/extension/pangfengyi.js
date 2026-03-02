import { lib, game, ui, get, ai, _status } from "../../../noname.js";

export function pangfengyi() {
	Object.assign(lib.skill.dcyitong, {
		async content(event, trigger, player) {
			const name = event.triggername,
				storage = player.getStorage("dcyitong"),
				suits = lib.suit
					.filter(suit => {
						if (name === "phaseBefore" || name === "enterGame") return !storage.includes(suit);
						if (!storage.includes(suit) || !trigger.getd?.().some(card => get.suit(card, false) === suit)) return false;
						return (
							game
								.getGlobalHistory("everything", evt => {
									if (evt.name !== "cardsDiscard") return false;
									const evtx = evt.getParent();
									if (evtx.name !== "orderingDiscard") return false;
									const evt2 = evtx.relatedEvent || evtx.getParent();
									if (evt2.name != "useCard") return false;
									return evt.getd?.()?.some(card => get.suit(card, false) === suit);
								})
								.indexOf(trigger) === 0
						);
					})
					.reverse();
			if (name === "phaseBefore" || name === "enterGame") {
				const result =
					suits.length > 1
						? await player
								.chooseControl(suits)
								.set("ai", () => {
									return get.event().controls.randomGet();
								})
								.set("prompt", "异瞳：请记录一个花色")
								.forResult()
						: { control: suits[0] };
				const suit = result.control;
				if (suit) {
					var files = {
						spade: "heitao", // 黑桃
						heart: "hongtao", // 红桃
						club: "meihua", // 梅花
						diamond: "fangpian", // 方块
					};
					var aname = "../../../无名美化/animation/pangfengyi/pangfengyi_yanjing";
					dcdAnim.loadSpine(aname, "skel", function () {
						dcdAnim.playSpine(
							{ name: aname ,action: files[suit],},
							{
								
								scale: 0.75,
								speed: 0.8,
								parent: player,
							}
						);
					});
					player.markAuto("dcyitong", [suit]);
					player.addTip("dcyitong", get.translation("dcyitong") + player.getStorage("dcyitong").reduce((str, suit) => str + get.translation(suit), ""));
				}
			} else {
				let gains = [];
				for (const suitx of suits) {
					for (const suit of lib.suit.slice().reverse()) {
						if (suitx === suit) continue;
						const card = get.cardPile(card => get.suit(card) === suit && !gains.includes(card));
						if (card) gains.push(card);
					}
				}
				if (gains.length) await player.gain(gains, "gain2");
			}
		},
	});
}
