import { lib, game, ui, get, ai, _status } from "../../../noname.js";

export function huancaoang() {
	//代码来自扶苏 感谢
	window._HUANCAOANG = {
		SSHW_ruhuan_ruhuan: {
			loop: true,
			name: "../../../无名美化/animation/huanzhugeliang/SSHW_ruhuan_ruhuan",
		},
		SSHW_caoang_huangse: {
			name: "../../../无名美化/animation/huancaoang/SSHW_caoang_huangse",
		},
		SSHW_caoang_zise: {
			name: "../../../无名美化/animation/huancaoang/SSHW_caoang_zise",
		},
	};
	Object.assign(lib.skill.twfuxi, {
		async content(event, trigger, player) {
			const { cost_data: choices } = event,
				num = choices.length,
				history = player.getAllHistory("useSkill", evt => evt.skill == event.name);
			const skills = ["twchihui", "twfuxi"];
			if (history.length) {
				history[history.length - 1][event.name + "_num"] = num;
			}
			if (choices.includes("twchihui")) {
				game.log(player, "选择了", "#y选项一");
				skills.remove("twchihui");
			}
			if (choices.includes("draw")) {
				game.log(player, "选择了", "#y选项二");
				await player.drawTo(Math.min(player.maxHp, 5));
			}
			if (choices.includes("enable")) {
				game.log(player, "选择了", "#y选项三");
				const list = Array.from({ length: 5 })
					.map((_, i) => `equip${i + 1}`)
					.filter(i => player.hasDisabledSlot(i));
				await player.enableEquip(list);
			}
			await player.recoverTo(player.maxHp);
			game.delay(0, 2700);
			dcdAnim.loadSpine(window._HuanZhuGeLiang.SSHW_ruhuan_ruhuan.name, "skel", function () {
				player.storage._huancaoang_ = dcdAnim.playSpine(window._HuanZhuGeLiang.SSHW_ruhuan_ruhuan, "skel", {
					speed: 1,
					scale: lib.device ? 0.8 : 1,
					x: [0, 0.5],
					y: [0, 0.5],
				});
			});
			dcdAnim.loadSpine(window._HUANCAOANG.SSHW_caoang_zise.name, "skel", function () {
				dcdAnim.playSpine(window._HUANCAOANG.SSHW_caoang_zise.name, {
					speed: 1,
					scale: 0.9,
					x: [0, 0.5],
					y: [0, 0.5],
				});
			});
			player.changeSkin({ characterName: "huan_caoang" }, "huan_caoang_shadow");
			if (lib.config.extension_无名美化_huancaoang_qiepi) {
				try {
					game.qhly_changeDynamicSkin(player.name, "穿时寻冀");
				} catch (error) { }
			}
			await player.changeSkills(["twhuangzhu", "twliyuan", "twjifa"], skills);
		},
	});
	Object.assign(lib.skill.twjifa, {
		async content(event, trigger, player) {
			const num = player.getAllHistory("useSkill", evt => evt.skill == "twfuxi")?.lastItem?.twfuxi_num;
			if (num > 0) {
				await player.loseMaxHp(num);
			}
			const control = await player
				.chooseControl(["twhuangzhu", "twliyuan"])
				.set("prompt", "选择保留的技能")
				.set("ai", () => {
					return get.event().controls.randomGet();
				})
				.forResultControl();
			await player.recoverTo(player.maxHp);
			game.delay(0, 2700);
			if (player.storage._huancaoang_) {
				dcdAnim.stopSpine(player.storage._huancaoang_);
				delete player.storage._huancaoang_;
			}
			dcdAnim.loadSpine(window._HUANCAOANG.SSHW_caoang_huangse.name, "skel", function () {
				dcdAnim.playSpine(window._HUANCAOANG.SSHW_caoang_huangse.name, {
					speed: 1,
					scale: 0.9,
					x: [0, 0.5],
					y: [0, 0.5],
				});
			});
			player.changeSkin({ characterName: "huan_caoang" }, "huan_caoang");
			if (lib.config.extension_无名美化_huancaoang_qiepi) {
				try {
					game.qhly_changeDynamicSkin(player.name, "经典形象");
				} catch (error) { }
			}
			await player.changeSkills(["twchihui", "twfuxi"], ["twhuangzhu", "twliyuan", "twjifa"].remove(control));
		},
	});
}
