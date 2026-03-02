import{lib,game,ui,get,ai,_status}from'../../../noname.js'

if(!lib.config.extension_点绛唇_diyAvatarNames)game.saveConfig('extension_点绛唇_diyAvatarNames',[]);
let diyAvatarNames={
    default:'关闭',
    sjch:'三角初华',
};
for(let name of lib.config.extension_点绛唇_diyAvatarNames){
    let image=new Image();
    image.src=lib.assetURL+'extension/点绛唇/extension/Mvp/image/diyAvatar/'+name+'.jpg';
    image.onload=function(){
        diyAvatarNames[name]=name;
    };
    image.onerror=function(){
        lib.config.extension_点绛唇_diyAvatarNames.remove(name);
        game.saveConfig('extension_点绛唇_diyAvatarNames',lib.config.extension_点绛唇_diyAvatarNames);
        if(name==lib.config.extension_点绛唇_diyAvatar)game.saveConfig('extension_点绛唇_diyAvatar','default')
    };
};

export const config={
    'outcrop':{
	    name:'露头样式',
	    init:'stand',
	    intro:'武将及皮肤的露头样式选择',
	    item:{
	        bigbg:'全身原画',
	        mobile:'手杀露头',
	        new:'十周年露头',
	        stand:'标准原画',
	        lihui:'立绘',
	    },
	    onclick:function(bool){
	        if(bool!=lib.config.extension_点绛唇_outcrop){
    	        game.saveConfig('extension_点绛唇_outcrop',bool);
    	        if(confirm('是否重启游戏以应用露头样式？'))game.reload();
	        };
	    },
	},
	'coverCharacter':{
        name:'禁将界面覆盖本体武将菜单（重启生效）',
        init:true,
        intro:'开启后，会监听对本体菜单的“武将”按钮的点击，阻断并替换为此扩展的禁将菜单。',
    },
    'openBpDialog':{
    	name:`<span style='text-decoration:underline;'>打开禁将页面</span>`,
    	clear:true,
    	onclick:function(){
    		game.openBpDialog();
    	}
    },
    'clearBpBug':{
    	name:`<span style='text-decoration:underline;'>初始化禁将（会有报错时点击）</span>`,
    	clear:true,
    	onclick:function(){
    		if(confirm('是否重置禁将数据？'))game.bpInit();
    	}
    },
    'openWinDialog':{
        name:`<span style='text-decoration:underline;'>打开战绩页面</span>`,
    	clear:true,
    	onclick:function(){
    		game.openWinDialog();
    	}
    },
    'Menu_Beautification':{
    	name:'菜单美化',
    	init:'off',
    	intro:'菜单的美化样式选择',
    	item:{
    	    menu1:'至臻木纹',
    	    menu2:'雷索纳斯',
    	    menu3:'新十周年',
    	    off:'关闭',
    	},
    	onclick:function(bool){
    	    if(bool!=lib.config.extension_点绛唇_Menu_Beautification){
    	        for(const link of document.head.querySelectorAll('link')){
                    if(link.href.includes('menu/'+lib.config.extension_点绛唇_Menu_Beautification+'.css')){
                        link.remove();
                        break;
                    };
                };
                if(bool!='off')lib.init.css(lib.assetURL+'extension/点绛唇/menu/',bool);
                game.saveConfig('extension_点绛唇_Menu_Beautification',bool);
    	    };
        },
	},
    'overMvp':{
        name:'MVP结算',
        init:true,
    },
    'diyAvatar':{
        name:'自定义头像',
        intro:'MVP页面头像的自定义的头像',
        init:'default',
		item:diyAvatarNames,
		visualBar: function(node,item,create){
			if(node.created){
				node.lastChild.classList.remove('active');
				return;
			};
			node.created=true;
			ui.create.filediv('.menubutton','添加头像',node,function(file){
				if(file){
					var name=file.name;
					if(name.includes('.'))name=name.slice(0,name.indexOf('.'));
					var link='cdv_'+name;
					if(item[link]){
						for(var i=1;i<1000;i++){
							if(!item[link+'_'+i]){
								link=link+'_'+i;
								break;
							};
						};
					};
					item[link]=name;
					let num=0;
					var callback=function(){
					    if(num!=0)return;
					    num++;
						create(link,node.parentNode.defaultNode);
						node.parentNode.updateBr();
						lib.config.extension_点绛唇_diyAvatarNames.add(link);
						game.saveConfig('extension_点绛唇_diyAvatarNames',lib.config.extension_点绛唇_diyAvatarNames);
					};
					game.writeFile(file,'extension/点绛唇/extension/Mvp/image/diyAvatar',link+'.jpg',callback);
					if(node.lastChild.classList.contains('active'))editbg.call(node.lastChild);
				};
			}).inputNode.accept='extension/点绛唇/extension/Mvp/image/diyAvatar/*';
			var editbg=function(){
				this.classList.toggle('active');
				var page=this.parentNode.parentNode;
				for(var i=0;i<page.childElementCount;i++){
					if(page.childNodes[i].classList.contains('button')){
						var link=page.childNodes[i]._link;
						if(link&&link !='default'){
							const str=this.classList.contains('active')?'删除':item[link];
							page.childNodes[i].firstChild.innerHTML=get.verticalStr(str);
						};
					};
				};
			};
			ui.create.div('.menubutton','删除头像',node,editbg);
		},
		visualMenu: function(node,link,name,config){
			node.className='button character';
			node.style.backgroundImage='';
			node.style.backgroundSize='';
			if(node.firstChild)node.firstChild.innerHTML=get.verticalStr(name);
			if(link=='default'){
				node.style.backgroundImage='none';
				node.classList.add('dashedmenubutton');
		        node.parentNode.defaultNode=node;
			}else{
				node.setBackgroundImage('extension/点绛唇/extension/Mvp/image/diyAvatar/'+link+'.jpg');
				node.style.backgroundSize='cover';
			};
		},
		onclick(avatar,node){
			if(node&&node.firstChild){
				var menu=node.parentNode;
			    if(node.firstChild.innerHTML==get.verticalStr('删除')){
					menu.parentNode.noclose=true;
					if(confirm('是否删除此头像？（此操作不可撤销）')){
						node.remove();
						menu.updateBr();
						lib.config.extension_点绛唇_diyAvatarNames.remove(avatar);
						game.saveConfig('extension_点绛唇_diyAvatarNames',lib.config.extension_点绛唇_diyAvatarNames);
						if(avatar.startsWith('cdv_')){
							game.removeFile('extension/点绛唇/extension/Mvp/image/diyAvatar/'+avatar+'.jpg');
						}else{
							game.deleteDB('image',avatar);
						};
						lib.config.extension_点绛唇_diyAvatarNames.remove(avatar);
						if(lib.config.extension_点绛唇_diyAvatar==avatar){
							avatar='default';
							this.lastChild.innerHTML='关闭';
						}else{
							this.lastChild.innerHTML=lib.configMenu.appearence.config.image_background.item[lib.config.extension_点绛唇_diyAvatar];
							return;
						};
					};
				};
			};
			game.saveConfig('extension_点绛唇_diyAvatar',avatar);
		},
    },
}