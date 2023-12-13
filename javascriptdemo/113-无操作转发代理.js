let target ={};
let p = new Proxy(target,{});

p.a=37;// 操作转发到目标
console.log(target)
console.log(p==target)