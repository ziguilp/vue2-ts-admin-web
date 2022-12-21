// 问题比如：7*0.8 JavaScript算出来就是：5.6000000000000005

interface Number {
    add(s: number): number
    sub(s: number): number
    mul(s: number): number
    div(s: number): number
}

// 加法函数，用来得到精确的加法结果
// 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
// 调用：accAdd(arg1,arg2)
// 返回值：arg1加上arg2的精确结果
function accAdd(arg1: number, arg2: number) {
    let r1, r2, m
    try { r1 = arg1.toString().split('.')[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split('.')[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2))
    return (arg1 * m + arg2 * m) / m
}
// 用法：
// 给Number类型增加一个add方法，调用起来更加方便。
Number.prototype.add = function(arg: number) {
    return accAdd(arg, this.valueOf())
}

// 减法函数，用来得到精确的减法结果
function Subtr(arg1: number, arg2: number) {
    let r1, r2, m, n
    try { r1 = arg1.toString().split('.')[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split('.')[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2))
    // last modify by deeka
    // 动态控制精度长度
    n = (r1 >= r2) ? r1 : r2
    return Number(((arg1 * m - arg2 * m) / m).toFixed(n))
}

Number.prototype.sub = function(arg: number) {
    return Subtr(this.valueOf(), arg)
}

// 乘法函数，用来得到精确的乘法结果
// 说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
// 调用：accMul(arg1,arg2)
// 返回值：arg1乘以arg2的精确结果
function accMul(arg1: number, arg2: number) {
    let m = 0; const s1 = arg1.toString(); const s2 = arg2.toString()
    try { m += s1.split('.')[1].length } catch (e) { }
    try { m += s2.split('.')[1].length } catch (e) { }
    return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
}
// 给Number类型增加一个mul方法，调用起来更加方便。
Number.prototype.mul = function(arg: number) {
    return accMul(arg, this.valueOf())
}

// 除法函数，用来得到精确的除法结果
// 说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
// 调用：accDiv(arg1,arg2)
// 返回值：arg1除以arg2的精确结果
function accDiv(arg1: number, arg2: number) {
    let t1 = 0; let t2 = 0; let r1; let r2
    try { t1 = arg1.toString().split('.')[1].length } catch (e) { }
    try { t2 = arg2.toString().split('.')[1].length } catch (e) { }
    r1 = Number(arg1.toString().replace('.', ''))
    r2 = Number(arg2.toString().replace('.', ''))
    return (r1 / r2) * Math.pow(10, t2 - t1)
}
// 给Number类型增加一个div方法，调用起来更加方便。
Number.prototype.div = function(arg: number) {
    return accDiv(this.valueOf(), arg)
}
