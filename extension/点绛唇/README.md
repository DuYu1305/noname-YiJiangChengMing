

    待写的技能

    
    1️⃣准备阶段，你可以视为对一名其他角色使用一张【决斗】。此牌结算后，你可以依次视为使用本回合进入弃牌堆的所有【杀】。
    
    2️⃣一名角色的准备阶段，你可以视为对其使用一张【解甲归田】并令其翻面。
    
    3️⃣你对一名其他角色造成伤害后，你可以交给其一张牌令其进入濒死结算，若其因此死亡，取消之，改为令其将体力上限调整至当前体力值。
    
    4️⃣出牌阶段限一次，你可以声明一个X至1.5X的正整数（X为游戏人数）。从你下家开始的角色依次选择令你声明的数字减少1或2，直到数字归0。然后你可以失去1或2点体力，视为选择对应数字。然后你令与最后一名角色选择的数字相同的角色摸两张牌，不同的角色受到1点伤害。
    
    5️⃣每回合限一次，一名角色成为【杀】的目标后，你可以视为对其使用一张【杀】。

    6️⃣转换技，阳:当你得到牌后，若这些牌中有与你原手牌名称相同的牌，你可以弃置之并对一名其他角色造成等量雷属性伤害；阴:当你使用或打出一张牌后，若你的手牌中没有与此牌名称相同的牌，你可以摸两张牌。
        trigger:{
            player:['gainAfter','useCardEnd','respond'],
            global:'loseAsyncAfter',
        },
        zhuanhuanji:true,
        mark:true,
        direct:true,
        locked:false,
        intro:{
            content(storage,player,skill){
                if(!storage)return '当你得到牌后，若这些牌中有与你原手牌名称相同的牌，你可以弃置这些牌并对一名其他角色造成等量伤害';
                return '当你使用或打出一张牌后，若你的原手牌中没有与此牌名称相同的牌，你可以摸2张牌';
            },
        },
        filter(event,player,name){
            if(name=='useCardEnd'||name=='respond'){
                if(!player.storage.技能名)return false;
                return player.countCards('h',{name:event.card.name})==0;
            }else{
                if(player.storage.技能名)return false;
                var cards=[];
                event.getg(player).forEach(card=>{
                    if(player.getCards('h').some(cardx=>!event.getg(player).includes(cardx)&&get.name(cardx)==get.name(card)))cards.push(card);
                });
                return cards.length;
            };
        },
        async content(event,trigger,player){
            if(!player.storage[event.name]){
                var cards=[];
                trigger.getg(player).forEach(card=>{
                    if(player.getCards('h').some(cardx=>!trigger.getg(player).includes(cardx)&&get.name(cardx)==get.name(card)))cards.push(card);
                });
                const {result:{bool,targets}}=await player.chooseTarget(get.prompt(event.name),'弃置'+get.translation(cards)+'并对一名其他角色造成'+cards.length+'点雷属性伤害',(card,player,target)=>{
                    return target!=player;
                }).set('ai',(target)=>{
                    return 2-get.attitude(_status.event.player,target);
                });
                if(bool){
                    player.logSkill(event.name,targets[0]);
                    player.changeZhuanhuanji(event.name);
                    await player.discard(cards);
                    targets[0].damage('thunder',cards.length,player);
                };
            }else{
                const {result:{bool}}=await player.chooseBool(get.prompt(event.name),'摸两张牌');
                if(bool){
                    player.logSkill(event.name);
                    player.changeZhuanhuanji(event.name);
                    await player.draw(2);
                };
            };
        },
        mod:{
            aiOrder(player,card,num){
                var numc=player.countCards('h',{name:card.name});
                if(!player.storage['技能名']&&numc>2)return num+3;
                if(player.storage['技能名']&&numc<=1)return num+6;
            },
        }
        