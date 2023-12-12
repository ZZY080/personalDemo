var UploadSubmit,webUrl,uploadDataCookie;
var oldData = [];
chrome.runtime.onConnect.addListener((res) => { 
    if (res.name === 'myConnect') {
        /**检测页面中是否存在对应的图片展示区域**/
        let pic_popul_mian = document.getElementById('pic_popul_mian');
        if(!pic_popul_mian){
            res.onMessage.addListener(mess => {
                imgPicAll();
                picImgItem();
            })
        }   
       
    }else if(res.name === 'myConfig'){
        res.onMessage.addListener(mess => {
          localData();
        })
    }else if(res.name === 'login'){
        layerCloseUpload()
    }else if(res.name === 'buttonlogin'){
        imgPicSheet(imgpathDiv)
    }else if(res.name === 'getCookie'){
        chrome.storage.local.get('uploadCookie',function(item){
            if(item.uploadCookie!=0 || item.uploadCookie!= 'undefined'){
                oldData = item.uploadCookie ? item.uploadCookie : [];
                picImgItem()
            }else{
                oldData = []
            }
        })
        console.log()
    }else if(res.name === "Message"){
        res.onMessage.addListener(mess => {
            var html = `<div class="flexmess">${mess.messages}</div>`;
            $(".JIANE_Panel").append(html);
            setTimeout(() => {
                $(".JIANE_Panel .flexmess").remove()
            }, 500);
        })
    }
    UploadSubmit = document.getElementById('UploadSubmit');
    webUrl = window.location.href;
})
var valueStatus,outputValue;
const domainArrayData = ['qx.justeasy.cn'];
function localData(){
    new Promise((resolve,reject)=>{
        chrome.storage.local.get('valueStatus',function(item){
            if(item.valueStatus){
                valueStatus = item.valueStatus  
            }
            resolve(valueStatus); 
        })
    }).then(function(value){
        valueStatus = value
        new Promise((resolve,reject)=>{
            chrome.storage.local.get('outputValue',function(item){
                if(item.outputValue!=undefined && item.outputValue!='' && item.outputValue!='undefined'){
                    outputValue = item.outputValue
                }else{
                    outputValue = 200
                }
                resolve(outputValue ? outputValue : 200); 
            })
        }).then(function(value){
            outputValue = value;
            if(!domainArrayData.includes(document.domain)){
                setTimeout(()=>{    
                    bodyHtml(valueStatus,outputValue)
                },200)
            }  
        })
    }) 
    
    chrome.storage.local.get('uploadCookie',function(item){
        if(item.uploadCookie!=0 || item.uploadCookie!= 'undefined'){
            oldData = item.uploadCookie ? item.uploadCookie : [];
        }else{
            oldData = []
        }
    })

}
/**
 * 控制插入页面的html结构
 */
