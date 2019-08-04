### 第二部分实现炸点效果 
其实没有什么效果  无非是在射线的targetLocation处画一个闪烁的圆圈

1.炸点类的定义
```js
  class BingBing{
    constructor(targetX,targetY){
      this.targetX = targetX
      this.targetY = targetY
      this.radius = 1
    }
    draw(){
      context.beginPath()
      context.lineWidth = 6
      context.lineStyle = `rgba(${getRandomColor()},1)`
      context.arc(this.targetX,this.targetY,this.radius,0,Math.PI*2)
      context.stroke()
    }
    update(){
      if(this.radius>=CONFIG.BingMaxRadius){
        this.radius = 1
      }else{
        this.radius += 0.02
      }
    }
    init(){
      this.draw()
      this.update()
    }
  }
```

2.生成和移除的时机问题

```js
// 在Animation的run方法内
    run(){
      window.requestAnimationFrame(this.run.bind(this))
      context.clearRect(0,0,clientWidth,clientHeight)

      this.initAnimation(this.bius,(index)=>{
        this.bings[index].init()
        if(this.bius[index].arrived){
          this.bings.splice(index,1)
          this.bius.splice(index,1)
        }
      })


      if(this.nowTarget>=this.maxTarget){// 控制阀值 保证只有一定数量的射线 射出
        var startX = Math.random()*(clientWidth/2)
        var startY = clientHeight
        var targetX = Math.random()*clientWidth
        var targetY = Math.random()*(clientHeight/2)

        let newBiu = new Biu(startX,startY,targetX,targetY)
        let newBing = new BingBing(targetX,targetY)
        this.bius.push(newBiu)
        this.bings.push(newBing)
        this.nowTarget = 0
      }else{
        this.nowTarget++
      }
    }

```
