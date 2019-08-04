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
    BiuLineWidth:5,
    BingMaxRadius:5,
    BoomSpeed:5,
    BoomLineWidth:3,
    BoomAcceleration:0.98,
    BoomBoomDefaultAngle:Math.PI*2,
    BoomGradient: 0.02,
    BoomMaxCount:100,
    BoomRayCount:2,
    BoomGravity:4.8,
    BingBingLineWidth:3,
    BoomAcceleration:0.95
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
  // 创建一个烟花爆炸效果
  class BoomBoom{
    // 类比于射线 首先不是一条线 而是一个点 相应的属性的大小一定要设置好
    // 没有目标点 只有角度
    constructor(startX,startY){
      this.nowLocation = {x:startX,y:startY}
      this.speed = (Math.random()*10)+CONFIG.BoomSpeed // 速度
      this.angle = Math.random()*CONFIG.BoomBoomDefaultAngle // 随机角度
      this.nowCount = 1 // 默认当前帧数
      this.maxCount = CONFIG.BoomMaxCount
      this.alpha = 1 // 透明度
      this.gradient = CONFIG.BoomGradient//透明度减少的梯度
      this.rayCollection = new Array(CONFIG.BoomRayCount)
      this.gravity = CONFIG.BoomGravity
      this.arrived = false
      this.acceleration = CONFIG.BoomAcceleration
    }
    draw(){ // 现在开始来画一个
      context.beginPath()
      try{
        context.moveTo(this.rayCollection[0][0],[0][1])
      }catch(e){
        context.moveTo(this.nowLocation.x,this.nowLocation.y)
      }
      context.lineWidth = CONFIG.BoomLineWidth
      context.lineCap = 'round'
      context.lineTo(this.nowLocation.x,this.nowLocation.y)
      context.strokeStyle = `rgba(${getRandomColor()},${this.alpha})`
      context.stroke()
    }
    update(){
      this.rayCollection.unshift()
      this.rayCollection.push([this.nowLocation.x,this.nowLocation.y])
      this.speed *= this.acceleration
      if(this.nowCount>=this.maxCount){
        this.alpha -= this.gradient
      }else{
        this.nowCount ++
        let sx = this.speed*Math.cos(this.angle)
        let sy = this.speed*Math.sin(this.angle)
        this.nowLocation.x += sx
        this.nowLocation.y += (sy+this.gravity)
      }
      if(this.alpha<=0){
        this.arrived = true
      }
    }
    init(){
      this.draw()
      this.update()
    }
  }
  // 创建一个烟花炸点的闪烁效果
  class BingBing{
    constructor(targetX,targetY){
      this.targetX = targetX
      this.targetY = targetY
      this.radius = 1
    }
    draw(){
      context.beginPath()
      context.lineWidth = CONFIG.BingBingLineWidth
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
      this.bings = []
      this.booms = []
      this.nowTarget = 0
      this.maxTarget = CONFIG.AnimateMaxTarget
    }
    createManyBoom(x,y){
      for(let i = 0 ;i<parseInt(Math.random()*40)+30;i++){
        this.booms.push(new BoomBoom(x,y))
      }
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
        this.bings[index].init()
        if(this.bius[index].arrived){
          this.createManyBoom(this.bius[index].nowLocation.x,this.bius[index].nowLocation.y) // 产生爆炸的效果 生成
          this.bings.splice(index,1)
          this.bius.splice(index,1)
        }
      })
      this.initAnimation(this.booms,(index)=>{
        if(this.booms[index].arrived){
          this.booms.splice(index,1)
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
  }

  let animation = new Animation()
  animation.run()
})()
