$(function(){
   jQuery.support.cors = true;

   //密码登录手机号
   var login_pwdphone='';
   //密码
   var login_pwd='';
   //验证码登录手机号
   var login_codephone='';
   //验证码
   var login_code='';

   /*动态获取背景图片*/
   $.ajax({
       type:"GET",
       url: 'http://192.168.1.96:21000/web-api/queryIndexAd/3',
       dataType: 'json',
       success:function(data){
           var timestamp = Date.parse(new Date());
           timestamp = timestamp / 1000;
           if(data.data.defaultAdvertisingPopups == null || data.data.defaultAdvertisingPopups == ''){
                $.ajax({
                    type:"GET",
                    url: 'http://192.168.1.96:21000/web-api/queryIndexAd/5',
                    dataType: 'json',
                    success:function(list){
                        var beginTime=list.data.defaultAdvertisingPopups.beginTime/1000;
                        var endTime=list.data.defaultAdvertisingPopups.endTime/1000;
                        if((list.data.defaultAdvertisingPopups != '') && (beginTime <= timestamp) && (timestamp <= endTime)){
                            var picUrl=list.data.defaultAdvertisingPopups.picUrl;
                            $('.login-h').css('background-image','url("' + picUrl + ' ")');
                        }
                    }
                });
           }else{
               var endTime=data.data.defaultAdvertisingPopups.endTime/1000;
               if(timestamp > endTime){
                   $.ajax({
                       type:"GET",
                       url: 'http://192.168.1.96:21000/web-api/queryIndexAd/5',
                       dataType: 'json',
                       success:function(list){
                           var beginTime=list.data.defaultAdvertisingPopups.beginTime/1000;
                           var endTime=list.data.defaultAdvertisingPopups.endTime/1000;
                           if((list.data.defaultAdvertisingPopups != '') && (beginTime <= timestamp) && (timestamp <= endTime)){
                               var picUrl=list.data.defaultAdvertisingPopups.picUrl;
                               $('.login-h').css('background-image','url("' + picUrl + ' ")');
                           }
                       }
                   });
               }else{
                   var picUrl=data.data.defaultAdvertisingPopups.picUrl;
                   $('.login-h').css('background-image','url("' + picUrl + ' ")');
               }
           }
       }
   });

   /*选项卡*/
   $('.tab li p').click(function(){
      //获取当前id
      var id_name=$(this).attr('id');
      //删除tab-content子元素div的show
      $('.tab-content > div').removeClass('show');
      //给class为id_name的div加show
      $('.'+id_name).addClass('show');
      //删掉p的tabCur
      $('.tab li p').removeClass('tabCur');
      //给当前被点击加tabCur
      $(this).addClass('tabCur');
      //删除错误提示
      $('.error_message').css('display','none');
   });
   $('#pwdLogin').click(function(){
       window.location.replace("login.html")
   });

   /*密码显示与隐藏*/
   $('.tab-content .user_pwd_eyes').click(function(){
        var eyeType=$(this).siblings('.user_pwd').attr('type');
        if(eyeType == 'text'){
            $(this).css('background-image','url("images/icon-eyesClose.png")');
            $(this).siblings('.user_pwd').attr('type','password');
        }else{
            $(this).css('background-image','url("images/icon-eyesOpen.png")');
            $(this).siblings('.user_pwd').attr('type','text');
        }
    });

    /*输入框获取焦点*/
    $('.tab-content .form-item input').focus(function(){
        //placeholder隐藏
        $(this).attr('placeholder',' ');
        //改变边框颜色
        $(this).parent().css('border-bottom',' 1px solid #2875d9');
        if($(this).val()==''){
            //删除input-trip中focus_message
            $('.input-trip .focus_message').remove();
            //error_message隐藏
            $(this).parent().parent().next().children('.error_message').css('display','none');
            //获取input的default
            var default_message=$(this).attr('default');
            //放到下一个input-trip中
            $(this).parent().parent().next().prepend(default_message);
        }
    });

    /*输入框失去焦点*/
    $('.tab-content .form-item input').blur(function(){
        //改变边框颜色
        $(this).parent().css('border-bottom',' 1px solid #b8b8b8');
        //删除input-trip中focus_message
        $('.input-trip .focus_message').remove();
    });

   /*密码登录手机号验证*/
   $('.pwdLogin .user_phone').focus(function(){
       if(login_pwdphone == true){
           //隐藏提示信息
           $(this).parent().parent().next('.input-trip').children('.focus_message').remove();
           $(this).parent().parent().next('.input-trip').children('.error_message').css('display','none');
       }
   });
   $('.pwdLogin .user_phone').blur(function(){
       //获取输入手机号
       var inputPhone=$(this).val();
       if(inputPhone == ''){
           $(this).parent().parent().next('.input-trip').children('.focus_message').remove();
           $(this).parent().parent().next('.input-trip').children('.error_message').css('display','block');
           login_pwdphone = false;
       }else{
           login_pwdphone = true;
           //隐藏提示信息
           $(this).parent().parent().next('.input-trip').children('.focus_message').remove();
           $(this).parent().parent().next('.input-trip').children('.error_message').css('display','none');
       }
   });

   /*密码验证*/
   $('.pwdLogin .user_pwd').focus(function(){
       if(login_pwd == true){
           //隐藏提示信息
           $(this).parent().parent().next('.input-trip').children('.error_message').css('display','none');
           $(this).parent().parent().next('.input-trip').children('.pwd_error').css('display','none');
           $(this).parent().parent().next('.input-trip').children('.focus_message').remove();
       }
   });
   $('.pwdLogin .user_pwd').blur(function(){
       //密码正则
       var regPwd=/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
       //获取输入密码
       var inputPwd=$(this).val();
       if(inputPwd == ''){
           $(this).parent().parent().next('.input-trip').children('.focus_message').remove();
           $(this).parent().parent().next('.input-trip').children('.pwd_error').css('display','none');
           $(this).parent().parent().next('.input-trip').children('.error_message').css('display','block');
           login_pwd = false;
       }else if(!(regPwd.test(inputPwd))){
           $(this).parent().parent().next('.input-trip').children('.focus_message').remove();
           $(this).parent().parent().next('.input-trip').children('.error_message').css('display','none');
           $(this).parent().parent().next('.input-trip').children('.pwd_error').css('display','block');
           login_pwd = false;
       }else{
           login_pwd = true;
           //隐藏提示信息
           $(this).parent().parent().next('.input-trip').children('.focus_message').remove();
           $(this).parent().parent().next('.input-trip').children('.error_message').css('display','none');
           $(this).parent().parent().next('.input-trip').children('.error_message').css('display','none');
       }
   });

   /*验证码登录手机号验证*/
    $('.codeLogin .user_phone').focus(function(){
        if(login_codephone == true){
            //隐藏提示信息
            $(this).parent().parent().next('.input-trip').children('.focus_message').remove();
            $(this).parent().parent().next('.input-trip').children('.error_message').css('display','none');
        }
    });
   $('.codeLogin .user_phone').blur(function(){
       //手机号正则
        var regPhone=/^1\d{10}$/;
       //获取输入手机号
       var inputPhone=$(this).val();
       if(inputPhone == '' || !(regPhone.test(inputPhone))){
           $(this).parent().parent().next('.input-trip').children('.focus_message').remove();
           $(this).parent().parent().next('.input-trip').children('.error_message').css('display','block');
           login_codephone = false;
       }else{
           login_codephone = true;
           //隐藏提示信息
           $(this).parent().parent().next('.input-trip').children('.focus_message').remove();
           $(this).parent().parent().next('.input-trip').children('.error_message').css('display','none');
       }
   });

   /*验证码登录验证码验证*/
   $('.codeLogin .user_code').focus(function(){
       if(login_code == true){
           //隐藏提示信息
           $(this).parent().parent().next('.input-trip').children('.focus_message').remove();
           $(this).parent().parent().next('.input-trip').children('.error_message').css('display','none');
       }
   });
   $('.codeLogin .user_code').blur(function(){
       //获取短信验证码
       var inputCode=$('.codeLogin .user_code').val();
       if(inputCode == ''){
           $(this).parent().parent().next('.input-trip').children('.focus_message').remove();
           $(this).parent().parent().next('.input-trip').children('.error_message').css('display','block');
           login_code = false;
       }else{
           login_code = true;
           //隐藏提示信息
           $(this).parent().parent().next('.input-trip').children('.focus_message').remove();
           $(this).parent().parent().next('.input-trip').children('.error_message').css('display','none');
       }
   });

   /*短信验证码倒计时*/
   var sendTime;
   function time(ele) {
        if(sendTime == 0) {
            ele.removeAttr('disabled');
            ele.text("获取短信验证码");
            ele.addClass('getSmsCode_s');
        }else {
            ele.attr('disabled',true);
            ele.text("已发送..." + sendTime + "s");
            ele.removeClass('getSmsCode_s');
            sendTime --;
            setTimeout(function () {
                time(ele);
            },1000);
        }
   }

   /*获取短信验证码*/
   $('.codeLogin .getSmsCode_s').click(function(){
       //拿到手机号
       var inputPhone=$('.codeLogin .user_phone').val();
       if(inputPhone == ''){
           $('.codeLogin .user_phone').parent().parent().next('.input-trip').children('.focus_message').remove();
           $('.codeLogin .user_phone').parent().parent().next('.input-trip').children('.error_message').css('display','block');
           login_codephone = false;
       }else{
           login_codephone = true;
           //隐藏提示信息
           $('.codeLogin .user_phone').parent().parent().next('.input-trip').children('.focus_message').remove();
           $('.codeLogin .user_phone').parent().parent().next('.input-trip').children('.error_message').css('display','none');
           var postData = {
               'userPhone': inputPhone.toString(),
               'smsType': 'login_by_sms_authCode'
           };
           $.ajax({
               url: 'http://192.168.1.96:21000/web-api/generateSmsLoginAuthCode',
               type: 'post',
               contentType: "application/json;charset=UTF-8",
               data: JSON.stringify(postData),
               dataType: 'json',
               success: function (response) {
                   if(response.meta.code == 200) {
                       sendTime = 60;
                       time($('.getCodeBtn'));
                   }else {
                       alert(response.meta.message);
                   }
               }
           })
       }
   });

   /*密码登录*/
   $('.pwdLogin .login-btn').click(function(){
       if(login_pwdphone == false){//验证手机号
           $('.pwdLogin .user_phone').parent().parent().next('.input-trip').children('.focus_message').remove();
           $('.pwdLogin .user_phone').parent().parent().next('.input-trip').children('.error_message').css('display','block');
           return;
       }else if(login_pwd == false){//验证密码
           $('.pwdLogin .user_pwd').parent().parent().next('.input-trip').children('.focus_message').remove();
           $('.pwdLogin .user_pwd').parent().parent().next('.input-trip').children('.error_message').css('display','none');
           $('.pwdLogin .user_pwd').parent().parent().next('.input-trip').children('.error_message').css('display','block');
           return;
       }
   });

   /*验证码登录*/
   $('.codeLogin .login-btn').click(function(){
       if(login_pwdphone == false){//验证手机号
           $('.codeLogin .user_phone').parent().parent().next('.input-trip').children('.focus_message').remove();
           $('.codeLogin .user_phone').parent().parent().next('.input-trip').children('.error_message').css('display','block');
           return;
       }else if(login_code == false){//验证短信验证码
           $('.codeLogin .user_code').parent().parent().next('.input-trip').children('.focus_message').remove();
           $('.codeLogin .user_code').parent().parent().next('.input-trip').children('.error_message').css('display','block');
           return;
       }
   });
});