localData();
var panel = document.createElement('div');
panel.className = 'JIANE_Panel';
document.addEventListener('DOMContentLoaded', function(){
    panel.innerHTML += `<div class="jian_button" style="display:none">采集</div>`;
    panel.innerHTML +=`<style>.JIANE_Panel .jian_button{position: absolute;z-index: 9999999;background: rgba(0,0,0,.3);color: #fff; 
        border-radius: 4px;padding: 3px 15px;cursor: pointer;box-sizing: border-box;height:30px;line-height: 24px;
            font-size: 14px;top:0;left: 0;display: none;}
            .JIANE_Panel * {box-sizing: content-box;}
            .jian_button:hover{background: #e70;color: #fff;}.fl{float: left;}
            .flexmess{position:fixed;height:35px;border-radius:25px;padding:0px 10px;color:#fff;background:#EC4771; top:40px;left:50%; transform: translateX(-50%);
             line-height: 35px;z-index:999999999}
            .fr{float: right;}
            .pic_popul_main{position:fixed; top:0; left:0; right:0; right:0;z-index: 99999999;bottom:0;background:#303134;overflow-y:auto;overflow-x:hidden}
            .pic_img_header{ position:fixed; top:0; left: 0; background: #353639;box-shadow: 0 0 4px rgb(0 0 0 / 20%);height: 50px;width: 100%;
            box-sizing: border-box;z-index: 99;}
            .pic_header .logo{width: 162px; height: 31px; overflow: hidden;margin-top: 9px;margin-left: 25px;}
            .pic_header .logo img{width: 100%; height: 100%;object-fit: contain;}
            .pic_header .right{display: flex; align-items: center;height: 50px;}
            .pic_header .right .button{width: 100px;height: 30px; background: linear-gradient(90deg, #31C0E8, #0FDBB6);overflow: hidden; border-radius: 4px;display:none}
            .pic_header .right .button button{display: block;width: 100%; height: 30px; text-decoration: none;text-align: center; line-height: 30px;font-size: 14px;
            color: #fff; border:none;background: linear-gradient(90deg, #31C0E8, #0FDBB6);cursor: pointer;}
            .pic_header .right .close{width: 50px; height: 50px;text-align: center; line-height: 50px; cursor: pointer;
            border-left:1px solid #262626 ; margin-left: 25px;position: relative;}
            .pic_header .right .close span{display:block;width:1px; height:35px; background:rgb(255,255,255,.5);position: absolute;right: 20px;top: 8px;}
            .pic_header .right .close span.icon_1 {transform: rotateZ( 45deg);}
            .pic_header .right .close span.icon_2 { transform: rotateZ(-45deg);}
            .pic_header .right .close:hover span{background:rgb(255,255,255);}
            .pic_header .right .close:hover i{color: #fff;}
            .pic_center{width: 1500px; margin: 0 auto;}
            .pic_head{height: 60px; width: 100%;}
            .pic_center .item{float: left;height: auto; overflow: hidden; margin:10px 8px; box-sizing: border-box;color: #969696; cursor: pointer;width:149px}
            .pic_center .item .pic_flex{display:none;position: absolute; top:0; left: 0; background: rgba(0,0,0,.6); width: 100%; height: 100%;}
            .pic_center .item.disable .pic_flex{display:block}
            .pic_center .item .radio_text{display:none;position: absolute; width: 100%;text-align: center;color: #fff; z-index: 9; font-size: 16px}
            .pic_center .item.disable .radio_text{display:block}
            .pic_center .item.disable .radio span{border:none;width:25px;height:25px}
            .pic_center .item.disable .radio span em{position: relative;background:#03ca08;width:20px; height: 20px;z-index:9;}
            .pic_center .item.disable .radio span em:after{display: flex;content: '√';color:#fff;
            position: absolute;width: 100%; height: 100%; align-items: center; justify-content: center;}
            .pic_center .item .pic_width{height: auto; overflow: hidden; padding: 5px;}
            .pic_center .item .pic_width span.left{float: left;}
            .pic_center .item .pic_width span.right{float: right;max-width: 50%;
                overflow: hidden;text-overflow: ellipsis;white-space: nowrap;} 
            .pic_center .item .pic{height: 150px; overflow: hidden;display: flex;align-items: center;border: 1px solid rgb(255 255 255 / 10%);
                border-radius:10px;min-width: 147px;display: flex;align-items: center; position: relative;}
            .pic_center .item .pic .radio{position: absolute; top:10px; right: 10px;}  
            .pic_center .item .pic .radio i{font-size: 30px;}
            .pic_center .item.active .radio i{color: rgba(255, 141, 28, 1);}
            .pic_center .item .pic img{max-width: 100%; max-height:100% ;margin: 0 auto;}
            .radio span{display: flex;  width: 20px;  height: 20px;border-radius: 50%; box-sizing: border-box;  border: 1px solid #f2f2f2; 
                padding: 2px;align-items: center;justify-items: center;cursor: pointer;}
            .radio span em { display: block; width: 14px;background: #f2f2f2;height: 14px;border-radius: 50%;}    
            .pic_center .item.active .radio span{border-color:#31C0E8}
            .pic_center .item.active .radio span em{background: linear-gradient(90deg, #31C0E8, #0FDBB6);}
            .pic_center .item .pic_name{max-width:150px;overflow: hidden;height: 30px;text-overflow:ellipsis;white-space: nowrap;text-align:left}</style>`
    document.body.appendChild(panel);
})
var mouseoverStatus = true ,countDiv = 0,imgpathDiv='';
function bodyHtml(valueStatus,outputValue){   
        document.onmousemove = function(event){
            var divButton = event.target;
            var NameClass = $(divButton).attr('class');
            if(valueStatus=="1" ) {
                    if(event.target.tagName == "IMG" && mouseoverStatus == true){
                        let img = event.target;
                        imgpathDiv = img
                        var top = 0;
                        if($(document).scrollTop()==0){
                            top = parseInt(img.getBoundingClientRect().top + 10) +'px';
                        }else{
                            top = parseInt(img.getBoundingClientRect().top + $(document).scrollTop() + 10) +'px';
                        }
                        let left = parseInt(img.getBoundingClientRect().left +10) +'px'; 
                        /**
                         * 获取图片的宽度
                         */
                        var imgage = new Image()
                        let imgpath = img.src;
                        imgage.src = imgpath;
                        var imgWidth = imgage.width;
                        //console.log(outputValue)
                        if(outputValue < imgWidth){
                            $(".jian_button").css({"display":"block",'top':top,"left":left}); 
                        }else{
                            $(".jian_button").css({"display":"none",'top':top,"left":left}); 
                        } 
                        mouseoverStatus = false
                    }else if(event.target.tagName != "IMG" && mouseoverStatus!=true && NameClass!='jian_button'){
                        $(".jian_button").css({"display":"none"});
                    }
            }else{
                $(".jian_button").css({'display':"none"})
            }
        }
        document.onmouseout = function(event){
            if(event.target.tagName != "IMG"){
                mouseoverStatus = true
                $(".jian_button").css({"display":"none"});
            }
        }
}

