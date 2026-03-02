import { lib, game, ui, get, ai, _status } from "../../../noname.js";

//来源/参考自 标记补充(作者@西瓜)
export function spmifuren() {
    window._SPMIFUREN = {
        qingyushibai: {
          name: "../../../无名美化/animation/spmifuren/qingyushibai",
        },
    };
    lib.skill.qingyu.subSkill.fail.content = function() {
        game.log(player, "使命失败");
        dcdAnim.loadSpine(window._SPMIFUREN.qingyushibai.name, "skel", function () {
            dcdAnim.playSpine(window._SPMIFUREN.qingyushibai, {
                scale: 0.8,
                speed: 1,
                x: [0, 0.55],
                parent: player,
            });
        });
        player.awakenSkill("qingyu");
        player.loseMaxHp();
    };
}
