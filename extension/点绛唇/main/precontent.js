import {lib,game,ui,get,ai,_status} from '../../../noname.js'
import '../extension/CreateCharacterSkill/createCharacterSkill.js';
import '../extension/OpenCardsDialog/openCardsDialog.js';
import '../extension/Plot/plot.js';
import '../extension/Bp/bp.js';
import '../extension/Win/win.js';
export async function precontent(config,pack){
	import('../extension/Mvp/mvp.js');
    game.addAnimation=function(src,time,callback){//添加动画
        if(typeof src!=='string'||src.trim()==='')return;
        if(typeof time!=='number'||isNaN(time)||time<=0)time=1000;
        game.pause2();
        const images=[
            {url:lib.assetURL+'extension/点绛唇/image/animation/beijing.gif',bg:true,index:999,wait:0},
            {url:lib.assetURL+'extension/点绛唇/'+src,index:998,wait:150}
        ];
        let isFirst=true;
        images.forEach(({url,bg,index,wait})=>{
            const img=document.createElement('img');
            img.src=url;
            img.style.position='absolute';
            img.style.zIndex=index;
            img.style.height='100%';
            img.style.width='100%';
            img.style.backgroundSize='100% 100%';
            setTimeout(()=>{
                ui.window.appendChild(img);
            },wait);
            if(bg){
                const newImage=new Image();
                newImage.src=lib.assetURL+'extension/点绛唇/image/animation/beijing.png';
                newImage.onload=()=>{
                    setTimeout(()=>{
                        img.src=newImage.src;
                    },2100);
                };
            };
            setTimeout(()=>{
                ui.window.removeChild(img);
                game.resume2();
                if(callback&&typeof callback==='function'&&isFirst){
                    isFirst=false;
                    callback();
                };
            },time);
        });
    };
    game.createBgm=function(url,volume,loop,replace){//添加Bgm
        if(!game.animationBgm)game.animationBgm={};
        game.closeBgm();
        if(replace)ui.backgroundMusic.volume=0;
        if(game.animationBgm[url]){
            game.closeBgm(true,true,url);
            return;
        };
        const audio=document.createElement('audio');
        audio.volume=volume?volume:1;
        audio.src=lib.assetURL+'extension/点绛唇/'+url;
        if(loop===true)audio.loop=true;
        audio.autoplay=true;
        if(url)game.animationBgm[url]=audio;
        else game.animationBgm.all=audio;
    };
    
    game.changeBgmVolume=function(target,volume){//调整Bgm音量
        if(game.animationBgm){
            volume=Math.min(Math.max(volume,0),1);
            if(target)game.animationBgm[target].volume=volume;
            else game.animationBgm.all.volume=volume;
        };
    };
    
    game.closeBgm=function(isPlaying,replace,target){//开关Bgm
        if(game.animationBgm){
            if(isPlaying){
                for(let i in game.animationBgm){
                    game.closeBgm(false,false,i);
                };
                if(target)game.animationBgm[target].play();
                else game.animationBgm.all.play();
                if(replace)ui.backgroundMusic.volume=0;
            }else{
                if(target)game.animationBgm[target].pause();
                else{
                    for(let i in game.animationBgm){
                        game.closeBgm(false,false,i);
                    };
                };
                ui.backgroundMusic.volume=lib.config.volumn_background/8;
            };
        };
    };
}