$(document).on('click','.jian_button',function(){
    //单个按钮点击向buckgriund.js 询问是否登录目标网站
    chrome.runtime.sendMessage({origin: 'singular',info:''}, function (data) {
        // 接受返回信息 
          console.log("🔷: page.js  send");
          console.log("🔷: page.js  sendBack", data);
          console.log('.....................');
    });
    //
})

/**获取页面中所有图片 */
var imgArr = [];
var img = new Image()
function getStyle(x, styleProp) {
    if (x.currentStyle) var y = x.currentStyle[styleProp];
    else if (window.getComputedStyle) var y = document.defaultView.getComputedStyle(x, null).getPropertyValue(styleProp);
    return y;
}
var elements = document.getElementsByTagName('*');
var  i = 0,
  bgIm,
  protocol = location.protocol,
  origin = location.origin,
  sizes;
function  imgPicAll(){
    for(let i = 0; elements[i];i++){
        var source;
        var imgName,pictype,index; 
        if(elements[i].nodeName == "IMG"){
            source = elements[i].getAttribute('src'); 
            if(source){
                index = source.lastIndexOf('.');
                pictype = source.substring(index + 1);
                if(elements[i].getAttribute('alt')){
                    imgName = elements[i].getAttribute('alt')
                }else if(elements[i].getAttribute('title')){
                    imgName = elements[i].getAttribute('title')
                }else{
                    imgName = ""
                }
            }
            img.src = source;
            source = source && source.slice(0, 2) == "//" ? protocol + source : source
            source = source && source.slice(0, 1) == "/" ? origin + source : source;
            if(outputValue<img.width && source!=undefined){
                imgArr.push({"path":source,"pathMd5":$.md5(source), "pathName":imgName,"width":img.width,"height":img.height,'checkbox':false,'target':webUrl,"type":0});     
            } 
        }     
    }
    //去除里面重复的图片
    let map = new Map();
    for(let item of imgArr){
        map.set(item.path,item)
    }
    imgArr = [...map.values()];
    contrastData(imgArr)
}
//function  imgPicAll(){
//    for(let i = 0; elements[i];i++){
//        var source;
//        var imgName,pictype,index; 
//        if(elements[i].nodeName == "IMG"){
//            source = elements[i].getAttribute('src'); 
//            if(source){
//                index = source.lastIndexOf('.');
//                pictype = source.substring(index + 1);
//                if(elements[i].getAttribute('alt')){
//                    imgName = elements[i].getAttribute('alt')
//                }else if(elements[i].getAttribute('title')){
//                    imgName = elements[i].getAttribute('title')
//                }else{
//                    imgName = ""
//                }
//            }
//        }
//        else{
//            bgIm = getStyle(elements[i], 'background');
//            if (bgIm && bgIm !== 'none') {
//            bgIm = /url\(['"]?([^")]+)/.exec(bgIm) || [];
//                source = bgIm[1];
//                if(source!=undefined){
//                    index = source.lastIndexOf('.');
//                    pictype = source.substring(index + 1);
//                    imgName = ""
//                }
//            }
//        }
//        img.src = source;
//        source = source && source.slice(0, 2) == "//" ? protocol + source : source
//        source = source && source.slice(0, 1) == "/" ? origin + source : source;
//        if(outputValue<img.width && source!=undefined){
//            imgArr.push({"path":source,"pathName":imgName,"width":img.width,"height":img.height,'checkbox':false,'target':webUrl,"type":0});     
//        } 
//        
//    }
//    contrastData(imgArr)
//}

