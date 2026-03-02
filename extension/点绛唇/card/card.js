import {lib,game,ui,get,ai,_status} from '../../../noname.js'
export const card = {
    connect:true,
    //在这里编写卡牌信息。
    card:{
        'djcdaqianlu':{//大千录 出牌阶段，你可以：1.弃置一张“苍”并视为受到1点伤害。2.弃置任意张“苍”，等量枚“蜣”，并对一名其他角色造成等量伤害。
            audio:true,
            image:'ext:点绛唇/card/image/djcdaqianlu.png',
            enable:true,
            fullskin:true,
            derivation:'djc_huan_lihuowang',
            type:'equip',
            subtype:'equip5',
            modTarget:true,
            toself:true,
            destroy:true,
            skills:['djcdaqianlu_skill'],
            ai:{
                basic:{
                    equipValue:3,
                    order:(card,player)=>{
                        const equipValue=get.equipValue(card,player)/20;
                        return player&&player.hasSkillTag('reverseEquip')?8.5-equipValue:8+equipValue;
                    },
                    useful:2,
                    value:(card,player,index,method)=>{
                        if(!player.getCards('e').includes(card)&&!player.canEquip(card,true))return 0.01;
                        const info=get.info(card),
                            current=player.getEquip(info.subtype),
                            value=current&&card!=current&&get.value(current,player);
                            let equipValue=info.ai.equipValue||info.ai.basic.equipValue;
                        if(typeof equipValue=='function'){
                            if(method=='raw')return equipValue(card,player);
                            if(method=='raw2')return equipValue(card,player)-value;
                            return Math.max(0.1,equipValue(card,player)-value);
                        }
                        if(typeof equipValue!='number')equipValue=0;
                        if(method=='raw')return equipValue;
                        if(method=='raw2')return equipValue-value;
                        return Math.max(0.1,equipValue-value);
                    },
                },
                result:{
                    target:(player,target,card)=>get.equipResult(player,target,card),
                },
            },
        },
    },
    translate:{
        'djcdaqianlu':'大千录',
        'djcdaqianlu_info':'出牌阶段，你可以：1.弃置一张“苍”并视为受到1点伤害。2.弃置任意张“苍”，等量枚“蜣”，并对一名其他角色造成等量伤害。',
    },
    list:[
    ],
}