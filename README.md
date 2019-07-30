# H5Canvas
## canvas API 大全
### 看一看骨架
```html
<html>
  <head>
    <title>Canvas tutorial</title>
    <script type="text/javascript">
      function draw(){
        var canvas = document.getElementById('tutorial');
        if (canvas.getContext){
          var ctx = canvas.getContext('2d');
        }
      }
    </script>
    <style type="text/css">
      canvas { border: 1px solid black; }
    </style>
  </head>
  <body onload="draw();">
    <canvas id="tutorial" width="150" height="150"></canvas>
  </body>
</html>
```
1.canvas 只支持绘制一种原生图形 矩形
```js
fillRect(x,y,width,height) // 填充的矩形
strokeRect(x,y,width,height) // 带边框的矩形
clearRect(x,y,width,height) //  清除指定矩形区域，让清除部分完全透明。
```
例子：
```js
function draw() {
  var canvas = document.getElementById('canvas');
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');

    ctx.fillRect(25, 25, 100, 100);
    ctx.clearRect(45, 45, 60, 60);
    ctx.strokeRect(50, 50, 50, 50);
  }
}
```
![img](https://mdn.mozillademos.org/files/245/Canvas_rect.png) 
## 绘制路径
图形的基本元素是路径。路径是通过不同颜色和宽度的线段或曲线相连形成的不同形状的点的集合。一个路径，甚至一个子路径，都是闭合的。使用路径绘制图形需要一些额外的步骤。

1. 首先，你需要创建路径起始点。
2. 然后你使用画图命令去画出路径。
3. 之后你把路径封闭。
4. 一旦路径生成，你就能通过描边或填充路径区域来渲染图形。

以下是所要用到的函数：
- `beginPath()` 新建一条路径，生成之后，图形绘制命令被指向到路径上生成路径。
- `closePath()` 闭合路径之后图形绘制命令又重新指向到上下文中。
- `stroke()` 通过线条来绘制图形轮廓。
- `fill()` 通过填充路径的内容区域生成实心的图形。

例子：
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <style>
    canvas{
      border: solid blue 1px;
    }
  </style>
</head>
<body>
  <div class="container">
    <canvas width="600" height="400">
      当前浏览器不支持canvas标签
    </canvas>
  </div>
  <script>
    var canvas = document.getElementsByTagName('canvas')[0];
    if(canvas.getContext){
      var cx = canvas.getContext('2d');
      cx.beginPath();
      cx.moveTo(300,200);
      cx.lineTo(350,250);
      cx.lineTo(350,150);
      cx.fill();
    }else{
      alert('你的浏览器不支持canvas')
    }
  </script>
</body>
</html>
```
** 坐标（0,0）是左上角 y轴是从上到下递增 x从左到右递增**

### 移动笔触
`moveTo(x, y)`将笔触移动到指定的坐标x以及y上。
### 画线条
`lineTo(x, y)`绘制一条从当前位置到指定x以及y位置的直线。
例子
```js
function draw() {
 var canvas = document.getElementById('canvas');
 if (canvas.getContext){
 var ctx = canvas.getContext('2d');

 // 填充三角形
 ctx.beginPath();
 ctx.moveTo(25,25);
 ctx.lineTo(105,25);
 ctx.lineTo(25,105);
 ctx.fill();

 // 描边三角形
 ctx.beginPath();
 ctx.moveTo(125,125);
 ctx.lineTo(125,45);
 ctx.lineTo(45,125);
 ctx.closePath();
 ctx.stroke();
 }
}
```
![img](https://mdn.mozillademos.org/files/238/Canvas_lineTo.png) 
你会注意到填充与描边三角形步骤有所不同。正如上面所提到的，因为路径使用填充`（fill）`时，路径自动闭合，使用描边`（stroke）`则不会闭合路径。如果没有添加闭合路径`closePath()`到描述三角形函数中，则只绘制了两条线段，并不是一个完整的三角形。
### 圆弧
`arc(x, y, radius, startAngle, endAngle, anticlockwise)`
画一个以（x,y）为圆心的以radius为半径的圆弧（圆），从startAngle开始到endAngle结束，按照anticlockwise给定的方向（默认为顺时针）来生成。
**arc()函数中表示角的单位是弧度，不是角度 弧度=(Math.PI/180)\*角度  **

```js
function draw() {
 var canvas = document.getElementById('canvas');
 if (canvas.getContext){
 var ctx = canvas.getContext('2d');

 for(var i=0;i<4;i++){
 for(var j=0;j<3;j++){
 ctx.beginPath();
 var x = 25+j*50; // x 坐标值
 var y = 25+i*50; // y 坐标值
 var radius = 20; // 圆弧半径
 var startAngle = 0; // 开始点
 var endAngle = Math.PI+(Math.PI*j)/2; // 结束点
 var anticlockwise = i%2==0 ? false : true; // 顺时针或逆时针

 ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);

 if (i>1){
 ctx.fill();
 } else {
 ctx.stroke();
 }
 }
 }
 }
}
```
[img](https://mdn.mozillademos.org/files/204/Canvas_arc.png)

