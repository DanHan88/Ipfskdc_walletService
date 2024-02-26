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
							var name; 
							 var email;  
							 var phone;
							 var password; 
							 var check_password; 
						
							 

						 $('#confirmButton').on('click', function() {
							 
							 
							 $.ajax({
			                    type: "POST",
			                    url: "/insertUser",
			                    contentType: "application/json",
			                    data: JSON.stringify({
									user_name: name,
									user_email:email,
									user_phone:phone,
									password:password,
									user_status:"가입대기"
									
							    }),
			                    success: function (data) {
									if (data === 'success') {
                                    // 성공 시 모달 내용 변경
                                	$('#confirmationModal').hide();
                                    $('#confirmSuccessModal').modal('show'); 
                                    // 승인 완료 모달 표시
                                    $('#confirmSuccessModal').on('hidden.bs.modal', function () {
					                    window.location.href = "/UserApp"; // 메인 페이지 URL로 변경
					                });
					                      
                                }
			                        
                
			                    }
			                });
			                
			                });
			                
					     $('#request_register').on('click', function() {
							 event.preventDefault();
							 name = $('#InputName').val(); 
							 email = $('#InputEmail').val(); 
							 phone= $('#InputPhoneNumber').val(); 
							 password = $('#InputPassword').val(); 
							 check_password = $('#RepeatPassword').val(); 

							if (name == "" || email == "" || phone == "" || password == "" || check_password  == ""){
								$('#alertText').text('입력값을 확인 해주세요!');
								$('#alertText').show();
								return;
							}
							if (password != check_password){
								$('#alertText').text('비밀번호가 일치하지 않습니다.');
								$('#alertText').show();
								return;
							}
							$.ajax({
			                    type: "POST",
			                    url: "/checkUserEmail",
			                    contentType: "application/json",
			                    data: JSON.stringify({
									user_email:email
							    }),
			                    success: function (data) {
									if(data){
										
										$('#alertText').text('이미 가입된 이메일입니다.');
										$('#alertText').show();
										return;
								}
			                        
			                    $('#confirmationModal').modal('show');
			                    
			                    
			                    	  
			                        
			                    }
			                });

					    });	
  
});