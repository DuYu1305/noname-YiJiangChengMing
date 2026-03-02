import {lib,game,ui,get,ai,_status} from '../../../noname.js'
import {characterData} from './characterData.js'
import {characterIntro} from './characterIntro.js'
import {characterReplace} from './characterReplace.js'
import {characterSort} from './characterSort.js'
import {characterSubstitute} from './characterSubstitute.js'
import {characterTitle} from './characterTitle.js'
import {perfectPair} from './perfectPair.js'
import {skill} from './skill.js'
import {translate} from './translate.js'
import {dynamicTranslate} from './dynamicTranslate.js'
let block={
    name:'mode_extension_点绛唇',
    connect:true,
    character:{...characterData},//武将信息
    characterIntro:{...characterIntro},//武将简介
    characterReplace:{...characterReplace},//武将切换
    characterSort:{...characterSort},//武将分类
    characterTitle:{...characterTitle},//武将称号
    characterSubstitute:{...characterSubstitute},//转换技切换皮肤
    perfectPair:{...perfectPair},//珠联璧合
    skill:{...skill},
    translate:translate,//翻译信息
    dynamicTranslate:dynamicTranslate,//动态翻译
};
if(lib.device||lib.node){
    if(!_status.postReconnect.djc)_status.postReconnect.djc=[function(list,info){
        for(let i in list){
            lib.character[i]=list[i];
        };
        for(let i in info)if(!lib.translate[i])lib.translate[i]=info[i];
    },{},{}]
    for(let name in characterData){
        const outcrop=lib.config.extension_点绛唇_outcrop?lib.config.extension_点绛唇_outcrop:'stand';
        let namex=name.substring(4);//武将名
        let prefix=name.substring(0,3);//前缀
        if(characterSort.mode_extension_点绛唇[prefix])characterSort.mode_extension_点绛唇[prefix].push(name);//分包
        if(!translate[name+'_prefix'])translate[name+'_prefix']=translate[prefix];//前缀添加
        characterData[name].img=lib.assetURL+'extension/点绛唇/image/character/'+outcrop+'/'+name+'.jpg';
        //添加阵亡语音
        characterData[name].dieAudios=['ext:点绛唇/audio/die/'+name+'.mp3'];
        //添加武将切换
        if(!lib.arenaReady)lib.arenaReady=[];
        lib.arenaReady.push(()=>{
            if(lib.characterReplace[namex])lib.characterReplace[namex].push(name);
            else lib.characterReplace[namex]=[name];
        });
    };
};
export const character=block;