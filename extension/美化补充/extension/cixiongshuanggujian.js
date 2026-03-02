import { lib, get, _status } from "../../../noname.js";

export function cixiongshuanggujian() {
	lib.skill.cixiong_skill = {
		equipSkill: true,
		audio: true,
		trigger: {
			player: "useCardToPlayered",
		},
		filter: function (event, player) {
			if (event.card.name != "sha") return false;
			return player.differentSexFrom(event.target);
		},
		check: function (event, player) {
			if (get.attitude(player, event.target) > 0) return true;
			var target = event.target;
			return target.countCards("h") == 0 || !target.hasSkillTag("noh");
		},
		logTarget: "target",
		content: function () {
			"step 0";
			if (!trigger.target.countCards("h")) {
				event._result = { index: 1 };
			} else {
				trigger.target
					.chooseControl("弃一张手牌", `令${get.translation(trigger.player)}摸一张牌`)
					.set("ai", () => {
						var trigger = _status.event.getTrigger();
						if (
							player.hasCard(function (card) {
								return -get.attitude(trigger.target, trigger.player) - get.value(card) - Math.max(0, 4 - trigger.target.hp) * 2;
							})
						)
							return 0;
						return 1;
					})
					.set(
						"prompt",
						`${get.translation(trigger.player)}的${get.translation(event.name)}被触发，确定弃置1张手牌，或取消令对手摸1张牌`
					);
			}
			"step 1";
			if (result.index == 1) {
				player.draw();
			} else {
				trigger.target.chooseToDiscard("h", true);
			}
		},
	};
}