/**单张获取图片*/
function imgPicSheet(imgpathDiv){
     /**图片名称获取 */
     var imgName,pictype,imgPath; 
     imgPath = imgpathDiv.getAttribute('src');
     let index = imgPath.lastIndexOf('.');
     pictype = imgPath.substring(index+1);
     if(imgpathDiv.getAttribute('alt')){
        imgName = imgpathDiv.getAttribute('alt')
     }else if(imgpathDiv.getAttribute('title')){
        imgName = imgpathDiv.getAttribute('title')
     }else{
        imgName = ""
     }
    img.src = imgPath;
    imgArr.push({"path":imgPath,"pathMd5":$.md5(imgPath),"pathName":imgName,"width":img.width,"height":img.height,'checkbox':false,'target':webUrl,"type":0});
    contrastData(imgArr)
    //bodyBox(imgArr);
}
/**插入对应弹窗到页面渲染*/
function bodyBox(datas){
    var picBoxBody = $(`<div class="pic_popul_main" id="pic_popul_mian">
        <div class="pic_img_header">
        <div class="pic_header">
                <div class="logo fl"><a href="https://www.justeasy.cn/" target="_blank"><img src="https://res1.justeasy.cn/images/elephant/top-logo.png"></a></div>
                <div class="right fr">
                    <div class="button" id="UploadSubmit"><button >立即保存(<span id="conutNumber">0</span>)</button></div>
                    <div class="close" id="closeFose"><span class="icon_1"></span><span class="icon_2"></span></div>   
                </div>
        </div>
        </div>
        <div class="pic_head"></div> 
    </div>`);

    var picbox = $(`<div class="pic_item_index"></div>`);
    var picBoxItme = $(`<div class="pic_center" id="picitemlist"> </div> `);
    picBoxBody.append(picbox);
    picbox.append(picBoxItme);
    var htmls = '';
    for(let i = 0 ;i < datas.length ;i++){
        htmls += `<div class="item ${datas[i].type ==0 ? '' : 'disable' }" id="${datas[i].pathMd5}" data-index='${i}'>
            <div class="pic">
                <img src="${datas[i].path}">
                <div class="radio">
                    <span><em></em></span>
                </div>
                <div class="radio_text">已上传</div>
                <div class="pic_flex"></div>
            </div>
            <div class="pic_width">
                <span class="left">${datas[i].width} × ${datas[i].height}</span>
               
            </div>
            <div class="pic_name">${datas[i].pathName}</div>
        </div> `;
    }
    picBoxItme.append(htmls)
    $(document.body).css({
        "overflow": "hidden"
    });
    $(".JIANE_Panel").append(picBoxBody);
    webUrl = window.location.href;
}

function contrastData(datas){
    var data = datas;
    //chrome.storage.local.get('uploadCookie',function(item){
    //    if(item.uploadCookie!=0  || item.uploadCookie !=undefined){
    //        oldData = item.uploadCookie
    //    }else{
    //        oldData = []
    //    }
    //})
    if(oldData.length!=0 || oldData!=undefined){
        for(let i=0; i<data.length;i++){
            for(let k = 0; k<oldData.length;k++){
                if(data[i].pathMd5==oldData[k]){
                    data[i].type = 1;
                }
            }
        }
        imgArr = data;
    }else{
        imgArr = datas
    }
    
    bodyBox(imgArr);
}
$(document).on('click','#closeFose',function(){
    let divbox = document.getElementById("pic_popul_mian");
    divbox.remove();
    imgArr = [];
    $(document.body).css({
        "overflow": "auto"
    });
})
//选中对应图片
$(document).on('click','.pic_center .item',function(){
    UploadSubmit = document.getElementById('UploadSubmit');
    let index = $(this).attr('data-index');
    if(!$(this).hasClass('disable')){
        if($(this).hasClass('active')){
            $(this).removeClass('active');
            imgArr[index].checkbox  = false; 
        }else{
            $(this).addClass('active');
            imgArr[index].checkbox  = true;
        }
        uploadButton() 
    }  
})

