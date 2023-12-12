
// 监测到新的tab

async function tabs() {
    const tabId = await getCurrentTabId();
    // 在背景页面发送消息，需要当前 tabID
    chrome.tabs.sendMessage(tabId, { name: 'background' }, function (data) {
      //console.log("📌: bj.js  send");
      //console.log("📌: bj.js  sendBack", data);
      //console.log('.....................');
    });
  };

// 获取当前 tab ID
function getCurrentTabId() {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        resolve(tabs.length ? tabs[0].id : null)
      });
    })
};

// 监测打开了新的tab
chrome.tabs.onCreated.addListener(function (tab) {
    console.log('🎪: 监测打开了新', tab);
});

function backFun(){
    const allViews = chrome.extension.getViews();  
}

/**添加右键 */
chrome.contextMenus.create({
	title: "批量下载图片",
	contexts            : [ 'all' ],
  documentUrlPatterns : [ 'http://*/*', 'https://*/*' ],
  onclick             : showValidImages
});
var loginTypes = false;

const domainArrayData = ['qx.justeasy.cn'];
function showValidImages(){
  let qxy_uid='',qxy_token='';
  chrome.tabs.query({active: true, currentWindow: true},function(tabs){
    var tab = tabs[0];
    if (tab.url.replace(/^https?:\/\/(www)?/, '').indexOf('justeasy.cn') === 1) return;
    chrome.cookies.get({url:"https://qx.justeasy.cn",name:'uid'},function(cookie){
      if(cookie){
        qxy_uid = cookie.value ? cookie.value : ''
      } 
    })
    chrome.cookies.get({url:"https://qx.justeasy.cn",name:'PHPSESSID'},function(cookie){
      if(cookie){
        qxy_token = cookie.value ? cookie.value : ''
      } 
    })

    setTimeout(()=>{
      console.log('qxy_uid:',qxy_uid,"qxy_token:",qxy_token,"showValidImages")
      if(qxy_uid=='' || qxy_token==''){
        layerLogin();
      }else{
        const connect = chrome.tabs.connect(tab.id, {name: 'myConnect'});
        connect.postMessage('我是哈哈哈');
        connect.onMessage.addListener((mess) => {})
      }
    },200)
      
  })
}
// 接收到信息给图片展示页传送信息
var timeCloutIndex = 0;
var timesClout = [];
var qxy_uid='',qxy_token='';
function receiveMsg(){
  chrome.runtime.onMessage.addListener(function (data, sender, sendResponse) {
    let dataArray = data.info ? data.info : '';
    chrome.cookies.get({url:"https://qx.justeasy.cn",name:'uid'},function(cookie){
      if(cookie){
        qxy_uid = cookie.value ? cookie.value : ''
      } 
    })
    chrome.cookies.get({url:"https://qx.justeasy.cn",name:'PHPSESSID'},function(cookie){
        if(cookie){
          qxy_token = cookie.value ? cookie.value : ''
        } 
    })
    setTimeout(()=>{
      console.log("qxy_uid:",qxy_uid,"qxy_token:",qxy_token)
      if(qxy_uid != '' && qxy_token != ''){
        if(dataArray!=''){
          for(let i = 0 ; i<dataArray.length;i++){
            timeCloutIndex = i
            timesClout[i] = setTimeout(function(){
                dataAjax(dataArray[i])
              },1*i*1000)   
          }  
          //let ReturnValue = {typeName:'login'}
          //scriptMessage(ReturnValue)  
        }
        if(data.origin == 'singular' ){
          let ReturnValue = {typeName:'buttonlogin'}
          setTimeout(()=>{
            scriptMessage(ReturnValue)  
          },200)
        } 
      } else {
        let ReturnValue = {typeName:'login'}
        setTimeout(()=>{
          scriptMessage(ReturnValue)  
        },200)
        
        layerLogin()
      }
      sendResponse(data); 
    },200)   
  });
  getLocalStorage();
}
receiveMsg();
function dataAjax(dataArray){
    chrome.cookies.get({url:"https://qx.justeasy.cn",name:'uid'},function(cookie){
      if(cookie){
        qxy_uid = cookie.value ? cookie.value : ''
      } 
    })
    chrome.cookies.get({url:"https://qx.justeasy.cn",name:'PHPSESSID'},function(cookie){
      if(cookie){
        qxy_token = cookie.value ? cookie.value : ''
      } 
    }) 
    $.ajax({
        url:"https://qx.justeasy.cn/Api/Image/sendpics.php",
        type:'post',
        dataType:'json',
        data:{'pics':dataArray,"uid":qxy_uid,"token":qxy_token},
    }).done(function(res){
          if(res.status === 201) {
          for(let i = 0 ; i<timesClout.length;i++){
              if(timesClout[i] !=undefined){
                clearTimeout(timesClout[i]);
              }
          }
          layerLogin()
        }else if(res.status === 200) {
          localSetStorage(res.pathMd5)
        }else if(res.status === 500){
          localSetStorage(res.pathMd5)
          let ReturnValue = {typeName:'Message',messages:res.msg}
          setTimeout(()=>{
            scriptMessage(ReturnValue)
          },200)
          
        }
      })
       
}
/**登录窗口弹出 */
function layerLogin(){
      let href = "https://qx.justeasy.cn/login.html?dialog=1";
      var features = 'status=no,resizable=no,scrollbars=yes,'+ "personalbar=no,directories=no,location=no,toolbar=no,"+ "menubar=no,width=925,height=600,left=0,top=0";
      console.log(href.indexOf('chrome-extension'))
      if (href && href.indexOf('chrome-extension')) window.open(href,"",features);  
}

/** 存储对应的已上传的数据*/
var localData = [];
var silderRange = true;
function getLocalStorage(){
  chrome.storage.local.get('uploadCookie',function(item){
    if(item.uploadCookie!= undefined || item.uploadCookie!='undefined' || item.uploadCookie!= null || item.uploadCookie!=''){
      localData = item.uploadCookie ? item.uploadCookie : []
    }
  })
}
function localSetStorage(data){
  localData.push(data);
  chrome.storage.local.set({"uploadCookie":localData});
  let ReturnValue = {typeName:'getCookie'}
  setTimeout(()=>{
    scriptMessage(ReturnValue)
  },200)
 
}
/*用于情况通知给scriptHtml.js通知*/
function scriptMessage(data){
  chrome.tabs.query({active: true, currentWindow: true},function(tabs){
    var tab = tabs[0];
    //if (tab.url.replace(/^https?:\/\/(www)?/, '').indexOf('justeasy.cn') === 1) return;
    //console.log(tab.url.replace(/^https?:\/\/(www)?/, '').indexOf('justeasy.cn'))
    const connect = chrome.tabs.connect(tab.id, {name: data.typeName});
		connect.postMessage(data);
    connect.onMessage.addListener((mess) => { })
  })
}

/**发送已经上传返回的数据到前台 */
function uploadData(data){
 
}







