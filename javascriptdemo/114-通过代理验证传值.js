let validator = {
    set:function(obj,prop,value){
        if(prop==="age"){
            if(!Number.isInteger(value)){
                console.log(value)
                throw new TypeError("the age is not an integer")
            }
            if(value >200){
                throw new RangeError("the age seems invalid")
            }
        }
        // the default behavior to store the value
        obj[prop] = value;
        // 表示成功
        return true;
    }
}

let person = new Proxy({},validator);
person.age=100;
console.log(person.age);

// person.age ="age";

person.age=300;