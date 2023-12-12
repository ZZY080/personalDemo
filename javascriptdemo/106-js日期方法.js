function getCurrentDate(DateStr,time) {
    let now = new Date(DateStr);
    let year = now.getFullYear()+time;
    let month = now.getMonth() + 1;
    let day = now.getDate();
    let hour = now.getHours();
    let minute = now.getMinutes();
    let second = now.getSeconds();
    month = month > 9 ? month : "0" + month;
    day = day > 9 ? day : "0" + day;
    hour = hour > 9 ? hour : "0" + hour;
    minute = minute > 9 ? minute : "0" + minute;
    second = second > 9 ? second : "0" + second;
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

console.log(getCurrentDate("2023-12-04 13:59:38",3))