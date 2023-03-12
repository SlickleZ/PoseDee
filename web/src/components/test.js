let x = 10
let y= 50
let f = 'ssssssss'
const address = `Hellooo${x}oo`

if (x===10){
    let y = 500
    console.log ("y = "+y);
}

console.log(address);
console.log(f);

const newArr = [100, 200, 300]
const data = [10,20,...newArr]
const data2 = [50,90]
data.push(50,30)
data.push(...data2)
// data.pop()
console.log(data)
data.shift()
console.log(data)
data.unshift(9999)
console.log(data)

// summation=( ...numberArr)=>{
//     let total=0
//     for (let number of numberArr) total+=number//0+500
//     return total;
//     }
//     console.log(summation(500, 1000));

const data3 = [10,20,40, 30, 50]
for (let i = 0 ;i<data3.length; i++){
    if (data3[i]>30) continue
    console.log(`No. ${i} = ${data3[i]}`);
}