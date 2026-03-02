import { PlayCustomAnByVideo } from "../utils/utils.js";
import { lib, game, ui, get, ai, _status } from "../../../noname.js";

class LvBuPlay extends PlayCustomAnByVideo {
	setVideoStyle() {
		let mode = lib.config.extension_无名美化_molvbu;
		let commonStyle = `
			position: fixed;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			display:none;
			pointer-events: none;
		`;
		if (mode == "default") {
			commonStyle += `
				z-index: 14;
				width: auto;
				max-width: 100%;
				height: 65%;
			`;
		} else if (mode == "background") {
			commonStyle += `
				width: 100%;
				height: auto;
				z-index: 2;
			`;
		}
		this.video.style.cssText = commonStyle;
	}
	play() {
		// 重置播放位置并显示视频
		// this.video.style.visibility = "visible";
		this.video.style.display = "block";
		this.video.currentTime = 0;
		this.video.muted = false; // 取消静音
		this.video.play();
	}
}
export function molvbu() {
	Object.assign(lib.skill.olkuangmo, {
		init() {
			ui.molvbu = new LvBuPlay(
				{
					// SS_cmmask: {
					// 	name: "../../../无名美化/animation/mosimayi/SS_cmmask",
					// 	speed: 0.8,
					// 	loop: true,
					// 	scale: 1.5,
					// },
					video: `${lib.assetURL}extension/无名美化/video/molvbu.mp4`,
				},
				false
			);
		},
		async content(event, trigger, player) {
			player.addSkill("olrumo");
			const target = event.targets[0];
			const name = event.name + "_effect";
			player.markAuto(name, target);
			target.markAuto(name, player);
			player.addTip(name, "狂：" + player.getStorage(name).map(targetx => get.translation(targetx)));
			target.addTip(name, "狂：" + target.getStorage(name).map(targetx => get.translation(targetx)));
			target.addSkill(name);
			player.addSkill(name);
			ui.molvbu.run();
		},
	});
}
