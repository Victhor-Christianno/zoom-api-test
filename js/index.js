(function(){

	console.log('checkSystemRequirements');
	console.log(JSON.stringify(ZoomMtg.checkSystemRequirements()));

    // it's option if you want to change the WebSDK dependency link resources. setZoomJSLib must be run at first
    // if (!china) ZoomMtg.setZoomJSLib('https://source.zoom.us/1.7.8/lib', '/av'); // CDN version default
    // else ZoomMtg.setZoomJSLib('https://jssdk.zoomus.cn/1.7.8/lib', '/av'); // china cdn option 
    // ZoomMtg.setZoomJSLib('http://localhost:9999/node_modules/@zoomus/websdk/dist/lib', '/av'); // Local version default, Angular Project change to use cdn version
    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareJssdk();
    
    var API_KEY = 'change_key';
    var API_SECRET = 'change_secret';

    testTool = window.testTool;
    document.getElementById('display_name').value = "Teste Api"
    document.getElementById('meeting_number').value = 0; // PMI Number
    document.getElementById('meeting_pwd').value = ""; // PMI Pass
    if (testTool.getCookie("meeting_lang")) document.getElementById('meeting_lang').value = testTool.getCookie("meeting_lang");
   
    document.getElementById('meeting_lang').addEventListener('change', function(e){
        testTool.setCookie("meeting_lang", document.getElementById('meeting_lang').value);
        $.i18n.reload(document.getElementById('meeting_lang').value);
        ZoomMtg.reRender({lang: document.getElementById('meeting_lang').value});
    });
    
    document.getElementById('clear_all').addEventListener('click', function(e) {
        testTool.deleteAllCookies();
        document.getElementById('display_name').value = '';
        document.getElementById('meeting_number').value = '';
        document.getElementById('meeting_pwd').value = '';
        document.getElementById('meeting_lang').value = 'en-US';
        document.getElementById('meeting_role').value = 0;
    });


    document.getElementById('join_meeting').addEventListener('click', function(e){

        e.preventDefault();

    
        var meetConfig = {
            apiKey: API_KEY,
            apiSecret: API_SECRET,
            meetingNumber: document.getElementById('meeting_number').value,
            userName: document.getElementById('display_name').value,
			userEmail: 'victhor.silva@i2tech.com.br',
            passWord: document.getElementById('meeting_pwd').value,
            leaveUrl: "http://www.google.com",
            role: document.getElementById('meeting_role').value
        };
        testTool.setCookie("meeting_number", meetConfig.meetingNumber);
        testTool.setCookie("meeting_pwd", meetConfig.passWord);
        

        var signature = ZoomMtg.generateSignature({
            meetingNumber: meetConfig.meetingNumber,
            apiKey: meetConfig.apiKey,
            apiSecret: meetConfig.apiSecret,
            role: meetConfig.role,
            success: function(res){
                console.log(res.result);
            }
        });

        ZoomMtg.init({
            leaveUrl: 'http://www.google.com',
            success: function () {
                ZoomMtg.join(
                    {
                        meetingNumber: meetConfig.meetingNumber,
                        userName: meetConfig.userName,
                        signature: signature,
                        apiKey: meetConfig.apiKey,
                        passWord: meetConfig.passWord,
                        success: function(res){
                            $('#nav-tool').hide();
                            console.log('join meeting success');
                        },
                        error: function(res) {
                            console.log(res);
                        }
                    }
                );
            },
            error: function(res) {
                console.log(res);
            }
        });

    });




})();
