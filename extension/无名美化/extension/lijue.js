import { lib, game, ui, get, ai, _status } from "../../../noname.js";

//来源/参考自 标记补充(作者@西瓜)
export function lijue() {
    window._LIJUE = {
        weimingzhong: {
          name: "../../../无名美化/animation/lijue/weimingzhong",
        },
    };
    lib.skill.xinfu_langxi = {
        audio: 2,
        direct: true,
        trigger: {
            player: "phaseZhunbeiBegin",
        },
        filter: function (event, player) {
            return game.hasPlayer(function (current) {
                return current != player && current.hp <= player.hp;
            });
        },
        content: function () {
            "step 0";
            player.chooseTarget(get.prompt('xinfu_langxi'), '对一名体力值不大于你的其他角色造成0-2点随机伤害', function (card, player, target) {
                return target.hp <= player.hp && target != player;
            }).set('ai', function (target) {
                var player = _status.event.player;
                return get.damageEffect(target, player, player);
            });
            "step 1";
            if (result.bool && result.targets && result.targets.length) {
                player.logSkill('xinfu_langxi', result.targets);
                var num = [1, 2, 0].randomGet();
                if (get.isLuckyStar(player)) num = 2;
                var target=result.targets[0];
                player.line(target, 'green');
                target.damage(num);
                if (num == 0) {
                    dcdAnim.loadSpine(window._LIJUE.weimingzhong.name, "skel", function () {
                        dcdAnim.playSpine(window._LIJUE.weimingzhong, {
                            scale: 0.8,
                            speed: 1,
                            parent: target,
                        });
                    });
                };
            };
        },
        ai: {
            expose: 0.25,
            threaten: 1.7,
        },
    };
}
