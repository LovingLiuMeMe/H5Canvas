(function(){
  console.log('自执行函数')
  var canvas = document.getElementById('canvas')
  var context = canvas.getContext('2d')
  const clientWidth = canvas.width = window.innerWidth
  const clientHeight = canvas.height = window.innerHeight

  const CONFIG = {
    AnimateMaxTarget : 50,
    BiuSpeed:1,
    BiuAcceleration:1.02,
    BiuRayCount:10,
    BiuLineWidth:5
  }
  function getRandomColor(){
    let color = []
    let num = 3
    while(num>0){
      color.push(parseInt(Math.random()*255))
      num--
    }
    return color.join(',')
  }
  function getDistance(startX,startY,endX,endY){
    const a = endX-startX
    const b = endY-startY

    return Math.sqrt(Math.pow(a,2)+Math.pow(b,2))
  }
  class Biu{
    constructor(startX,startY,targetX,targetY){
      this.startLocation = {x:startX,y:startY}
      this.targetLocation = {x:targetX,y:targetY}
      this.nowLocation = {x:startX,y:startY}
      this.targetDistance = getDistance(startX,startY,targetX,targetY)
      this.rayCollection = new Array(CONFIG.BiuRayCount) // 这其实是一个堆栈
      this.speed = CONFIG.BiuSpeed
      this.angle = Math.atan2(targetY-startY,targetX-startX) // 计算biubiu 水平偏转角度
      this.arrived = false
    }
    draw(){
      // 开始进行绘画
      context.beginPath()
      try{
        context.moveTo(this.rayCollection[0][0],this.rayCollection[0][1])
      }catch(e){
        context.moveTo(this.nowLocation.x,this.nowLocation.y)
      }
      context.lineWidth = CONFIG.BiuLineWidth
      context.lineCap = 'round'
      context.lineTo(this.nowLocation.x,this.nowLocation.y)
      context.strokeStyle = `rgba(${getRandomColor()},0.5)`
      context.stroke()
    }
    update(){
      // 每一帧都会调用
      this.rayCollection.shift()
      this.rayCollection.push([this.nowLocation.x,this.nowLocation.y])
      // 计算当前动画走到的位置
      let sx = this.speed*Math.cos(this.angle)
      let sy = this.speed*Math.sin(this.angle)
      let nowDistance = getDistance(this.startLocation.x,this.startLocation.y,this.nowLocation.x+sx,this.nowLocation.y+sy)
      // 速度和加速度的改变
      this.speed *= CONFIG.BiuAcceleration

      if(nowDistance>=this.targetDistance){
        this.arrived = true
      }else{
        this.nowLocation.x = this.nowLocation.x+sx
        this.nowLocation.y = this.nowLocation.y+sy
        this.arrived = false
      }
    }
    init(){
      this.draw()
      this.update()
    }
  }

  class Animation{
    constructor(){
      this.bius = [] // 定义一个射线的数组
      this.nowTarget = 0
      this.maxTarget = CONFIG.AnimateMaxTarget
    }
    initAnimation(target,cb){
      target.map((item,index)=>{
        if(!(item instanceof Object)){
          console.log('BIUBIU射线错误')
          return false
        }else{
          item.init()
          if(cb){
            cb(index)
          }
        }
      })
    }

    run(){
      window.requestAnimationFrame(this.run.bind(this))
      context.clearRect(0,0,clientWidth,clientHeight)

      this.initAnimation(this.bius,(index)=>{
        if(this.bius[index].arrived){
          this.bius.splice(index,1)
        }
      })

      if(this.nowTarget>=this.maxTarget){// 控制阀值 保证只有一定数量的射线 射出
        var startX = Math.random()*(clientWidth/2)
        var startY = clientHeight
        var targetX = Math.random()*clientWidth
        var targetY = Math.random()*(clientHeight/2)

        let newBiu = new Biu(startX,startY,targetX,targetY)
        this.bius.push(newBiu)
        this.nowTarget = 0
      }else{
        this.nowTarget++
      }
    }
  }

  let animation = new Animation()
  animation.run()
})()