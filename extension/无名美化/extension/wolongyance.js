import { lib, game, ui, get, ai, _status } from "../../../noname.js";
import { createwo, WolongYanceAn, WoLongIcon } from "../utils/utils.js";
export function wolongyance() {
	lib.init.css(lib.assetURL + "extension/无名美化/css", "wolongyance");
	Object.assign(lib.skill.friendyance, {
		// ai: {
		// 	order: 10,
		// 	result: { player: 1 },
		//   },
		async minigame(event, trigger, player) {
			await event.trigger("friendyance_minigameBegin");
			if (typeof player.storage.friendyance !== "number") {
				let bool = player.hasSkill("friendzhugelianggongli") && get.info("friendgongli").isFriendOf(player, "friend_pangtong");
				player.addMark("friendyance", 3 + bool, false);
			}
			const num = player.countMark("friendyance");
			if (!num) return;
			player.addSkill("friendyance_record");
			const storage = player.storage["friendyance_record"];
			const {
				result: { control },
			} = await player
				.chooseControl("颜色预测", "类型预测")
				.set("prompt", "卧龙演策：请选择预测方式")
				.set("ai", () => get.rand(0, 1));
			const type = lib.inpile.map(c => get.type2(c)).unique();
			const color = Object.keys(lib.color);
			const list = [];
			if (control === "颜色预测") {
				list.addArray(color);
				storage[2] = "color";
			} else {
				list.addArray(type);
				storage[2] = "type2";
			}
			console.log("list", list);
			let links = [];
			//不会ai 所以人机玩的时候走原版无美化的方法 自己玩的时候才是美化的
			//有会ai的大佬可以联系我改下哈 感谢
			console.log("ai", game.me === player);
			if (game.me === player) {
				links = await createwo(num, storage[2]);
			} else {
				const dialog = ["卧龙演策：请进行你的预测"];
				for (const i of Array.from({ length: num }, (_, k) => k)) {
					const button = list.map(c => [`${c}_${i}`, get.translation(c)]);
					dialog.push(`<div class="text center">第${get.cnNumber(i + 1, true)}张牌的预测</div>`);
					dialog.push([button, "tdnodes"]);
				}
				console.log("dialog", dialog);
				const { result } = await player
					.chooseButton(dialog, get.select(num))
					.set("forced", true)
					.set("filterButton", button => {
						return parseInt(button.link.at(-1)) === ui.selected.buttons.length;
					})
					.set("ai", () => 1 + Math.random());
				links = result.links;
			}
			if (!links?.length) return;
			console.log("links", links);
			for (const i of links) {
				storage[1].push(i.replace(`_${i.at(-1)}`, ""));
			}
			storage[3] = links.length;

			await event.trigger("friendyance_minigame");

			ui.wolongicon = new WoLongIcon(links, player, storage[4]);
		},
	});
	Object.assign(lib.skill.friendyance.subSkill.check, {
		async content(event, trigger, player) {
			const storage = player.getStorage("friendyance_record");
			console.log("storage", storage);
			const num = trigger.name === "useCard" && storage[4] ? 1 : 0;
			if (trigger.name === "useCard") {
				const i = storage[1][storage[0].length];
				if (get[storage[2]](trigger.card) === i || (player.hasSkill("friendzhugelianggongli") && get.info("friendgongli").isFriendOf(player, "friend_xushu") && storage[0].length === 0)) {
					player.popup("预测正确", "wood");
					game.log(player, "预测", "#y正确");
					storage[0].push(true);
					if (storage.filter(b => b === true).length <= 5) {
						await player.draw();
					}
				} else {
					player.popup("预测错误", "fire");
					game.log(player, "预测", "#r错误");
					storage[0].push(false);
				}

				let resultList = storage[0];
				if (resultList.length) {
					ui.wolongicon.changeIcon(resultList.length - 1, resultList[resultList.length - 1]);
				}
			}
			if (trigger.name !== "useCard" || storage[0].length === storage[3]) {
				new WolongYanceAn(storage);

				const trueArr = storage[0].filter(b => b === true);

				if (trueArr.length === 0) {
					player.logSkill("friendyance", null, null, null, [4]);
					await player.loseHp(1 + num);
					player.removeMark("friendyance", 1 + num, false);
				}
				if (trueArr.length * 2 < storage[3]) {
					if (trueArr.length !== 0) player.logSkill("friendyance", null, null, null, [5]);
					if (player.hasCard(card => lib.filter.cardDiscardable(card, player), "he")) await player.chooseToDiscard(1 + num, "he", true);
					ui.wolongicon.clear();
				} else {
					player.logSkill("friendyance", null, null, null, [trueArr.length === storage[3] ? 7 : 6]);
					const choice = storage[2] == "color" ? Object.keys(lib.color) : lib.inpile.map(name => get.type2(name)).unique();
					const control =
						choice.length > 1
							? await player
									.chooseControl(choice)
									.set("ai", () => {
										return get.event().controls.remove("none").randomGet();
									})
									.set("prompt", `请选择获得牌的条件`)
									.forResult("control")
							: choice[0];
					let gains = [];
					while (gains.length < 1 + num) {
						const card = get.cardPile2(card => {
							if (gains.includes(card)) return false;
							return get[storage[2]](card) === control;
						});
						if (card) gains.push(card);
						else break;
					}
					ui.wolongicon.clear();
					if (gains.length) await player.gain(gains, "draw");
					else player.chat("一无所获");
					if (trueArr.length === storage[3]) {
						await player.draw(2 + num);
						if (player.countMark("friendyance") < 7) {
							player.addMark("friendyance", Math.min(7 - player.countMark("friendyance"), 1 + num), false);
						}
						if (storage[4] && storage[3] > 3) player.restoreSkill("friendfangqiu");
					}
				}
				player.removeSkill("friendyance_record");
			}
		},
	});

	// window.wolongan = null;
	// window.playwlyc = (num = 1,dev=false) => {
	// 	if (window.wolongan) {
	// 		window.wolongan.end();
	// 	}
	// 	switch (num) {
	// 		case 1:
	// 			window.wolongan = new WolongYanceAn([[true], ["basic"], "type2", num], dev);
	// 			break;
	// 		case 2:
	// 			window.wolongan = new WolongYanceAn([[true, false], ["basic", "equip"], "type2", num], dev);
	// 			break;
	// 		case 3:
	// 			window.wolongan = new WolongYanceAn([[true, false, true], ["basic", "trick", "equip"], "type2", num], dev);
	// 			break;
	// 		case 4:
	// 			window.wolongan = new WolongYanceAn([[true, false, true, false], ["basic", "trick", "equip"], "type2", num], dev);
	// 			break;
	// 		case 5:
	// 			window.wolongan = new WolongYanceAn([[true, false, true, false, true], ["basic", "trick", "equip"], "type2", num], dev);
	// 			break;
	// 		case 6:
	// 			window.wolongan = new WolongYanceAn([[true, false, true, false, true, false], ["basic", "trick", "equip"], "type2", num], dev);
	// 			break;
	// 		case 7:
	// 			window.wolongan = new WolongYanceAn([[true, false, true, false, true, false, true], ["basic", "trick", "equip"], "type2", num], dev);
	// 			break;
	// 		default:
	// 			break;
	// 	}
	// };

	// window._WMWOLONGYANCE = {
	// 	name: "无名美化",
	// 	url: lib.assetURL + "extension/无名美化",
	// 	bagua: {
	// 		name: "../../../无名美化/animation/wolongyance/SS_wolongyance_beitu",
	// 		speed: 0.8,
	// 		scale: 0.8,
	// 		loop: true,
	// 	},
	// 	kongqiu: {
	// 		name: "../../../无名美化/animation/wolongyance/SS_wolongyance_kongqiu",
	// 		speed: 0.8,
	// 		scale: 0.8,
	// 		loop: true,
	// 	},
	// 	shiti: {
	// 		name: "../../../无名美化/animation/wolongyance/SS_wolongyance_shiti",
	// 		speed: 0.8,
	// 		scale: 0.8,
	// 		loop: true,
	// 	},
	// 	qixing: {
	// 		name: "../../../无名美化/animation/wolongyance/SS_wolongyance_qixing",
	// 		speed: 0.8,
	// 		scale: 0.8,
	// 		loop: true,
	// 	},
	// };
	// window.playwlx = [0, 0.5];
	// window.playwly = [0, 0.5];
	// window.playwl = function (num) {
	// 	dcdAnim.loadSpine(window._WMWOLONGYANCE.qixing.name, "skel", function () {
	// 		window._WMWOLONGYANCE.qixing.action = "play" + num;
	// 		dcdAnim.playSpine(window._WMWOLONGYANCE.qixing);
	// 	});
	// };
	// window.playst = function (flag) {
	// 	dcdAnim.loadSpine(window._WMWOLONGYANCE.shiti.name, "skel", function () {
	// 		dcdAnim.playSpine(window._WMWOLONGYANCE.shiti, {
	// 			x: window.playwlx,
	// 			y: window.playwly,
	// 			loop: flag,
	// 		});
	// 	});
	// };
}
