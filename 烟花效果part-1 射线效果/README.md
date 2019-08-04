### 第一部分实现射线的动画效果
1.window.requestAnimationFrame(this.run.bind(this))
`window.requestAnimationFrame()` 区别于`setTimeout` 
2.js数组问题
```js
// 讲实话确实有点颠覆我的认知啊
var arr = new Array(10);
arr.push('push');
console.log('length',arr.length) // 11
console.log('arr[0]',arr[0]) // undefined
console.log('arr[10]',arr[10]) // 'push'

```
3.更新动画
```js
    // 每一帧都会调用
    update(){
      //rayCollection 是存放的连续10个运动点的轨迹 方便画出射线
      this.rayCollection.shift()
      this.rayCollection.push([this.nowLocation.x,this.nowLocation.y])
      // 计算当前动画走到的位置 严格来说 speed并不是速度 而是一帧所要走的路程 只不过时间单位是一帧 
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
```
