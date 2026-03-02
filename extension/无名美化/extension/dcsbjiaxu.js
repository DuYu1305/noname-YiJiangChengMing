import { lib, game, ui, get, ai, _status } from "../../../noname.js";

export function dcsbjiaxu() {
    window._DCSBJIAXU = {
        mojiaxu_yang: {
          name: "../../../无名美化/animation/dcsbjiaxu/mojiaxu_yang",
        },
        mojiaxu_yin: {
            name: "../../../无名美化/animation/dcsbjiaxu/mojiaxu_yin",
        },
        zuowei_yang: {
            name: "../../../无名美化/animation/dcsbjiaxu/zuowei_yang",
        },
        zuowei_yin: {
            name: "../../../无名美化/animation/dcsbjiaxu/zuowei_yin",
        },
    };
    Object.assign(lib.skill.dcsbfumou, {
		zhuanhuanji(player, skill) {
			var anim = player.storage.dcsbfumou ? 'mojiaxu_yang' : 'mojiaxu_yin';
            dcdAnim.loadSpine(window._DCSBJIAXU[anim].name, "skel", function () {
                dcdAnim.playSpine({
                    ...window._DCSBJIAXU[anim],
                    action: 'play',
                }, {
                    scale: 0.9,
                    speed: 1,
                });
            });
            var anim2 = player.storage.dcsbfumou ? 'zuowei_yang' : 'zuowei_yin';
            dcdAnim.loadSpine(window._DCSBJIAXU[anim2].name, "skel", function () {
                dcdAnim.playSpine({
                    ...window._DCSBJIAXU[anim2],
                    action: 'play',
                }, {
                    scale: 0.9,
                    speed: 1,
                    parent: player,
                });
            });
			player.storage[skill] = !player.storage[skill];
			player.changeSkin({ characterName: "dc_sb_jiaxu" }, "dc_sb_jiaxu" + (player.storage[skill] ? "_shadow" : ""));
		},
    });
}
