$(function(){
    jQuery.support.cors = true;
    //手机号
    var register_phone='';
    //密码
    var register_pwd='';
    //图片验证码
    var register_imgCode='';

    imgCode();//图片验证码

    /*动态获取背景图片*/
    $.ajax({
        type:"GET",
        url: 'http://192.168.1.96:21000/web-api/queryIndexAd/2',
        dataType: 'json',
        success:function(data){
            var timestamp = Date.parse(new Date());
            timestamp = timestamp / 1000;
            if(data.data.defaultAdvertisingPopups == null || data.data.defaultAdvertisingPopups == ''){
                $.ajax({
                    type:"GET",
                    url: 'http://192.168.1.96:21000/web-api/queryIndexAd/4',
                    dataType: 'json',
                    success:function(list){
                        var beginTime=list.data.defaultAdvertisingPopups.beginTime/1000;
                        var endTime=list.data.defaultAdvertisingPopups.endTime/1000;
                        if((list.data.defaultAdvertisingPopups != '') && (beginTime <= timestamp) && (timestamp <= endTime)){
                            var picUrl=list.data.defaultAdvertisingPopups.picUrl;
                            $('.register-h').css('background-image','url("' + picUrl + ' ")');
                        }
                    }
                });
            }else{
                var endTime=data.data.defaultAdvertisingPopups.endTime/1000;
                if(timestamp > endTime){
                    $.ajax({
                        type:"GET",
                        url: 'http://192.168.1.96:21000/web-api/queryIndexAd/4',
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

    /*图片验证码*/
    function imgCode(){
        $.ajax({
            type:'get',
            url:'http://192.168.1.96:21000/web-api/picCaptcha/webRegist',
            dateType:'json',
            success:function(data){
                if(data.meta.code == 200) {
                    $('.form_register .user_imgCode').attr('data-id',data.data.identifyCode);
                    var picBase = data.data.pic;
                    $('.form_register .getCodeImg').attr('src','data:image/png;base64,' + picBase);
                }else {
                    alert(data.meta.message);
                }
            }
        });
    }

    /*图片验证码点击刷新*/
    $('.form_register .getCodeImg').click(function(){
        imgCode();
    });

    /*密码显示与隐藏*/
    $('.form_register .user_pwd_eyes').click(function(){
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
    $('.form_register .form-item input').focus(function(){
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
    $('.form_register .form-item input').blur(function(){
        //改变边框颜色
        $(this).parent().css('border-bottom',' 1px solid #b8b8b8');
        //删除input-trip中focus_message
        $('.input-trip .focus_message').remove();
    });

    /*手机号验证*/
    $('.form_register .user_phone').focus(function(){//获取焦点
        if(register_phone == true){
            //隐藏提示信息
            $(this).parent().parent().next('.input-trip').children('.error_message').css('display','none');
            $(this).parent().parent().next('.input-trip').children('.focus_message').remove();
        }
    });
    $('.form_register .user_phone').blur(function(){//失去焦点
        //手机号正则
        var regPhone=/^1\d{10}$/;
        //输入手机号
        var userPhone=$(this).val();
        if(userPhone == '' || !(regPhone.test(userPhone))){
            $(this).parent().parent().next('.input-trip').children('.focus_message').remove();
            $(this).parent().parent().next('.input-trip').children('.error_message').css('display','block');
            register_phone = false;
        }else{
            $.ajax({
                type:'get',
                url:'http://192.168.1.96:21000/web-api/mobileRegistVerify/' + userPhone,
                dateType:'json',
                success:function(data){
                    if(data.meta.code == 200){
                        if(data.data.isExist == 1) {
                            $('.form_register .user_phone').parent().parent().next('.input-trip').children('.focus_message').remove();
                            $('.form_register .user_phone').parent().parent().next('.input-trip').children('.error_message').css('display','block');
                            register_phone = false;
                        }else{
                            register_phone = true;//隐藏提示信息
                            $('.form_register .user_phone').parent().parent().next('.input-trip').children('.focus_message').remove();
                            $('.form_register .user_phone').parent().parent().next('.input-trip').children('.error_message').css('display','none');
                        }
                    }else {
                        alert(data.meta.message);
                    }
                }
            });
        }
    });

    /*密码验证*/
    $('.form_register .user_pwd').focus(function(){//获取焦点
        if(register_pwd == true){
            //隐藏提示信息
            $(this).parent().parent().next('.input-trip').children('.error_message').css('display','none');
            $(this).parent().parent().next('.input-trip').children('.pwd_error').css('display','none');
            $(this).parent().parent().next('.input-trip').children('.focus_message').remove();
        }
    });
    $('.form_register .user_pwd').blur(function(){
        //密码正则
        var regPwd=/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
        //获取输入密码
        var inputPwd=$(this).val();
        if(inputPwd == ''){
            $(this).parent().parent().next('.input-trip').children('.focus_message').remove();
            $(this).parent().parent().next('.input-trip').children('.pwd_error').css('display','none');
            $(this).parent().parent().next('.input-trip').children('.error_message').css('display','block');
            register_pwd = false;
        }else if(!(regPwd.test(inputPwd))){
            $(this).parent().parent().next('.input-trip').children('.focus_message').remove();
            $(this).parent().parent().next('.input-trip').children('.pwd_error').css('display','block');
            $(this).parent().parent().next('.input-trip').children('.error_message').css('display','none');
            register_pwd = false;
        }else{
            register_pwd = true;//隐藏提示信息
            $(this).parent().parent().next('.input-trip').children('.focus_message').remove();
            $(this).parent().parent().next('.input-trip').children('.pwd_error').css('display','none');
            $(this).parent().parent().next('.input-trip').children('.error_message').css('display','none');
        }
    });

    /*图片验证码验证*/
    $('.form_register .user_imgCode').focus(function(){
        if(register_imgCode == true){
            //隐藏提示信息
            $(this).parent().parent().next('.input-trip').children('.error_message').css('display','none');
            $(this).parent().parent().next('.input-trip').children('.focus_message').remove();
        }
    });
    $('.form_register .user_imgCode').blur(function(){
        //获取输入图片验证码
        var inputImgCode=$(this).val();
        if(inputImgCode==''){
            $(this).parent().parent().next('.input-trip').children('.focus_message').remove();
            $(this).parent().parent().next('.input-trip').children('.error_message').css('display','block');
            register_imgCode = false;
        }else{
            register_imgCode = true;//隐藏提示信息
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

    /*短信验证码*/
    $('.form_register .getSmsCode_s').click(function(){
        var picCode=$('.form_register .user_imgCode').val();
        //拿到手机号
        var inputPhone=$('.form_register .user_phone').val();
        if(inputPhone == ''){
            $('.form_register .user_phone').parent().parent().next('.input-trip').children('.focus_message').remove();
            $('.form_register .user_phone').parent().parent().next('.input-trip').children('.error_message').css('display','block');
            register_phone = false;
        }else{
            register_phone = true;//隐藏提示信息
            $('.form_register .user_phone').parent().parent().next('.input-trip').children('.focus_message').remove();
            $('.form_register .user_phone').parent().parent().next('.input-trip').children('.error_message').css('display','none');
            var postData = {
                'userPhone': inputPhone.toString(),
                'identifyCode': $('.form_register .user_imgCode').attr('data-id'),
                'picCode': picCode,
                'picType': 'webRegist',
                'smsType': 'register_by_mobile_number'
            };
            $.ajax({
                url: 'http://192.168.1.96:21000/web-api/generateRegisterAuthCode',
                type: 'post',
                contentType: "application/json;charset=UTF-8",
                data: JSON.stringify(postData),
                dataType: 'json',
                success: function (response) {
                    if(response.meta.code == 200) {
                        sendTime = 60;
                        time($('.getCodeBtn'));
                        register_imgCode = true;
                        $('.form_register .user_imgCode').parent().parent().next('.input-trip').children('.focus_message').remove();
                        $('.form_register .user_imgCode').parent().parent().next('.input-trip').children('.error_message').css('display','none');
                    }else if(response.meta.code == 1002){
                        $('.form_register .user_imgCode').parent().parent().next('.input-trip').children('.focus_message').remove();
                        $('.form_register .user_imgCode').parent().parent().next('.input-trip').children('.error_message').css('display','block');
                        register_imgCode = false;
                    }
                    else {
                        $('.form_register .user_noteCode').parent().parent().next('.input-trip').children('.error_message').css('display','block');
                        $('.form_register .user_noteCode').parent().parent().next('.input-trip').children('span').html(response.meta.message);
                    }
                }
            })
        }
    });

    /*推荐人*/
    $('#referrer').change(function(){
        if($('#referrer').prop("checked") == true){
            $('.form_register .referrer-input').css('display','block');
        }else{
            $('.form_register .user_referrer_phone').parent().parent().next('.input-trip').children('.error_message').css('display','none');
            $('.form_register .referrer-input').css('display','none');
        }
    });

    /*注册*/
    $('#register-checkbox').change(function(){
        if($('#register-checkbox').prop('checked')==true){
            $('.form_register .register-btn').css({'background-color':'#2875d9','cursor':'pointer'});
            $('.form_register .register-btn').click(function(e){
                e.preventDefault();
                //获取输入手机号
                var inputPhone=$('.form_register .user_phone').val();
                //获取输入短信验证码
                var inputNoteCode=$('.form_register .user_noteCode').val();
                //获取推荐人手机号
                var referrerPhone=$('.form_register .user_referrer_phone').val();
                //验证手机号
                if(register_phone == false){
                    $('.form_register .user_phone').parent().parent().next('.input-trip').children('.focus_message').remove();
                    $('.form_register .user_phone').parent().parent().next('.input-trip').children('.error_message').css('display','block');
                    return;
                }
                //验证密码
                else if(register_pwd == false){
                    $('.form_register .user_pwd').parent().parent().next('.input-trip').children('.focus_message').remove();
                    $('.form_register .user_pwd').parent().parent().next('.input-trip').children('.pwd_error').css('display','none');
                    $('.form_register .user_pwd').parent().parent().next('.input-trip').children('.error_message').css('display','block');
                    return;
                }
                //验证图片验证码
                else if(register_imgCode==false){
                    $('.form_register .user_imgCode').parent().parent().next('.input-trip').children('.focus_message').remove();
                    $('.form_register .user_imgCode').parent().parent().next('.input-trip').children('.error_message').css('display','block');
                    return;
                }
                //验证短信验证码
                else if(inputNoteCode == ''){
                    $('.form_register .user_noteCode').parent().parent().next('.input-trip').children('.focus_message').remove();
                    $('.form_register .user_noteCode').parent().parent().next('.input-trip').children('.error_message').css('display','block');
                    return;
                }
                //验证推荐人手机号
                else if($('#referrer').prop("checked") == true){
                    if(referrerPhone == '' || inputPhone == referrerPhone || !(regPhone.test(referrerPhone))){
                        $('.form_register .user_referrer_phone').parent().parent().next('.input-trip').children('.focus_message').remove();
                        $('.form_register .user_referrer_phone').parent().parent().next('.input-trip').children('.error_message').css('display','block');
                        return;
                    }
                }
            });
        }else{
            $('.form_register .register-btn').css({'background-color':'#aaa','cursor':'default'});
            $('.form_register .register-btn').removeAttr('href');
        }
    });
});
