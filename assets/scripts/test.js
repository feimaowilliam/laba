
/**
 *
 *循环数组并返回一个回调函数数组
 * @param {Array} array 需要循环的数组
 * @param {function} fn 需要回调的函数
 */
function mapArr(array, fn) {
    let newArr = [];
    for (let index = 0; index < array.length; index++) {
        newArr.push(fn(array[index]));
    }
    return newArr;

}

let arr=[1,2,3,4,5,6,7]

// 输出 item的元素
var pd1=mapArr(arr,function(itme){
    return itme
})
// console.log(pd1);

// 输出 i>n的元素
var pd2=mapArr(arr,function(minNum,itme){
    return itme>minNum;
}.bind(this,2))
// console.log(pd2);

// 输出 i>n的元素
var fnPd=function(minNum,itme){
    return itme>minNum;
};
var pd3=mapArr(arr,function(params) {
    
})
// console.log(pd3);

