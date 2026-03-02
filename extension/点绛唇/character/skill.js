import{lib,game,ui,get,ai,_status}from '../../../noname.js'
import {translate}from './translate.js'
let block={
    //在这里编写技能。
    //幻 李火旺
    'djcdaqianlu_skill':{//大千录技能 出牌阶段，你可以：1.弃置一张“苍”并视为受到1点伤害。2.弃置任意张“苍”，等量枚“蜣”，并对一名其他角色造成等量伤害。
        enable:'phaseUse',
        equipSkill:true,
        direct:true,
        filter(event,player,name){
            return player.getExpansions('djcdengjie_1').length;
        },
        async content(event,trigger,player){
            let choiceList=['弃置一张“苍”并视为受到1点伤害'];
            if(player.storage['djcdengjie_2'])choiceList.push('弃置任意张“苍”，等量枚“蜣”并对一名其他角色造成等量伤害');
            const{result:{control}}=await player.chooseControl('cancel2').set('prompt',get.prompt(event.name)).set('choiceList',choiceList);
            if(!control||control=='cancel2')return;
            if(control=='选项一'){
                const{result}=await player.chooseButton([get.skillTranslation(event.name),'选择弃置一张“苍”',player.getExpansions('djcdengjie_1')]).set('ai',(button)=>{
                    const player=get.player();
                    return 5-player.getUseValue(button.link)||1;
                });
                if(result.bool){
                    await player.loseToDiscardpile(result.links[0]);
                    await player.damage(player,'unreal');
                };
            }else{
                const num=Math.min(player.getExpansions('djcdengjie_1').length,player.storage['djcdengjie_2']);
                const{result }=await player.chooseButton([get.skillTranslation(event.name),'选择弃置任意张“苍”',player.getExpansions('djcdengjie_1')],[1,num]).set('ai',(button)=>{
                    const player=get.player();
                    return 5-player.getUseValue(button.link)||1;
                });
                if(result.bool){
                    const{result:{bool,targets}}=await player.chooseTarget('选择一名其他角色，对其造成'+result.links.length+'点伤害',(card,player,target)=>{
                        return target!=player;
                    });
                    if(bool){
                        player.logSkill(event.name);
                        await player.loseToDiscardpile(result.links);
                        player.storage['djcdengjie_2']-=result.links.length;
                        player.markSkill('djcdengjie_2');
                        await targets[0].damage(result.links.length,player,'nocard');
                    };
                };
            };
        },
    },
    'djcdaqian':{//大千 游戏开始时或你的回合开始时，若你没有【大千录】，你可以将【大千录】置入宝物区。否则你可以将一名角色场上的一张牌当作【杀】对你使用。若此【杀】未对你造成伤害，你对其造成1点伤害。
        audio:'ext:点绛唇/audio/skill:2',
        trigger:{
            global:'phaseBefore',
            player:['phaseZhunbeiBegin','enterGame'],
        },
        direct:true,
        derivation:['djcdaqianlu','djcdaqianhuan'],
        filter(event,player,name){
            if(player.storage.isInHuan)return false;
            if(event.name=='phase'&&game.phaseNumber>0)return false;
            return player.hasEquipableSlot(5)||player.getEquip('djcdaqianlu');
        },
        async content(event,trigger,player){
            if(!player.getEquip('djcdaqianlu')){
                const{result}=await player.chooseBool(get.prompt(event.name),'将【大千录】置入宝物区');
                if(result.bool){
                    await player.logSkill(event.name);
                    const card=game.createCard('djcdaqianlu',null,null);
                    await player.$gain2(card);
                    game.delayx();
                    await player.equip(card);
                };
            }else{
                const{result:{bool,targets}}=await player.chooseTarget(get.prompt(event.name),'将一名角色场上的一张牌当作【杀】对你使用',(card,player,target)=>{
                    return target.countCards('ej');
                });
                if(bool){
                    await player.logSkill(event.name,targets[0]);
                    const{result}=await player.choosePlayerCard(targets[0],'ej','选择一张牌当作【杀】对你使用，若此【杀】未对你造成伤害，你对'+get.translation(targets[0])+'造成1点伤害').set('ai',button=>{
                        const player=get.player();
                        const target=targets[0];
                        const sha=get.autoViewAs({name:'sha'},[button.link]);
                        let val=get.buttonValue(button);
                        val+=get.effect(player,sha,target,player);
                        if(get.position(button.link)=='h'){
                            if(target.countCards('e'))return 0;
                            if(target.getCards('hs')>=player.countCards('hs'))val+=1.2;
                        };
                        if(get.attitude(player,get.owner(button.link))>0)return-val;
                        return val;
                    });
                    if(result.bool){
                        const sha=get.autoViewAs({name:'sha'},result.cards);
                        await targets[0].useCard(sha,result.cards,player,false);
                        if(!player.hasHistory('damage',evt=>{
                            return evt.getParent(3)==event;
                        }))await targets[0].damage(player,'nocard');
                    };
                };
            };
        },
        group:['djcdaqian_huan'],
        subSkill:{
            'huan':{//大千·入幻 回合开始时，你可以视为对任意名角色使用一张神【杀】并弃置目标数-1枚“蜣”。若如此做，你可以弃置所有“苍”并摸2X张牌（X为苍的数量）。
                audio:'ext:点绛唇/audio/skill:2',
                trigger:{
                    player:'phaseZhunbeiBegin',
                },
                filter(event,player,name){
                    return player.storage.isInHuan;
                },
                async cost(event,trigger,player){
                    event.result=await player.chooseTarget([1,player.storage['djcdengjie_2']+1],get.prompt(event.skill),'对任意名角色使用一张神【杀】并失去目标数-1枚“蜣”',(card,player,target)=>{
                        return player.canUse('sha',target,false,false);
                    }).set('ai',(target)=>{
                        return get.effect(target,{name:'sha'},player,player);
                    }).forResult();
                },
                async content(event,trigger,player){
                    player.storage['djcdengjie_2']-=event.targets.length-1;
                    player.markSkill('djcdengjie_2');
                    await player.useCard({name:'sha',isCard:true,nature:'kami'},event.targets);
                    const cards=player.getExpansions('djcdengjie_1');
                    if(cards.length){
                        const{result}=await player.chooseBool('是否弃置所有“苍”并摸双倍数量的牌');
                        if(result.bool){
                            await player.loseToDiscardpile(cards);
                            await player.draw(2 * cards.length);
                        };
                    };
                },
            },
        },
    },
    'djcdaqianhuan':{audio:'djcdaqian_huan',},
    'djcdengjie':{//登阶 锁定技，当你受到伤害后，若有实体伤害牌，你将此牌置入武将牌上，称之为“苍”；否则你获得一枚“蜣”。当你使用牌造成伤害后 ，你获得一枚“蜣”。
        audio:'ext:点绛唇/audio/skill:2',
        trigger:{
            source:'damageSource',
            player:'damageEnd',
        },
        filter(event,player,name){
            if(name=='damageSource')return event.card&&event.cards.length;
            return true;
        },
        forced:true,
        async content(event,trigger,player){
            if(event.triggername=='damageSource'||!trigger.cards||!trigger.cards.length){
                player.addSkill(event.name+'_2');
                player.storage[event.name+'_2']++;
                player.markSkill(event.name+'_2');
                game.log(player,'获得了','#y1','枚“蜣”');
            }else{
                player.addSkill(event.name+'_1');
                await player.addToExpansion(trigger.cards,'gain2').set('gaintag',[event.name+'_1']);
                game.log(player,'将',trigger.cards,'放在了武将牌上');
            };
        },
        subSkill:{
            '1':{
                mark:true,
                marktext:'苍',
                charlotte:true,
                intro:{
                    name:'苍',
                    mark(dialog,storage,player){
                        let cards=player.getExpansions('djcdengjie_1');
                        if(!cards.length)return '';
                        if(player.isUnderControl(true))dialog.addAuto(cards);
                        return '共有'+get.cnNumber(cards.length)+'张牌';
                    },
                    markcount:'expansion',
                },
                onremove(player,skill){
                    let cards=player.getExpansions(skill);
                    if(cards.length)player.loseToDiscardpile(cards);
                },
            },
            '2':{
                mark:true,
                marktext:'蜣',
                charlotte:true,
                init(player,skill){
                    player.storage[skill]=0;
                },
                onremove(player,skill){
                    delete player.storage[skill];
                },
                intro:{
                    name:'蜣',
                    content:'共有#枚标记',
                },
            },
        },
    },
    'djcchengxian':{//成仙 限定技，当你即将死亡时，你可以取消之，然后你失去所有“蜣”并将体力上限与体力值调整至等量值。若如此做，当前回合结束后，你入幻：进行一个额外的回合。
        audio:'ext:点绛唇/audio/skill:1',
        trigger:{
            player:'dieBefore',
        },
        unique:true,
        limited:true,
        skillAnimation:true,
        animationColor:'orange',
        derivation:['djczhanshi'],
        async content(event,trigger,player){
            player.awakenSkill(event.name);
            trigger.cancel();
            if(player.maxHp!=player.storage['djcdengjie_2']){
                if(player.maxHp<player.storage['djcdengjie_2'])await player.gainMaxHp(player.storage['djcdengjie_2']-player.maxHp);
                else await player.loseMaxHp(player.maxHp-player.storage['djcdengjie_2']);
            };
            await player.recoverTo(player.maxHp);
            player.storage['djcdengjie_2']=0;
            player.when({global:'phaseAfter'}).then(()=>{
                player.insertPhase();
            }).then(()=>{
                player.storage.isInHuan=true;
                game.broadcastAll((player)=>{
                    game.createBgm('audio/bgm/zuowangdao.mp3',1,true,true);
                    game.addAnimation('image/animation/djc_huan_lihuowang_ruhuan.gif',3700,()=>{
                        ui.background.setBackgroundImage('extension/点绛唇/image/character/background/djc_huan_lihuowang.jpg');
                        player.changeSkin({characterName:'djc_huan_lihuowang'},'djc_huan_lihuowang_shadow');
                        player.changeSkills(get.info('djcchengxian').derivation,[]);
                    });
                },player);
            });
        },
    },
    'djczhanshi':{//斩尸 锁定技，当你进入濒死状态时，你退幻：摸X张牌并回复体力至1点（X为你入幻期间造成伤害的次数）。
        audio:'ext:点绛唇/audio/skill:1',
        trigger:{
            source:'damageEnd',
            player:'dying',
        },
        locked:true,
        direct:true,
        mark:true,
        firstDo:true,
        filter(event,player,name){
            return player.storage.isInHuan;
        },
        init(player,skill){
            player.storage[skill]=0;
        },
        intro:{
            content:'入幻期间已造成#次伤害',
        },
        onremove(player,skill){
            delete player.storage[skill];
        },
        async content(event,trigger,player){
            if(event.triggername=='dying'){
                player.logSkill(event.name);
                delete player.storage.isInHuan;
                game.broadcastAll((player)=>{
                    game.addAnimation('image/animation/djc_huan_lihuowang_chuhuan.gif',3230,()=>{
                        game.updateBackground();
                        game.closeBgm(false,false,'audio/bgm/zuowangdao.mp3');
                        player.draw(player.storage.djczhanshi);
                        player.recoverTo(1);
                        player.changeSkin({characterName:'djc_huan_lihuowang'},'djc_huan_lihuowang');
                        player.changeSkills([],get.info('djcchengxian').derivation);
                    });
                },player);
            }else{
                player.storage[event.name]++;
                player.markSkill(event.name);
            };
        },
    },
};
export const skill=block;