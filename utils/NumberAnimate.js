class NumberAnimate {

  constructor(opt) {
    let def = {
      from: 50,//开始时的数字
      to:100,//结束时的数字
      speed: 1500,// 总时间
      refreshTime: 88,// 刷新一次的时间
      decimals: 2,// 小数点后的位数
      onUpdate: function () { }, // 更新时回调函数
      onComplete: function () { } // 完成时回调函数
    }
    // this.tempValue = 0;//累加变量值
    this.opt = Object.assign(def, opt);//assign传入配置参数
    this.loopCount = 0;//循环次数计数
    this.tempValue = this.opt.from;//累加变量值
    this.loops = Math.ceil(this.opt.speed / this.opt.refreshTime);//数字累加次数
    this.increment = ((parseFloat(this.opt.to) - parseFloat(this.opt.from)) / this.loops);//每次累加的值
    this.interval = null;//计时器对象

    var that = this;
    setTimeout(function () {
      that.init();
    }, 500)
  }
  init() {
    this.interval = setInterval(() => { this.updateTimer() }, this.opt.refreshTime);
  }

  updateTimer() {

    this.loopCount++;
    this.tempValue = this.formatFloat(this.tempValue, this.increment).toFixed(this.opt.decimals);
    // this.tempValue = this.formatFloat(this.tempValue, 3).toFixed(this.opt.decimals);
    if (this.loopCount >= this.loops) {
      clearInterval(this.interval);
      this.tempValue = this.opt.to;
      this.opt.onComplete();
    }
    this.opt.onUpdate();
  }
  //解决0.1+0.2不等于0.3的小数累加精度问题
  formatFloat(num1, num2) {
    let baseNum, baseNum1, baseNum2;
    try {
      baseNum1 = num1.toString().split(".")[1].length;
    } catch (e) {
      baseNum1 = 0;
    }
    try {
      baseNum2 = num2.toString().split(".")[1].length;
    } catch (e) {
      baseNum2 = 0;
    }
    baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
    return (num1 * baseNum + num2 * baseNum) / baseNum;
  };
} export default NumberAnimate;