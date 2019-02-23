window.onload=function  () {
	/*头像和姓名控制*/
	var tx_k = 0;
	var name_k = 0;
	
	$('#','name').value='';
	
	/*头像*/
	$('#','tou_img').onclick=function  () {
		$('#','file_img').click();
		
	};
	$('#','file_img').onchange=function  () {
	    var file = this.files[0];
	    var reader = new FileReader();
	     reader.readAsDataURL(file);
	     reader.onload = function (e) {
	     	e = event || e;
	       var base64Code=this.result;
	       
	       $('#','tx').src=base64Code;
	      
	       var tx_k = 1;
	     }
	};
	/*姓名*/
	$('#','name').onblur=function  () {
		if (this.value == '') {
			alert('请输入姓名！');
		} else{
			this.readonly = true;
			this.style.border = 'none';
			name_k = 1;
		}
	};
	$('#','name').onfocus=function  () {
			this.readonly = false;
			this.style.borderBottom = '1px solid #000';
	};
	
	
	/*获取开始按钮*/
	var play = $('#','play');
	/*获取遮罩*/
	var mask = $('#','mask');
	/*获取结束面板*/
	var result = $('.','result')[0];
	/*获取me的飞机*/
	var me = $('#','me');
	/*获取游戏区*/
	var sec = $('.','sec')[0];
	/*获取窗口大小*/
	var w = window.innerWidth || document.documentElement.clientWidth || document.clientWidth;
	var h = window.innerHeight || document.documentElement.clientHeight || document.clientHeight;
	/*居中*/
	// sec.style.left = (w-sec.offsetWidth)/2+'px';
	// sec.style.top = (h-sec.offsetHeight)/2+'px';
	play.style.left = (w-play.offsetWidth)/6+'px';
	play.style.top = (h-play.offsetHeight)/2+'px';
	// mask.style.left = (w-mask.offsetWidth)/2+'px';
	// mask.style.top = (h-mask.offsetHeight)/2+'px';
	// me.style.left = (sec.offsetWidth-me.offsetWidth)/2+'px';
	
	/*设置控制器*/
	var play_k = 0;
	var bg_k = 0;
	/*设置setInterval*/
	var bg_set,bg_w_set,time_set,e_set,b_set;
	
	/*开始游戏*/
	play.addEventListener('click',play_b);
	
	function play_b(){
		/*总分数设置*/
		var tally = 950;
		/*500分数设置*/
		var wubai = 0;
		
		if (play_k==0 && name_k == 1 && tx_k == 1) {
			/*清除遮罩*/
			 mask.style.display='none';
			 play.style.display='none';
			 /*背景自动切换*/
			bg_set = setInterval(function  () {
				if (bg_k == 0) {
					sec.style.background = '#DFD6BF';
					bg_k = 1;
				} else{
					sec.style.background = '#AFB4A7';
					bg_k = 0;
				}
			},10000);
			/*背景自动过渡*/
			var y = 0;
			bg_w_set = setInterval(function  () {
				y+=1;
				sec.style.backgroundPositionY = y+'px';
			},50);
			/*时间递增*/
			time_set = setInterval(function  () {
				var time = parseInt($('#','time').innerHTML);
				time+=1;
				$('#','time').innerHTML=time;
			},1000);
			/*鼠标同步*/
			sec.onmousemove=function  (e) {
				var evt = window.event || e;
				var x = evt.clientX - this.offsetLeft - me.offsetWidth/2;
				var y = evt.clientY - this.offsetTop - me.offsetHeight/2
				me.style.left = x +'px';
				me.style.top = y +'px';
				/*边缘检测*/
				side();
			}
			/*创建敌机*/
			e_set = setInterval(function  () {
				var e = document.createElement('article');
				e.className='e';
				var n = rand(1,3);
				e.title = n;
				e.style.background = 'url(img/e'+n+'.png) no-repeat';
				switch(n){
					case 2:
						e.style.width = '80px';
						e.style.height = '60px';
						break;
					case 3:
						e.style.width = '90px';
						e.style.height = '70px';
						break;
				}
				e.style.backgroundSize='100% 100%';
				var maxWidth = sec.offsetWidth-116;
				var rand_left = rand(0,maxWidth);
				e.style.left = rand_left +'px';
				sec.appendChild(e);
				/*让敌机飞*/
				var init = setInterval(function  () {
					var e_top = e.offsetTop;
					if ($('#','zf_val').innerHTML > 1000 && $('#','zf_val').innerHTML <= 2000) {
						e_top += 5;
					}else if($('#','zf_val').innerHTML > 2000){
						e_top += 7;
					} else {
						e_top += 4;
					}
					if (e_top >= sec.offsetHeight) {
						sec.removeChild(e);
						clearInterval(init);
						/*减分*/
						var point = $('#','point');
						var new_point = integ({opera:'-',score:point.innerHTML,en_point:n});
						if (new_point <= 0) {
							point.innerHTML = 0;
							tall_point = 0;
							n=0;
							set_stop([bg_set,bg_w_set,time_set,e_set,b_set]);
							mask.style.display = '';
							result.style.display = 'inline-block';
							result.style.left = (w-result.offsetWidth)/2+'px';
							result.style.top = (h-result.offsetHeight)/2+'px';
							$('#','point_over').innerHTML = $('#','time').innerHTML;
							$('#','grade').innerHTML = grade($('#','time').innerHTML);
							
						} else{
							point.innerHTML = new_point;
						}
						/*总分累计*/
						var tall_point = tall({opera:'-',e_point:n});
						$('#','zf_val').innerHTML = tall_point;
					} else{
						e.style.top = e_top +'px';
					}
				},10);
			},700);
			/*创建子弹*/
			b_set = setInterval(function  () {
				var b = document.createElement('article');
				if ($('#','zf_val').innerHTML > 1000 && $('#','zf_val').innerHTML <= 2000) {
					b.className='b1';
					b.style.left = me.offsetLeft + me.offsetWidth/2 -8+'px';
					me.style.background = 'url(img/me1.png) no-repeat';
					me.style.backgroundSize='100% 100%';
					me.style.width = '80px';
					me.style.height = '60px';
				} else if ($('#','zf_val').innerHTML > 2000) {
					b.style.left = me.offsetLeft + me.offsetWidth/2 -15+'px';
					me.style.backgroundSize='100% 100%';
					b.className='b2';
					me.style.background = 'url(img/me2.png) no-repeat';
					me.style.backgroundSize='100% 100%';
					me.style.width = '90px';
					me.style.height = '70px';
				}else {
					b.style.left = me.offsetLeft + me.offsetWidth/2 -3+'px';
					b.className='b';
				}
				b.style.top = me.offsetTop+'px';
				sec.appendChild(b);
				/*让子弹飞*/
				var init = setInterval(function(){
					var b_top = b.offsetTop;
					b_top -= 5;
					if (b_top < -35) {
						sec.removeChild(b);
						clearInterval(b_top);
					} else{
						b.style.top = b_top+'px';
					}
					/*子弹碰撞检测*/
					var es = $('.','e');
					for (var i = 0; i < es.length; i++) {
						var minLeft = es[i].offsetLeft;
						var minTop = es[i].offsetTop;
						var maxLeft = minLeft+es[i].offsetWidth;
						var maxTop = minTop+es[i].offsetHeight;
						if (b.offsetLeft <maxLeft  && b.offsetLeft > minLeft && b_top <maxTop  && b_top > minTop) {
							/*清除子弹*/
							sec.removeChild(b);
							clearInterval(init);
							/*加分*/
							var point = $('#','point');
							var e_point = es[i].title;
							var new_point = integ({opera:'+',score:point.innerHTML,en_point:e_point});
							if (new_point > 500) {
								point.innerHTML = 0;
								wubai += 1;
								$('#','qing').innerHTML = wubai;
							} else{
								point.innerHTML = new_point;
							}
							/*总分累计*/
							var tall_point = tall({opera:'+',e_point:e_point});
							$('#','zf_val').innerHTML = tall_point;
							/*创建爆炸图*/
							var boom = document.createElement('article');
							boom.className = 'boom';
							boom.style.left = es[i].offsetLeft+'px';
							boom.style.top = es[i].offsetTop+'px';
							sec.replaceChild(boom,es[i]);
							setTimeout(function  () {
								sec.removeChild(boom);
							},500);
						}
					}
				},10);
			},300);
			play_k=1;
		}else{
			alert('请选择头像和填写姓名！');
		}
			
		/*总分数*/
		function tall (obj) {
			var e_point = parseInt(obj.e_point);
			switch (obj.opera){
				case '+':
					return tally += e_point*10;
					break;
				case '-':
					return tally -= e_point*50;
					break;
				default:
					break;
			}
		}
	}
	
	/*重新开始*/
	$('#','replace').onclick=function  () {
		if (play_k == 1) {
			mask.style.display = '';
			result.style.display = '';
			$('#','time').innerHTML = 0;
			$('#'),'point'.innerHTML = 0;
			$('#','zf_val').innerHTML = 0;
			$('#','qing').innerHTML=0;
			me.style.background = 'url(img/me.png) no-repeat';
			me.style.backgroundSize='100% 100%';
			me.style.width = '70px';
			me.style.height = '60px';
			play_k=0;
			play_b();
		}
	}

	/*边缘检测*/
	function side () {
		var minLeft = me.offsetLeft;
		var minTop = me.offsetTop;
		var maxLeft = minLeft+me.offsetWidth;
		var maxTop = minTop+me.offsetHeight;
		if (minLeft <= 0) {
			me.style.left = '0px'
		}
		if (maxLeft >= sec.offsetWidth) {
			me.style.left = sec.offsetWidth-me.offsetWidth +'px';
		}
		if (minTop <= 0) {
			me.style.top = '0px'
		}
		if (maxTop >= sec.offsetHeight) {
			me.style.top = sec.offsetHeight-me.offsetHeight +'px';
		}
	}
	/*封装DOM*/
	function $(type,val){
		switch (type){
			case '#':
				return document.getElementById(val);
				break;
			case '.':
				return document.getElementsByClassName(val);
				break;
			default:
				break;
		}
	}
	/*封装随机数*/
	function  rand(m,n) {
		return Math.floor(Math.random()*1000)%(n-m+1)+m;
	}	
	/*积分系统*/
	function integ (obj) {
		var score = parseInt(obj.score);
		var en_point = parseInt(obj.en_point);
		switch (obj.opera){
			case '+':
				return score + en_point * 10;
				break;
			case '-':
				return score - en_point * 50;
				break;
			default:
				break;
		}
	}
	/*setInterval全部停止*/
	function set_stop (val) {
		for (var i = 0; i < val.length; i++) {
			clearInterval(val[i]);
		}
		
	}
	/*封装段位*/
	function grade (val) {
		if (val <= 30) {
			return '倔强青铜';
		} else if(30 < val && val <= 60){
			return '秩序白银';
		} else if(60 < val && val <= 120){
			return '荣耀黄金';
		} else if(120 < val && val <= 240){
			return '尊贵铂金';
		} else if(240 < val && val <= 480){
			return '永恒钻石';
		} else if(480 < val){
			return '最强王者';
		}
	}
}