//控制上传按钮显示和隐藏
function uploadButton(){
   let temporary = [];
   var conutNumber = document.getElementById('conutNumber');
   for(let i = 0 ; i<imgArr.length;i++){
        if(imgArr[i].checkbox==true){
            temporary.push(imgArr[i])
        }
   }
   if(temporary.length>0){
        UploadSubmit.style.display = "block"
   }else{
        UploadSubmit.style.display = "none"
   }                       
   conutNumber.innerText = temporary.length      
}
//var formData = new FormData();
$(document).on('click',"#UploadSubmit",function(){
    let uploadData = [],data=[];
    chrome.storage.local.get('uploadCookie',function(item){
        if(item.uploadCookie!=0 || item.uploadCookie !=undefined){
            oldData = item.uploadCookie ? item.uploadCookie : [];
        }else{
            oldData = []
        }
    }) 
    if(oldData.length!=0 || oldData!=undefined){
        imgArr.forEach(function(item,index){
            if(oldData.indexOf(item.pathMd5)==-1){
               uploadData.push(imgArr[index]);
            }
        })
        for(let i=0;i<uploadData.length;i++){
            if(uploadData[i].checkbox === true){
                data.push(uploadData[i])
            }
        }
        console.log(uploadData)
    }  else {
        data = imgArr
    } 
    sendMsg(data) 
})
/**没有登录的情况下清除上传层 */
function layerCloseUpload(){
    let divbox = document.getElementById("pic_popul_mian");
    divbox.remove();
    imgArr = [];
    $(document.body).css({
        "overflow": "auto !important"
    });
}

function sendMsg(uploadData) {
    chrome.runtime.sendMessage({ origin: 'pageJs' ,info:uploadData ? uploadData : '' }, function (data) {
    // 接受返回信息 
     // console.log("🔷: page.js  send");
      //console.log("🔷: page.js  sendBack", data);
     // console.log('.....................');
    });
}

/**获取页所有上传的图片 */
function  picImgItem(){
    chrome.storage.local.get('uploadCookie',function(item){
        if(item.uploadCookie!=0 || item.uploadCookie !=undefined){
            oldData = item.uploadCookie ? item.uploadCookie : [];
        }else{
            oldData = [];
        }
    })
    var bodyMain = document.getElementById('picitemlist');
    var item  = bodyMain.getElementsByClassName('item');
    if(oldData.length!= 0 || oldData!=undefined)
    for(let i=0;i<item.length;i++){
        for(let k = 0; k<oldData.length;k++){
            if(item[i].getAttribute('id')==oldData[k]){
                item[i].classList.add('disable');
            }
        }   
    }   
}



/**发送消息给popup.js*/
//function allImgMessageData(imgArr){
//    chrome.runtime.sendMessage({origin:'picData',info:imgArr},function(data){
//        //receiveMsg();
//    })
//}
/**把数据传给popup.js */
//function receiveMsg(imgArr) {
//    chrome.runtime.onMessage.addListener(function (data, sender, sendResponse) {
//    //  console.log("👀: page.js  receive", data);
//    //  console.log("👀: page.js  receiveFn");
//      sendResponse(data);
//    //  console.log('.....................');
//    });
//};




/** 
 * 接收来自background.js 的消息
 * 
*/

function backgroundMessage(){
    chrome.runtime.onMessage.addListener(function(data,sender,sendResponse){
        //console.log("👀: page.js  receive", data);
        //console.log("👀: page.js  receiveFn");
        sendResponse(data);
    })
}
backgroundMessage();


//const background = chrome.extension.getBackgroundPage();
//console.log(background)
//
