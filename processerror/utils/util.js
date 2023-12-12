import os from "os"

// 获取局域网
export  function getLocalIpAddress(){
    const networkInterfaces = os.networkInterfaces();
    for(const interfaceName in networkInterfaces){
        const networkInterface = networkInterfaces[interfaceName];
        for(const iface of networkInterface){
            if(iface.family === "IPv4" && !iface.internal){
                return iface.address;
            }
        }
    }
    return "127.0.0.1"
}

// 获取当前时间
export function getCurrentDate(){
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth()+1;
    let day = now.getDate();
    let hour = now.getHours();
    let minute = now.getMinutes();
    let second = now.getSeconds();
    month = month>9?month:"0"+month;
    day = day>9?day:"0"+day;
    hour=hour>9?hour:"0"+hour;
    minute = minute>9?minute:"0"+minute;
    second=second>9?second:"0"+second;
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}