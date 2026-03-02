import { lib, game, ui, get, ai, _status } from "../../../noname.js";

export function liuye() {
    window._LIUYE = {
        aar_piliche_fadong: {
            name: "../../../无名美化/animation/pilitoushiche/animation/aar_piliche_fadong",
        },
        aar_piliche_posui: {
            name: "../../../无名美化/animation/pilitoushiche/animation/aar_piliche_posui",
        },
        aar_zb_piliche: {
            name: "../../../无名美化/animation/pilitoushiche/animation/aar_zb_piliche",
        },
    };
    //破垣(霹雳投石车)
    Object.assign(lib.skill.dcpoyuan, {
        content:function(){
            "step 0";
            if (player.getEquip("pilitoushiche")) {
                event.goto(2);
                player
                    .chooseTarget(get.prompt("dcpoyuan"), "弃置一名其他角色的至多两张牌", function (card, player, target) {
                        return target != player && target.countDiscardableCards(player, "he") > 0;
                    })
                    .set("ai", function (target) {
                        var player = _status.event.player,
                            cards = target.getDiscardableCards(player, "he");
                        var att = get.attitude(player, target);
                        if (att < 0 && target.hasSkillTag("noe")) att /= 2;
                        var zheng = [],
                            fu = [];
                        for (var i of cards) {
                            var val = get.value(i, target);
                            if (val > 0) zheng.push(i);
                            else fu.push(i);
                        }
                        zheng.sort((a, b) => get.value(b, target) - get.value(a, target));
                        fu.sort((a, b) => get.value(b, target) - get.value(a, target));
                        zheng = zheng.slice(0, 2);
                        fu = fu.slice(0, 2);
                        var eff1 = 0,
                            eff2 = 0;
                        for (var i of zheng) eff1 += get.value(i, target);
                        for (var i of fu) {
                            if (get.position(i) == "e") eff2 += 1 - get.value(i, target);
                        }
                        return -att * Math.max(eff1, eff2);
                    });
            } else {
                player.chooseBool(get.prompt("dcpoyuan"), "装备一张【霹雳投石车】").set("ai", function () {
                    return true;
                });
            }
            "step 1";
            if (result.bool) {
                player.logSkill("dcpoyuan");
                var card = game.createCard("pilitoushiche", "diamond", 9);
                player.$gain2(card);
                game.delayx();
                player.equip(card);
            }
            event.finish();
            // ----修改开始----
            "step 2";
            if (result.bool) {
                event.target=result.targets[0];
                player.logSkill('dcpoyuan', event.target);
                dcdAnim.loadSpine(window._LIUYE.aar_zb_piliche.name, "skel", function() {
                    dcdAnim.playSpine(window._LIUYE.aar_zb_piliche, {
                        speed: 1,
                        scale: 0.4,
                        parent: player,
                    });
                });
                game.playAudio('..','extension','无名美化','animation','pilitoushiche','audio','effect_catapult_throw');
                player.discardPlayerCard(event.target, true, "he", [1, 2]);
            };
            "step 3";
            game.delay(2);
            dcdAnim.loadSpine(window._LIUYE.aar_piliche_fadong.name, "skel", function() {
                dcdAnim.playSpine(window._LIUYE.aar_piliche_fadong, {
                    speed: 1,
                    scale: 0.7,
                    parent: event.target,
                });
            });
            game.playAudio('..','extension','无名美化','animation','pilitoushiche','audio','effect_catapult_stone');
            // ----修改结束----
        },
        group:['dcpoyuan_hui'],
        subSkill:{
            hui:{
                forced:true,
                silent:true,
                trigger:{
                    player:'loseAfter',
                    global:['equipAfter','addJudgeAfter','gainAfter','loseAsyncAfter','addToExpansionAfter'],
                },
                filter:function(event,player){
                    var evt=event.getl(player);
                    return evt&&evt.player==player&&evt.es&&evt.es.filter(function(card){
                        return card.name=='pilitoushiche';
                    }).length;
                },
                content:function(){
                    dcdAnim.loadSpine(window._LIUYE.aar_piliche_posui.name, "skel", function() {
                        dcdAnim.playSpine(window._LIUYE.aar_piliche_posui, {
                            speed: 0.3,
                            scale: 0.7,
                            parent: player,
                        });
                    });
                    game.playAudio('..','extension','无名美化','animation','pilitoushiche','audio','effect_catapult_crash');
                },
            },
        },
    });
    //霹雳车
    Object.assign(lib.skill.ly_piliche, {
        content:function(){
            'step 0';
            event.target=trigger.player;
            'step 1';
            dcdAnim.loadSpine(window._LIUYE.aar_zb_piliche.name, "skel", function() {
                dcdAnim.playSpine(window._LIUYE.aar_zb_piliche, {
                    speed: 1,
                    scale: 0.4,
                    parent: player,
                });
            });
            game.playAudio('..','extension','无名美化','animation','pilitoushiche','audio','effect_catapult_throw');
            'step 2';
            player.discardPlayerCard(event.target, "e", true, event.target.countCards("e"));
            'step 3';
            game.delay(2);
            dcdAnim.loadSpine(window._LIUYE.aar_piliche_fadong.name, "skel", function() {
                dcdAnim.playSpine(window._LIUYE.aar_piliche_fadong, {
                    speed: 1,
                    scale: 0.7,
                    parent: event.target,
                });
            });
            game.playAudio('..','extension','无名美化','animation','pilitoushiche','audio','effect_catapult_stone');
        },
    });
    lib.skill._ly_piliche_hui={
        forced:true,
        silent:true,
        trigger:{
            player:'loseAfter',
            global:['equipAfter','addJudgeAfter','gainAfter','loseAsyncAfter','addToExpansionAfter'],
        },
        filter:function(event,player){
            var evt=event.getl(player);
            return evt&&evt.player==player&&evt.es&&evt.es.filter(function(card){
                return card.name=='ly_piliche';
            }).length;
        },
        content:function(){
            dcdAnim.loadSpine(window._LIUYE.aar_piliche_posui.name, "skel", function() {
                dcdAnim.playSpine(window._LIUYE.aar_piliche_posui, {
                    speed: 0.3,
                    scale: 0.7,
                    parent: player,
                });
            });
            game.playAudio('..','extension','无名美化','animation','pilitoushiche','audio','effect_catapult_crash');
        },
    };
}
