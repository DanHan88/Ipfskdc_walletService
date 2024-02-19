function resizeWebView() {
						    var webViewHeight = $(window).height();
						    var maxContentHeight = webViewHeight  - $('#webviewTopHeight').height(); 
						    $('#webviewHeight').css({
						        'max-height': maxContentHeight + 'px'
						    });
						}	
$(document).ready(function() {
				        $('.user-community-button').on('click', function() {
				            window.open("https://ipfskdc.kr/bbs_list.php?tb=borard_qna", '_blank');
				        });
					     $('.announcementEventBodyBtn').on('click', function() {
						
							 $('#eventAnnouncemen_body').val($(this).find('#eventAnnouncement_body').text());
							 $('#event_announcement_title').text($(this).find('.event_announcement').text());
					    	$('#eventAnnouncementBodyModal').modal('show');
					    });	
  
});