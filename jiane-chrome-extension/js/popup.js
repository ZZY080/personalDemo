
/**正常页面和设置之间的切换 */
let config = document.getElementById('config');
let gohost = document.getElementById('host');
let popup_main = document.getElementById('popup_main');
let popup_config = document.getElementById('popup_config');
config.addEventListener('click',function(){
	popup_main.style.display = "none";
	popup_config.style.display = "block";
})
gohost.addEventListener('click',function(){
	popup_main.style.display = "block";
	popup_config.style.display = "none";
})
/**
 * 图片采集按钮是否显示
 * 默认为1 显示
 * 2 不显示
 * */
let toggle_yes_button = document.getElementById('toggle_yes_button');
let toggle_no_button = document.getElementById('toggle_no_button');
var valueStatus = '1'; 
toggle_yes_button.addEventListener('change',function(e){
	valueStatus = e.target.value;
	chrome.storage.local.set({'valueStatus':e.target.value ? e.target.value : valueStatus})
	allPicImages('myConfig');
})
toggle_no_button.addEventListener('change',function(e){
	valueStatus = e.target.value;
	chrome.storage.local.set({'valueStatus':e.target.value ? e.target.value : valueStatus})
	allPicImages('myConfig');
})

/**设置抓取的最小图片宽度*/
let rangeInput = document.getElementById("rangeInput");
let outputText = document.getElementById("outputText");
var outputValue = '200';
rangeInput.addEventListener('change',function(e){
	outputText.innerText = e.target.value + 'px';
	outputValue = e.target.value;
	chrome.storage.local.set({'outputValue':e.target.value ? e.target.value : outputValue})
	allPicImages('myConfig')
})
/**读取配置缓存*/
function getLocalStatus(){
	chrome.storage.local.get('valueStatus',function(item){
		if(item.valueStatus){
			if(item.valueStatus==1){
				toggle_yes_button.checked = true
			}else{
				toggle_no_button.checked = true
			}
		}else{
			toggle_yes_button.checked = true
		}	
	})
	
	chrome.storage.local.get('outputValue',function(item){
		if(item.outputValue!='' && item.outputValue!=undefined && item.outputValue !='undefined'){
			console.log(item.outputValue)
			outputText.innerText = item.outputValue + 'px';
			rangeInput.value = item.outputValue;
		}else{
			outputText.innerText = 200 + 'px';
			rangeInput.value = 200
		}
		
	})	
}

/**当前网站域名 */
var domainUrl = '';
/**
 * 需要屏蔽的域名
 * @returns 
 */
const domainArrayData = ['qx.justeasy.cn'];
function getCurrentTabId() {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			//domainUrl
			 if(tabs){
			 let tabsData = tabs[0].url.split('/');
				//console.log(tabsData)
				domainUrl = tabsData[2]
			 }
            resolve(tabs.length ? tabs[0].id : null)
        });
    })
}
async function allPicImages(item) {
    const tabId = await getCurrentTabId();
	if(domainArrayData.includes(domainUrl)){
		if(item==="myConnect"){
			alert('此网站已屏蔽采集');	
		}	
	}else{
		const connect = chrome.tabs.connect(tabId, {name: item});
		connect.postMessage('我是哈哈哈');
    	connect.onMessage.addListener((mess) => {})
	}   
}
/***采集网站所有图片 */

$("#save-images").click((e)=>{
	let qxy_uid='',qxy_token='';
	let href = "https://qx.justeasy.cn/login.html?dialog=1";
	var features = 'status=no,resizable=no,scrollbars=yes,'+ "personalbar=no,directories=no,location=no,toolbar=no,"+ "menubar=no,width=925,height=600,left=0,top=0"
	chrome.cookies.get({url:"https://qx.justeasy.cn",name:'uid'},function(cookie){
		if(cookie){
			qxy_uid = cookie.value ? cookie.value : '';	
		}
	})
	chrome.cookies.get({url:"https://qx.justeasy.cn",name:'PHPSESSID'},function(cookie){
		if(cookie){
			qxy_token = cookie.value ? cookie.value : '';
		}
	})
	setTimeout(()=>{
		if(qxy_uid=='' || qxy_token==''){
			if (href && !~href.indexOf('chrome-extension')) window.open(href,"",features);
		}else{
			allPicImages('myConnect');
			loginOut()
		}
	},200)
}) 

$("#loginOut").click((e)=>{
	chrome.cookies.remove({url:"https://qx.justeasy.cn",name:'uid'},function(cookie){
		loginOut();
	})
	chrome.cookies.remove({url:"https://qx.justeasy.cn",name:'PHPSESSID'},function(cookie){
		loginOut();
	})
	
})

function loginOut(){
	let qxy_uid='',qxy_token='';
	chrome.cookies.get({url:"https://qx.justeasy.cn",name:'uid'},function(cookie){
		if(cookie){
			qxy_uid = cookie.value ? cookie.value : '';	
		}
	})
	chrome.cookies.get({url:"https://qx.justeasy.cn",name:'PHPSESSID'},function(cookie){
		if(cookie){
			qxy_token = cookie.value ? cookie.value : '';
		}
	})
	setTimeout(()=>{
		if(qxy_uid=='' || qxy_token==''){
			$("#loginOut").hide();
		}else{
			$("#loginOut").show()
		}
	},200)
}
loginOut()

window.addEventListener('load',function(){
	getLocalStatus();
})





