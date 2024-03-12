var maxFilValue=0;
function resizeWebView() {
						    var webViewHeight = $(window).height();  // 현재 WebView의 높이
						    var maxContentHeight = webViewHeight  - $('#webviewTopHeight').height(); 
						
						    $('#webviewHeight').css({
						        'max-height': maxContentHeight + 'px'
						    });
						}	
$(document).ready(function() {
			var username = '';
		    var password = '';
		    var inputTimeout;
		    var InputLength=0;
		
		   $('#username, #password').on('change', function() { 
		        username = $('#username').val();
		        password = $('#password').val();
		        var newInputLength= username.length+password.length;
		        if(newInputLength>5+InputLength&&username.length >= 5 && password.length >= 5){
					console.log('자동 입력으로 간주됩니다.');
					if($('#login_error').text()==""){
						$('#auth_button').click();
					}
				}else{
					console.log('수동 입력입니다.');
				}
		        InputLength=newInputLength;
		        //checkForAutofill();
		    });
		
		    function checkForAutofill() {
		        clearTimeout(inputTimeout);
		        username=$('#username').val();
		        password=$('#password').val();
		        inputTimeout = setTimeout(function() {
		            if (username.length >= 5 && password.length >= 5) {
		                console.log('자동 입력으로 간주됩니다.');
		            } else {
		                console.log('수동 입력입니다.');
		            }
		        }, 1000); // 1초 후에 자동 입력 여부를 확인합니다.
		    };
    maxFilValue = Math.round(950000/$('#max_fil').text());
    $('#max_fil').text('송금 한도액 : '+maxFilValue+ 'FIL');
	
	 $('#wallet_option').change(function() {
            var selectedOption = $(this).val();
            if (selectedOption === 'direct_input') {
                $('#wallet_option_direct').show();
            } else {
                $('#wallet_option_direct').hide();
                $('#wallet_option_direct').val('');
            }
        });
				        $('.user-community-button').on('click', function() {
				            window.open("https://ipfskdc.kr/bbs_list.php?tb=borard_qna", '_blank');
				        });
				    $('#walletManager').on('click', function() {
			$('#walletManager_modal').modal('show');
		});
		 $('#select_address_confirm').on('click', function() {
			$('#payout_fil_address').val($('#wallet_option option:selected').text());
		});
						  $('#alert_modal').on('hidden.bs.modal', function (e) {
							 if ($('#alert_header').hasClass("bg-success")){
								 location.reload(true);
							 } 
					      });
						 $('#payout_fil_request').on('click', function() {
							 if($('#requestFundCheck').text()!='송금신청 가능'){
								 $('#alert3_title').text($('#requestFundCheck').text());
								$('#alert3_modal').modal('show');
								return;	 
							 } 
							if($('#payout_fil_address').val()=='' ||$('#payout_fil_amount').val()==''){
								$('#alert3_title').text('입력값을 확인해주세요');
								$('#alert3_modal').modal('show');
								return;
							}else if(parseFloat($('#available_fil').val())<parseFloat($('#payout_fil_amount').val())){
								$('#alert3_title').text('출금가능액을 초과하셨습니다');
								$('#alert3_modal').modal('show');
								
								return;
							}else if(maxFilValue<parseFloat($('#payout_fil_amount').val())){
								$('#alert3_title').text('일일 출금 한도액을 초과하셨습니다');
								$('#alert3_modal').modal('show');
								return;
							}	
							$('#request_wallet_address').text($('#payout_fil_address').val());
							$('#request_fil_balance').text($('#payout_fil_amount').val());
					    	$('#authenticationModal').modal('show');
					    });
					    
					    $('#auth_button').on('click', function() {
						    let user_id = $('#payout_fil_request').val();
						    let password = $('#password').val();
						    $.ajax({
						        type: "POST",
						        url: "/secondAuth",
						        contentType: "application/json",
						        data: JSON.stringify({
						            user_id: user_id,
						            password: password
						        }),
						        success: function (data) {
						            $('#authenticationModal').modal('hide');
						            if (data == 'success') {
						                if ($('#auth_alert_header').hasClass("bg-danger")) {
						                    $('#auth_alert_header').removeClass("bg-danger").addClass("bg-success");
						                }
						                $('#auth_alert_title').text("인증완료");
						                $('#auth_alert_modal').modal('show');
										$('#auth_confirm_button').on('click', function() {
											 $('#auth_alert_modal').modal('hide');
											$('#payout_request_modal').modal('show');
											
											});
						                
						                
						            } else if (data == 'failed:session_closed') {
						                $('#session_alert_investment').modal('show');
						            } else {
						                if ($('#alert_header').hasClass("bg-success")) {
						                    $('#alert_header').removeClass("bg-success").addClass("bg-danger");
						                }
						                $('#alert_title').text("인증실패: 비밀번호를 확인해주세요.");
						                $('#alert_modal').modal('show');
						            }
						        }
						    });
						});

						
						 $('#payout_confirm_button').on('click', function() {	
							 let fil_amount= $('#payout_fil_amount').val();
							 let user_id = $('#payout_fil_request').val();
							 let wallet_address = $('#payout_fil_address').val(); 
							 let wallet_type_name =$('#wallet_type_name').val();
							 let available_fil = $('#available_fil').val();
							 $('#payout_request_modal').modal('hide');
					       $.ajax({
			                    type: "POST",
			                    url: "/addWalletWithdrawal",
			                    contentType: "application/json",
			                    data: JSON.stringify({
							        fil_amount: fil_amount,
							        user_id: user_id,
							        wallet_address : wallet_address,
							        wallet_type_name : wallet_type_name
							    }),
			                    success: function (data) {
									$('#payout_request_modal').modal('hide');
									if(data=='success'){
										if ($('#alert_header').hasClass("bg-danger")) 
											{
							            		$('#alert_header').removeClass("bg-danger").addClass("bg-success");
							       		 	} 
										$('#alert_title').text("송금신청 완료");
										$('#alert_modal').modal('show');
			                        }
			                        else if(data=='failed:session_closed'){
										$('#session_alert_investment').modal('show');
									}
			                        else{
										if ($('#alert_header').hasClass("bg-success")) 
										{
								            $('#alert_header').removeClass("bg-success").addClass("bg-danger");
							       		} 		
							       		 $('#alert_title').text("송금신청 실패");
								            $('#alert_modal').modal('show');	
									}	
			                    }
			                });
					    });
        $('#addNewWallet_confirm').click(function(){
						let fil_address=  $('#new_wallet_addr').val();
						let user_id = $('#payout_fil_request').val();
						let wallet_type_name = $('#wallet_option').val();
						if(wallet_type_name=='direct_input'){
							wallet_type_name = $('#wallet_option_direct').val();
						}
					if(fil_address=='') {
								            $('#alert3_modal').modal('show');
								            
								            return;
								}
            			$.ajax({
			                    type: "POST",
			                    url: "/insertUserAddress",
			                    contentType: "application/json",
			                    data: JSON.stringify({
							        fil_address: fil_address,
							        user_id: user_id,
							        wallet_type_name : wallet_type_name
							    }),
			                    success: function (data) {	 
									if(data=='success'){
										if ($('#alert_header').hasClass("bg-danger")) 
											{
							            		$('#alert_header').removeClass("bg-danger").addClass("bg-success");
							       		 	} 
										$('#alert_title').text("지갑 등록 완료");
										$('#alert_modal').modal('show');
			                        }
			                        else if(data='failed:session_closed'){
										$('#session_alert_investment').modal('show'); 	
									}
			                        else{
										if ($('#alert_header').hasClass("bg-success")) 
										{
								            $('#alert_header').removeClass("bg-success").addClass("bg-danger");
							       		} 		
							       		 $('#alert_title').text("지갑 등록 실패");
								            $('#alert_modal').modal('show');	
									} 
									}
			                	});  
        });         
  
});