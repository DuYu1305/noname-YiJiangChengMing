import { lib, game, ui, get, ai, _status } from "../../../noname.js";

export function mosunquan() {
	Object.assign(lib.skill.olqiangang, {
		async content(event, trigger, player) {
			player.addSkill("olrumo");
			await player.removeSkills("oltianen");
			player.addSkill(`${event.name}_effect`);
			game.playAudio("..", "extension", "无名美化/audio/mosunquan/Skill_MoSunQuan_3795_1.mp3");
			skinSwitch.chukuangWorkerApi.playEffect(
				{
					name: "../../../无名美化/animation/mosunquan/FX_MatchGame_mosunquan",
					version: "4.0",
					action: "play",
					json: true,
				},
				{
					speed: 1,
					scale: 1,
					x: [0, 0.5],
					y: [0, 0.5],
				}
			);
		},
	});
}
