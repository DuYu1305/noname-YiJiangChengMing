import { lib, game, ui, get, ai, _status } from "../../../noname.js";

export function ssyangfeng() {
    //骨骼文件来自sakura @柴油鹿鹿
    window._YANGFENG = {
        shibai: {
          name: "../../../无名美化/animation/ssyangfeng/weimingshibai",
        },
    };
    Object.assign(lib.skill.mbweiming.subSkill.fail,{
        async content(event, trigger, player) {
            dcdAnim.loadSpine(window._YANGFENG.shibai.name, "skel", function () {
                dcdAnim.playSpine(window._YANGFENG.shibai, {
                    scale: 0.8,
                    speed: 1,
                    x: [0, 0.55],
                    parent: player,
                });
            });
            game.log(player, "使命失败");
            player.awakenSkill("mbweiming");
            player.storage.mbxuetu_status = 2;
            await game.delayx();
        }
    })
}
