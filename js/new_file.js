
$(function(){
	//抽奖次数/中奖时间的过期时间
//	var time = (new Date()).getTime();
	var sjian = new Date();
	sjian.setDate(sjian.getDate()+1);
	//中奖时间
//	var da = new Date();   
//	var oDa = da.toLocaleDateString()+da.toLocaleTimeString();
	
	var arr = [0,7,7,7,7,1,7,7,7,7,2,7,7,7,7,3,7,7,7,7,3,7,7,7,7,4,7,7,7,7,5,7,7,7,6];
	var num = null;
	var i = 0;//图片索引
	var speed = 100; //速度
	var oTime = 0;   //定时器
	var oClick = 0; //用户点击次数控制，定时器走完才可点击
	
	//抽奖次数
	var cs = 3;  
	if(getCookie("cishu")){
		var arr_cs = getCookie("cishu").split(",");
		cs = arr_cs[0];
		$("#cs").html(arr_cs[0]);
	}

	//开始游戏
	$("#warp > img:nth-of-type(2)").click(function(){
		$("#warp").css("display","none");
		$("#cj").css("display","block");
	})

	//开始抽奖点击事件
	$("#btn").click(function(){
		var a = parseInt(Math.random()*arr.length+1);
		num = arr[a];
		var bus = 24+num;//总步数
		
		if(oClick==0){
			start();
			cs--;
			if(cs>-1){
				$("#cs").html(cs);
				setCookie("cishu",[cs],sjian);
			}else{
				clearInterval(oTime);
				$("#cjcs").css("display","block");  //抽奖次数
				$("#mb").css("display","block");
			}
		}
		function start(){
			oTime = setInterval(function(){
				oClick = 1;
				i++;
				bus--;
				if(i==8){
					speed *= 1.2;
					clearInterval(oTime);
					start();
					i=0;
				}
				if(bus==3){
					speed = 500;
					clearInterval(oTime);
					start();
				}
				$("#box > img").eq(i).css("border","solid 3px aqua");
				$("#box > img").eq(i).siblings().css("border","solid 3px white");
				if(bus==0){
					clearInterval(oTime);
					if(i==7){
						$("#zjts").css("display","block"); //未中奖
						$("#mb").css("display","block");
					}else{  //中奖
						$("#nyzj").css("display","block");
						$("#mb").css("display","block");
						//ajax中奖弹窗
						$.ajax({
							url:"js/new_file1.json",
							dataType:"json",
							success:function(A0){
								if(i==0){
									var A0 = A0.A0;
								}
								else if(i==1){
									var A0 = A0.A1;
								}
								else if(i==2){
									var A0 = A0.A2;
								}
								else if(i==3){
									var A0 = A0.A3;
								}
								else if(i==4){
									var A0 = A0.A4;
								}
								else if(i==5){
									var A0 = A0.A5;
								}
								else if(i==6){
									var A0 = A0.A6;
								}
								$(".zjdz > p").html(""); //每次插入数据前，清空之前插入的内容
								for (var j = 0;j < A0.length;j++) {
									$(".zjdz").append("<p>"+A0[j]+"</p>"); //中奖弹窗
								}
							}
						});
					}
					speed = 100;
					oClick = 0;
				}
			},speed);
		}
	});
	
	//浏览器获取/失去焦点，动画...
	$(window).on("blur",function(){
		$("#lyt").removeClass("lytB").addClass("lytA");
	})
	$(window).on("focus",function(){
		$("#lyt").removeClass("lytA").addClass("lytB");
	})
	
	//ajax(游戏规则)
	$.ajax({
		url:"js/new_file1.json",
		dataType:"json",
		success:function(res){
			//ajax(游戏规则)
			var yxgzA = res.yxgzA;
			for(var i = 0;i<yxgzA.length;i++){
				$("#shuoming").append("<p>"+yxgzA[i]+"</p>");
			}
			//ajax(中奖名单)
			var yxgzA = res.wufenglbo;
			for(var i = 0;i<yxgzA.length;i++){
				$("#lyt").append("<li>"+yxgzA[i]+"</li>");
			}
		}
	});

	//游戏规则
	$("#yxgz").click(function(){
		$("#shuoming").css("display","block");
		$("#mb").css("display","block");
		$("#yxsm_btn").css({"z-index":"11","opacity":"1"});
	})
	$("#yxsm_btn").click(function(){ //确认
		$("#shuoming").css("display","none");
		$("#mb").css("display","none");
		$("#yxsm_btn").css({"z-index":"-1","opacity":"0"});
	})
	
	//我的奖品
	$("#wd_btn").click(function(){
		$("#user_login").css("display","block");
		$("#mb").css("display","block");
	})
	
	//个人信息验证
	var xm = /^[\u4e00-\u9fa5]{2,6}$/;  //姓名
	var phoneNum = /^[1-3]\d{10}$/;      //手机号
	$("#user").on("blur",function(){
		if(xm.test($(this).val())==true){
			$(".cuowu").html("√");
			$(".cuowu").css({"color":"limegreen","opacity":"1"});
			$(this).css("border-color","#EEEEEE");
		}else{
			$(".cuowu").html("X");
			$(".cuowu").css({"color":"red","opacity":"1"});
			$(this).css("border-color","orangered");
		}
	})
	$("#user").on("focus",function(){
		$(this).css("border-color","#EEEEEE");
	})
	$("#pass").on("focus",function(){
		$(this).css("border-color","#EEEEEE");
	})
	$("#pass").on("blur",function(){
		if(phoneNum.test($(this).val())==true){
			$(".zque").html("√");
			$(".zque").css({"color":"limegreen","opacity":"1"});
			$(this).css("border-color","#EEEEEE");
		}else{
			$(".zque").html("X");
			$(".zque").css({"color":"red","opacity":"1"});
			$(this).css("border-color","orangered");
		}
	})
	$("#submit").click(function(){ //确定按钮
		if(xm.test($("#user").val())==true&&phoneNum.test($("#pass").val())==true){
			$("#user_login").css("display","none");
			$("#mb").css("display","none");
			//location.reload();  //刷新
			//显示我的奖品
			$("#jping").css("display","block");
			//隐藏已发出的奖品
			$("#jp").css("display","none");
			var src_1 = "img/jg_03.jpg";
			$("#cj_src").attr("src",src_1);
		}
		if(!xm.test($("#user").val())&&!phoneNum.test($("#pass").val())||$("#user").val()==""){
			$(".cuowu").html("X");
			$(".cuowu").css({"color":"red","opacity":"1"});
			$(".zque").html("X");
			$(".zque").css({"color":"red","opacity":"1"});
			$("#user").css("border-color","orangered");
			$("#pass").css("border-color","orangered");
		}
	})
	$("#exit").click(function(){ //取消按钮
		$("#user_login").css("display","none");
		$("#mb").css("display","none");
		$("#user").val("");
		$("#pass").val("");
		$("#user").css("border-color","#EEEEEE");
		$("#pass").css("border-color","#EEEEEE");
		$(".cuowu").css({"color":"","opacity":"0"});
		$(".zque").css({"color":"","opacity":"0"});
	})
	
	//感谢参与(未中奖)
	$("#gxie_btn").click(function(){
		$("#zjts").css("display","none");
		$("#mb").css("display","none");
	})
	
	//抽奖次数
	$("#cjcs_btn").click(function(){
		$("#cjcs").css("display","none");
		$("#mb").css("display","none");
	})
	
	//中奖
	$("#nyzj_btn").click(function(){
		$("#nyzj").css("display","none");
		$("#mb").css("display","none");
	})
	
	//我的奖品点击立即兑换事件
	
	
	//我的奖品
	$.ajax({
		url:"js/new_file1.json",
		dataType:"json",
		success:function(A2){
			var wdjpingA = A2.wdjpingA;
			$(".wdjpA").append("<p>"+wdjpingA[0]+"</p>");
			$(".wdjpA").append("<p>"+wdjpingA[1]+"<span>"+666+"</span></p>");
			$(".wdjpA").append("<p>"+wdjpingA[2]+"<span>"+777+"</span></p>");
			for (var f = 3;f < wdjpingA.length;f++) {
				$(".wdjpA").append("<p>"+wdjpingA[f]+"</p>");
			}
			
			var wdjpingA = A2.wdjpingB;
			$(".wdjpB").append("<p>"+wdjpingA[0]+"</p>");
			$(".wdjpB").append("<p>"+wdjpingA[1]+"<span>"+666+"</span></p>");
			$(".wdjpB").append("<p>"+wdjpingA[2]+"<span>"+777+"</span></p>");
			for (var f = 3;f < wdjpingA.length;f++) {
				$(".wdjpB").append("<p>"+wdjpingA[f]+"</p>");
			}
		}
	});
	
	//继续抽奖
	$("#jg_04").click(function(){
		//显示已发出的奖品
		$("#jp").css("display","block");
		var src_1 = "img/jg_05.jpg";
		$("#cj_src").attr("src",src_1);
		//隐藏我的奖品
		$("#jping").css("display","none");
	})
	
	//立即兑奖
	var code = "1234";
	$(".lytAA").click(function(evt){
		$(".lyt1").css({"display":"block","z-index":"13"});
		$("#mb").css({"display":"block","z-index":"12"});
	})
	$(".bb > span:first-of-type").click(function(){ //确定
		if($("#mimaA").val()==""){
			$("#mimaA").val("请输入密码");
			$("#mimaA").css("border-color","red");
		}
		if($("#mimaA").val()!=code){
			$("#mimaA").val("密码不正确！");
			$("#mimaA").css("border-color","red");
		}else{
			$(".lyt1").css({"display":"none"});
			$("#mb").css({"display":"none","z-index":""});
			$("#mimaA").val("");
			$(".lytAA").html("以兑换");
			code = "4321";
			if(code=="4321"){
				$(".lytAA").off();
			}
		}
	})
	$(".bb > span:last-of-type").click(function(){ //取消
		$(".lyt1").css({"display":"none"});
		$("#mb").css({"display":"none","z-index":""});
		$("#mimaA").val("");
		$("#mimaA").css("border-color","#CCCCCC");
	})
	$("#mimaA").on("focus",function(){
		$("#mimaA").val("");
		$("#mimaA").css("border-color","#CCCCCC");
	})
	
	var code1 = "1234";
	$(".lytBB").click(function(evt){
		$(".lyt2").css({"display":"block","z-index":"13"});
		$("#mb").css({"display":"block","z-index":"12"});
	})
	$(".cc > span:first-of-type").click(function(){ //确定
		if($("#mimaB").val()==""){
			$("#mimaB").val("请输入密码");
			$("#mimaB").css("border-color","red");
		}
		if($("#mimaB").val()!=code1){
			$("#mimaB").val("密码不正确！");
			$("#mimaB").css("border-color","red");
		}else{
			$(".lyt2").css({"display":"none"});
			$("#mb").css({"display":"none","z-index":""});
			$("#mimaB").val("");
			$(".lytBB").html("以兑换");
			code1 = "4321";
			if(code1=="4321"){
				$(".lytBB").off();
			}
		}
	})
	$(".cc > span:last-of-type").click(function(){ //取消
		$(".lyt2").css({"display":"none"});
		$("#mb").css({"display":"none","z-index":""});
		$("#mimaB").val("");
		$("#mimaB").css("border-color","#CCCCCC");
	})
	$("#mimaB").on("focus",function(){
		$("#mimaB").val("");
		$("#mimaB").css("border-color","#CCCCCC");
	})
	
})
