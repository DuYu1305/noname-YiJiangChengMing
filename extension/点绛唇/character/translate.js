import {lib,game,ui,get,ai,_status} from '../../../noname.js'
let block={//翻译信息
    //幻 李火旺
    'djc_huan_lihuowang':'幻李火旺',
    'djc_huan_lihuowang_prefix':'幻',
    '#djc_huan_lihuowang:die':'妈！我分不清，我真的分不清啊！',
    //幻 李火旺
    'djcdaqianlu_skill':'大千录',
    'djcdaqianlu_skill_info':'出牌阶段，你可以：1.弃置一张“苍”并视为受到1点伤害。2.弃置任意张“苍”，等量枚“蜣”，并对一名其他角色造成等量伤害。',
    'djcdaqian':'大千',
    'djcdaqian_info':'游戏开始时或你的回合开始时，若你没有【大千录】，你可以将【大千录】置入宝物区。否则你可以将一名角色场上的一张牌当作【杀】对你使用。若此【杀】未对你造成伤害，你对其造成1点伤害。',
    '#ext:点绛唇/audio/skill/djcdaqian1':'呵哈哈哈哈哈哈哈，哈哈哈哈哈哈哈，哈哈哈哈哈哈哈！',
    '#ext:点绛唇/audio/skill/djcdaqian2':'我现在的心真的好痛啊，痛的我——甚至想死！',
    '#ext:点绛唇/audio/skill/djcdaqian_huan1':'娃啊——，你着相了。',
    '#ext:点绛唇/audio/skill/djcdaqian_huan2':'呵呵呵呵呵，娃啊——',
    'djcdaqianhuan':'大千·入幻',
    'djcdaqianhuan_info':'大千·入幻 回合开始时，你可以视为对任意名角色使用一张神【杀】并弃置目标数-1枚“蜣”。若如此做，你可以弃置所有“苍”并摸2X张牌（X为苍的数量）。',
    'djcdengjie':'登阶',
    'djcdengjie_info':'锁定技，当你受到伤害后，若有实体伤害牌，你将此牌置入武将牌上，称之为“苍”；否则你获得一枚“蜣”。当你使用牌造成伤害后 ，你获得一枚“蜣”。',
    '#ext:点绛唇/audio/skill/djcdengjie1':'想拿这套来骗我？假的，都是假的！',
    '#ext:点绛唇/audio/skill/djcdengjie2':'幻觉，都是幻觉！你们休想骗我。',
    'djcchengxian':'成仙',
    'djcchengxian_info':'限定技，当你即将死亡时，你可以取消之，然后你失去所有“蜣”并将体力上限与体力值调整至等量值。若如此做，当前回合结束后，你入幻：进行一个额外的回合。',
    '#ext:点绛唇/audio/skill/djcchengxian1':'哈哈哈，哈哈哎！本道爷我成了！',
    'djczhanshi':'斩尸',
    'djczhanshi_info':'锁定技，当你进入濒死状态时，你退幻：摸X张牌并回复体力至1点（X为你入幻期间造成伤害的次数）。',
    '#ext:点绛唇/audio/skill/djczhanshi1':'赖子头啊赖子头，你修不成仙了，你只能成鬼了！',
};
export const translate=block;