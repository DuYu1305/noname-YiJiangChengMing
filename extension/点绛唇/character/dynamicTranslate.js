import {lib,game,ui,get,ai,_status} from '../../../noname.js'
let block={//动态翻译
    djcdaqian(player){
        if(player.storage.isInHuan)return lib.translate.djcdaqianhuan_info;
        return lib.translate.djcdaqian_info;
    },
};
export const dynamicTranslate=block;