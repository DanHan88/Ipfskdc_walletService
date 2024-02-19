function resizeWebView() {
						    var webViewHeight = $(window).height();  // 현재 WebView의 높이
						    var maxContentHeight = webViewHeight  - $('#webviewTopHeight').height(); 
						
						    $('#webviewHeight').css({
						        'max-height': maxContentHeight + 'px'
						    });
						}	
$(document).ready(function() {
				        $('.user-community-button').on('click', function() {
				            window.open("https://ipfskdc.kr/bbs_list.php?tb=borard_qna", '_blank');
				        });
        });         
  
