
//使用spine4.0
export class NewAnimation4{
    constructor(path, parent, id){
        this.path = path
        this.parent = parent
        this.id = id
        // this.canvas = new newDuilib.AnimationPlayer(path, parent, id).canvas
        this.canvas = document.createElement("canvas");
        this.canvas.className = "animation-player4"
        this.canvas.id = id;
        this.parent.appendChild(this.canvas);
        this.anManager = new AnimationManager("", this.canvas, null, {
            offscreen: false,
        });
    }
    //单例模式 避免重复创建浪费性能
    static getInstance(path, parent=document.body, id="decadeUI-canvas4"){
        if(!window.NewAnimation4){
            window.NewAnimation4 = new NewAnimation4(path, parent, id)
        }
        return window.NewAnimation4
    }
}
window.NewAnimation4Class = NewAnimation4