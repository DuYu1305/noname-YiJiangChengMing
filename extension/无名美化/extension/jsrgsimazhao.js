import { lib, game, ui, get, ai, _status } from "../../../noname.js";

export function jsrgsimazhao() {
	window._JSRGSIMAZHAO = {
		SS_smz_fadongjineng: {
			name: "../../../无名美化/animation/jsrgsimazhao/SS_smz_fadongjineng",
		},
	};
	Object.assign(lib.skill.jsrgzhaoxiong, {
		content: async function (event, trigger, player) {
			"step 0";
			player.awakenSkill("jsrgzhaoxiong");
			dcdAnim.loadSpine(window._JSRGSIMAZHAO.SS_smz_fadongjineng.name, "skel", function () {
				game.playAudio("../extension/无名美化/animation/jsrgsimazhao/audio/effect_simazhao_skill.mp3");
				dcdAnim.playSpine(window._JSRGSIMAZHAO.SS_smz_fadongjineng, {
					scale: 0.9,
					speed: 1,
				});
			});
			await game.delay(0, 3300);
			("step 1");
			player.changeSkin({ characterName: "jsrg_simazhao" }, "jin_jsrg_simazhao");

			if (lib.config.extension_无名美化_msmzdpqh) {
				try {
					game.qhly_changeDynamicSkin(player.name, "经典形象");
				} catch (error) {}
			}
			await player.changeGroup("jin");
			await player.changeSkills(["jsrgweisi", "jsrgdangyi"], ["jsrgqiantun"]);
		},
	});

	Object.assign(lib.skill.mbzhaoxiong, {
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
            dcdAnim.loadSpine(window._JSRGSIMAZHAO.SS_smz_fadongjineng.name, "skel", function () {
				game.playAudio("../extension/无名美化/animation/jsrgsimazhao/audio/effect_simazhao_skill.mp3");
				dcdAnim.playSpine(window._JSRGSIMAZHAO.SS_smz_fadongjineng, {
					scale: 0.9,
					speed: 1,
				});
			});
			player.changeSkin({ characterName: "mb_simazhao" }, "jin_jsrg_simazhao");
			if (lib.config.extension_无名美化_msmzdpqh) {
				try {
					game.qhly_changeDynamicSkin(player.name, "经典形象");
				} catch (error) {}
			}
			await game.delay(0, 3300);
			await player.changeGroup("qun");
			//player.node.name.dataset.nature = get.groupnature("jin");
			await player.addSkills("mbdangyi");
		},
	});
}
