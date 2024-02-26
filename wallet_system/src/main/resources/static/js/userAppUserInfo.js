function resizeWebView() {
						    var webViewHeight = $(window).height();  // 현재 WebView의 높이
						    var maxContentHeight = webViewHeight - $('#webviewTopHeight').height(); 
						
						    $('#webviewHeight').css({
						        'max-height': maxContentHeight + 'px'
						    });
						}
$(document).ready(function() {
				        $('.user-community-button').on('click', function() {
				            window.open("https://ipfskdc.kr/bbs_list.php?tb=borard_qna", '_blank');
				        });
$('#fileInput').on('change', function (e) {
            var fileInput = this;
            var maxSizeMB = 100; 
            var maxFileSize = maxSizeMB * 1024 * 1024; 

            if (fileInput.files.length > 0) {
                var file = fileInput.files[0];

                if (file.size > maxFileSize) {
                    alert('사진 용량이 허용량(100MB) 를 초과 하였씁니다.');
                    $(fileInput).val('');
                    $('#profilePicture').hide(); 
                    return;
                }
                var reader = new FileReader();
                reader.onload = function (e) {
                    $('#profilePicture').attr('src', e.target.result).show();
                };
                reader.readAsDataURL(file);
            } else {
                $('#profilePicture').hide(); // Hide the preview if no file is selected
            }
        });
				        
				        $('#alert_modal_user').on('hidden.bs.modal', function (e) {
							 if ($('#alert_header_user').hasClass("bg-success")){
								 location.reload(true);
							 } 
					      });
				            $('#update_user_password_btn').on('click', function() {  
								$('#original_password').val('');   
							    $('#user_password').val(''); 
							   $('#user_password_repeat').val('');  
							  $('#update_user_password_modal').modal('show');
					    });
					    $('#update_user_password_confirm').on('click', function() {  
							   var original_password = $('#original_password').val();   
							   var password = $('#user_password').val(); 
							   var password_repeat = $('#user_password_repeat').val();
							   if(password!=password_repeat) {
								  if ($('#alert_header_user').hasClass("bg-success")) 
										{
								            $('#alert_header_user').removeClass("bg-success").addClass("bg-danger");
							       		} 			
							       		 $('#alert_title_user').text("새 비밀번호가 일치 하지 않습니다.");
								            $('#alert_modal_user').modal('show');
								   return;
								}
						       var user_id = $('#update_user_profile_img_btn').val();  
								$.ajax({
			                    type: "POST",
			                    url: "/updateUserPassword",
			                    contentType: "application/json",
			                    data: JSON.stringify({
									original_password:original_password,
							        password: password,
							        user_id: user_id
							    }),
			                    success: function (data) {
									$('#detail_user_modal').modal('hide');
									if(data=='success'){
										if ($('#alert_header_user').hasClass("bg-danger")) 
											{
							            		$('#alert_header_user').removeClass("bg-danger").addClass("bg-success");
							       		 	} 
										$('#alert_title_user').text("회원 비밀번호 수정 완료");
										$('#alert_modal_user').modal('show');
			                        }
			                        else if(data=='failed:session_closed'){
										$('#session_alert_user').modal('show');
									}
			                        else{
										if ($('#alert_header_user').hasClass("bg-success")) 
										{
								            $('#alert_header_user').removeClass("bg-success").addClass("bg-danger");
							       		} 			
							       		 $('#alert_title_user').text("회원 비밀번호 수정 실패:기존 비밀번호 불일치");
							       		 $('#original_password').val('');   
									    $('#user_password').val(''); 
									   	$('#user_password_repeat').val('');  
								        $('#alert_modal_user').modal('show');
									}
			                    }
			                });
					    });
					    $('#update_profile_img_confirm').on('click', function() {     
						       var user_id = $('#update_user_profile_img_btn').val(); 
						       var fileInput = $('#fileInput')[0];    
						       var formData = new FormData();
								formData.append('user_id', user_id); 
								formData.append('file', fileInput.files[0]);
					       $.ajax({
								type: "POST",
							    url: "/updateUserProfileImg",
							    data: formData,
							    contentType: false,
							    processData: false,
							    success: function (data) {
									$('#profile_picture_modal').modal('hide');
									if(data=='success'){
										if ($('#alert_header_user').hasClass("bg-danger")) 
											{
							            		$('#alert_header_user').removeClass("bg-danger").addClass("bg-success");
							       		 	} 
										$('#alert_title_user').text("회원사진 변경 완료");
										$('#alert_modal_user').modal('show');
			                        }
			                        else if(data='failed:session_closed'){
										$('#session_alert_user').modal('show');
									}
			                        else{
										if ($('#alert_header_user').hasClass("bg-success")) 
										{
								            $('#alert_header_user').removeClass("bg-success").addClass("bg-danger");
							       		} 			
							       		 $('#alert_title_user').text("회원사진 변경 실패");
								            $('#alert_modal_user').modal('show');
									}
			                    }
			                });
					    });
					    
					    
					    $('#update_user_profile_img_btn').on('click', function() { 
							  if($('#fileInput')[0].files[0]==null){
								   if ($('#alert_header_user').hasClass("bg-success")) 
										{
								            $('#alert_header_user').removeClass("bg-success").addClass("bg-danger");
							       		} 			
							       			 $('#alert_title_user').text("파일선택해주세요");
								            $('#alert_modal_user').modal('show');
								            return;
							   }   
							$('#profile_picture_modal').modal('show');  
					    });
});