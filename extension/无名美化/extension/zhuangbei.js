import { lib, game, ui, get, ai, _status } from "../../../noname.js";

export function zhuangbei() {
    window._WJMHEQUIPTEXIAO = {
        SSequip: {
            name: "../../../无名美化/animation/globaltexiao/equip/SSequip",
        },
    };
    lib.skill._wjmh_equiptexiao_ = {
        charlotte: true,
        forced: true,
        silent: true,
        trigger: {
            player: "equipBegin",
        },
        filter: function (event, player) {
            return event.card && get.name(event.card); // 排除类似神典韦创造的虚拟武器牌
        },
        content: function () {
            var cards = [
                "bagua", "baiyin", "cixiong", "fangtian", "guanshi", 
                "guding", "hanbing", "qibaodao", "qilin", "qinggang", 
                "qinglong", "renwang", "zhangba", "zhuge", "zhuque", 
            ];
            var name = get.name(trigger.card);
            console.log("name",name)
            var action = name;
            if (cards.includes(name)) {
                dcdAnim.loadSpine(window._WJMHEQUIPTEXIAO.SSequip.name, "skel", function () {
                    if (name == "cixiong") action = "cixong"; // 这里的操作，是因为，动画标签少了一个拼音i
                    if (name == "zhuge") action = "zhuque";
                    if (name == "qibaodao") action = "qibao";
                    if (name == "zhuque") action = "zhuge"; // 这里的操作，是因为，朱雀羽扇和诸葛连弩的骨骼动画标签写错了，这里需要纠正回来
                    window._WJMHEQUIPTEXIAO.SSequip.action = action;
                    dcdAnim.playSpine(window._WJMHEQUIPTEXIAO.SSequip, {
                        speed: 0.8,
                        scale: 1,
                        parent: player,
                    });
                });
            };
        },
    };
  
}
