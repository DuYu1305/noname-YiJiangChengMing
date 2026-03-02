import { lib, game, ui, get, ai, _status } from "../../../noname.js";

export function qiaogong() {
    window._QIAOGONG = {
        SSZBB_PJ_eff_yizhu: {
            name: "../../../无名美化/animation/qiaogong/SSZBB_PJ_eff_yizhu",
        },
    };
    if (lib.skill.yizhu.subSkill && lib.skill.yizhu.subSkill.use) {
        Object.assign(lib.skill.yizhu.subSkill.use, {
            content() {
                trigger.cancel();
                trigger.targets.length = 0;
                trigger.getParent().triggeredTargets1.length = 0;
                var list = trigger.cards.filter(function (i) {
                    return player.storage.yizhu.includes(i);
                });
                player.unmarkAuto("yizhu", list);
                if(trigger.card){
                    dcdAnim.loadSpine(window._QIAOGONG.SSZBB_PJ_eff_yizhu.name, "skel", function () {
                        dcdAnim.playSpine(window._QIAOGONG.SSZBB_PJ_eff_yizhu, {
                            parent: trigger.card,
                            referFollow:true,
                        });
                    });
                }
                game.delayx();
            },
        });
    }
   
}
