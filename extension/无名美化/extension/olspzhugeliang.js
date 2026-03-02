import { lib, game, ui, get, ai, _status } from "../../../noname.js";

export function olspzhugeliang() {
	window.HuoGongKuang = {
		name: "无名美化",
		url: lib.assetURL + "extension/无名美化",
		huoqiu_zhanchangbeijing: {
			name: "../../../无名美化/animation/huogongkuang/huoqiu_zhanchangbeijing",
			loop: false,
		},
	};

	Object.assign(lib.skill.olhuoji, {
		huogongContent() {
			"step 0";
			if (target.countCards("h") == 0) {
				event.finish();
				return;
			}
			event._result = { cards: target.getCards("h").randomGets(1) };
			("step 1");
			dcdAnim.loadSpine(HuoGongKuang.huoqiu_zhanchangbeijing.name, "skel", function () {
				//火攻战场特效
				event.huoqiu = dcdAnim.loopSpine(HuoGongKuang.huoqiu_zhanchangbeijing, { speed: 1, scale: 1.0, x: [0, 0.5], y: [0, 0.5] });
			});
			target.showCards(result.cards).setContent(function () {});
			event.dialog = ui.create.dialog(get.translation(target) + "展示的手牌", result.cards);
			event.videoId = lib.status.videoId++;

			game.broadcast("createDialog", event.videoId, get.translation(target) + "展示的手牌", result.cards);
			game.addVideo("cardDialog", null, [get.translation(target) + "展示的手牌", get.cardsInfo(result.cards), event.videoId]);
			event.card2 = result.cards[0];
			game.log(target, "展示了", event.card2);
			event._result = {};
			player
				.chooseToDiscard({ color: get.color(event.card2) }, "h", function (card) {
					var evt = _status.event.getParent();
					if (get.damageEffect(evt.target, evt.player, evt.player, "fire") > 0) {
						return 7 - get.value(card, evt.player);
					}
					return -1;
				})
				.set("prompt", false);
			game.delay(2);
			("step 2");
			dcdAnim.stopSpine(event.huoqiu);
			if (result.bool) {
				target.damage("fire");
			} else {
				target.addTempSkill("huogong2");
			}
			event.dialog.close();
			game.addVideo("cardDialog", null, event.videoId);
			game.broadcast("closeDialog", event.videoId);
		},
	});
	Object.assign(lib.card.huogong, {
		init() {
			dcdAnim.loadSpine(HuoGongKuang.huoqiu_zhanchangbeijing.name, "skel", function () {
				//火攻战场特效
				dcdAnim.prepSpine(HuoGongKuang.huoqiu_zhanchangbeijing.name);
			});
		},
		contentBefore() {
			//火攻战场特效
			window.HuoGongKuang.hgan = dcdAnim.loopSpine(HuoGongKuang.huoqiu_zhanchangbeijing, { speed: 1.2, scale: 1.0, x: [0, 0.5], y: [0, 0.5] });
			window.HuoGongKuang.hgan.oncomplete = () => {
				if (window.HuoGongKuang.hgan) {
					dcdAnim.stopSpine(window.HuoGongKuang.hgan);
					window.HuoGongKuang.hgan = undefined;
				}
			};
		},
		contentAfter() {
			if (window.HuoGongKuang.hgan) {
				try {
					dcdAnim.stopSpine(window.HuoGongKuang.hgan);
				} catch (error) {
					console.error("Error stopping spine animation:", error);
				}
			}
		},
	});
}
