$(document).ready(function() {
				        $('.user-community-button').on('click', function() {
				            window.open("https://ipfskdc.kr/bbs_list.php?tb=borard_qna", '_blank');
				        });

						 var page = parseInt($('#dataTableContainer').attr('data-page'),10);
						var tx_list;
						$('#dataTableContainer').show();
						
						$('.disable_user').on('click', function() {
							var clickedButton = $(this);
							$('#disable_user_email').text(clickedButton.parent().parent().find('.user_email').text());
					       $('#diable_user_modal').modal('show');
					    });
					    
					     $('#fileInput').on('change', function (e) {
				            var file = e.target.files[0];
				
				            if (file) {
				                var reader = new FileReader();
				                reader.onload = function (e) {
				                    $('#profilePicture').attr('src', e.target.result).show();
				                };
				                reader.readAsDataURL(file);
				            } else {
				                $('#profilePicture').hide();
				            }
				        });
					      $('#session_alert_user').on('hidden.bs.modal', function (e) {
								 window.location.href = "/";
					      });  
					      
					      $('#datepicker_add').datepicker({
					            format: 'yyyy-mm-dd', 
					            autoclose: true
					       });
					       $('#datepicker_update').datepicker({
					            format: 'yyyy-mm-dd', 
					            autoclose: true
					       });
					      
					       $('#user_investment_add').on('click', function() {
							   var purchase_date = $("#datepicker_add").val();
						       var purchase_size = $('#node_tib').val();
						       var fil_invested = $('#node_fil').val();
						       var investment_category_id = $('#selectBox_product').val();
						       var user_id = $('#user_edit_1_btn').val(); 	   
							   if(purchase_date==""||purchase_size==""||investment_category_id==""){
										if ($('#alert_header_user').hasClass("bg-success")) 
										{
								            $('#alert_header_user').removeClass("bg-success").addClass("bg-danger");
							       		} 			
							       		 $('#alert_title_user').text("모든 데이터를 입력해 주십시오.");
								         $('#alert_modal_user').modal('show');
								         return;
							   }
							   $.ajax({
			                    type: "POST",
			                    url: "/addNewInvestment",
			                    contentType: "application/json",
			                    data: JSON.stringify({
							        purchase_date: purchase_date,
							        purchase_size: purchase_size,
							        fil_invested: fil_invested,
							        investment_category_id : investment_category_id,
							        user_id  : user_id
							    }),
			                    success: function (data) {
									$('#add_user_modal').modal('hide');
									if(data=='success'){
										if ($('#alert_header_user').hasClass("bg-danger")) 
											{
							            		$('#alert_header_user').removeClass("bg-danger").addClass("bg-success");
							       		 	} 
										$('#alert_title_user').text("상품투자 등록 성공");
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
							       		 $('#alert_title_user').text("상품투자 정보 등록 실패 : 중복된 제품명 또는 같은 정보");
								            $('#alert_modal_user').modal('show');
									}
			                    	}
			                	});  
							});
					    $('.detail_user').on('click', function() {
							var clickedButton = $(this);
							$('#join_date_p').text(clickedButton.parent().parent().find('.user_reg_date').text());
							$('#user_name_span').text(clickedButton.parent().parent().find('.user_name').text());
							$('#user_email_span').text(clickedButton.parent().parent().find('.user_email').text());
							$('#user_phone_span').text(clickedButton.parent().parent().find('.user_phone').text());
							$('#user_name').val(clickedButton.parent().parent().find('.user_name').text());
							$('#user_email').val(clickedButton.parent().parent().find('.user_email').text());
							$('#user_phone').val(clickedButton.parent().parent().find('.user_phone').text());
							$('#profilePicture').attr('src', '/uploads'+clickedButton.parent().parent().attr('data-picture'));
							var user_id = clickedButton.parent().parent().find('.detail_user').val();
							$('#user_edit_1_btn').val(user_id);
							$('#reg_memo_button').val(user_id);
							 $('#dataTable_memo').DataTable({
						        "order": [[0, 'desc']],
						        "destroy": true,
						        "ajax": {
						            "type": "POST",
						            "url": "/selectUserMemo",
						            "contentType": "application/json",
						            "data": function (d) {
						                return JSON.stringify({
						                    user_id: user_id
						                });
						            },
						            "dataSrc": function (data) {
						                return data;
						            }
						        },
						        "columns": [
						             { "data": "reg_date", "render": function (data) {
						                var date = new Date(data);
						                return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
						            }},
						            { "data": "memo" },
						            { "data": "admin_id" }
						        ]
						    });
						$('#wallet_address_balance_a').text(clickedButton.attr('data-filAmount')+" FIL");
						$('#wallet_address_balance_b').text(clickedButton.attr('data-filAmount')+" FIL");
						$('#wallet_address_balance_c').text(clickedButton.attr('data-filAmount')+" FIL");
						
							if(clickedButton.parent().parent().find('.user_status').text()=='정상'){
								$('input[name="user_status"][value="정상"]').prop('checked', true);
							}else{
								$('input[name="user_status"][value="중지"]').prop('checked', true);
							}				
							 $.ajax({
			                    type: "POST",
			                    url: "/selectInvestmentListForUser",
			                    contentType: "application/json",
			                    data: user_id,
			                    success: function (data) {
									$("#investment_user_table").find('tbody').empty();
									data.forEach(function(item) {
										var date = new Date(item.purchase_date);
									    var formattedDate = date.getFullYear() + '-' +
									                        ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
									                        ('0' + date.getDate()).slice(-2);
									    var newRow = '<tr>' +
									        '<td align="center" id="update_purchase_date">' + formattedDate + '</td>' +
									        '<td align="center" id="update_product_name" data-user_id="'+  item.investment_category_id + '">' + item.product_name + '</td>' +
									        '<<td align="center" id="update_purchase_size">' + item.purchase_size + '</td>' +
									        '<td align="center" id="update_fil_invested">' + item.fil_invested + '</td>' +
									        '<td align="center"><button type="button" class="btn btn-secondary btn-sm m-1 update_user_investment_button" value="' + item.investment_id + '">수정</button>'+
									        '<button type="button" class="btn btn-secondary btn-sm m-1 delete_user_investment_button" value="'+ item.investment_id + '">삭제</button></td></tr>';
									    $("#investment_user_table").append(newRow);
									});
									
			                    }
			                });
			                 $.ajax({
			                     type: "POST",
								    url: "/selectUserAddressByUserId",
								    contentType: "application/json",
								    data: JSON.stringify({ user_id: user_id }),
								    success: function(response) {
								        var filAddress = response.fil_address;
								        var walletTypeName = response.wallet_type_name;
								        var user_address_input =filAddress+' ('+walletTypeName+') ';
								        if (walletTypeName=='미등록'){
											user_address_input = filAddress;
										}        
								        $('#user_address_input').text(user_address_input);
								    }
			                });
			                
			                
			                
							$('#detail_user_modal').modal('show');
					    });
					    $('#add_user_investment_button').on('click', function() {
					       $('#add_user_investment').modal('show');
					    });
					    $('#add_user_button').on('click', function() {
					       $('#add_user_modal').modal('show');
					    });
					    $(document).on('click', '.delete_user_investment_button', function() {
							$('#investment_delete').val($(this).val());
						    $('#delete_user_investment').modal('show'); 
						});
						$(document).on('click', '.update_user_investment_button', function() {
							var superParent = $(this).parent().parent();
							$('#datepicker_update').val(superParent.find('#update_purchase_date').text());
							$('#selectBox_product_update').val(superParent.find('#update_product_name').data('user_id'));
							$('#node_tib_update').val(superParent.find('#update_purchase_size').text());
							$('#node_fil_update').val(superParent.find('#update_fil_invested').text());
							$('#user_investment_add').val($(this).val());
						    $('#update_user_investment').modal('show');
						    $('#user_investment_update').val($(this).val());
				    
						});
						
						 $('#user_pw_reset_btn').on('click', function() {
							 $('#alert_modal_user_pw_reset').modal('show'); 
						 });
						 $('#user_address_delete_btn').on('click', function() {
							 $('#alert_modal_user_address_delete').modal('show'); 
						 });
						 $('#user_edit_1_btn').on('click', function() {		 
							 $('#alert_modal_user_update').modal('show'); 
						});
						 $('#user_pw_reset_confirm').on('click', function() {
							 var user_id = $('#user_edit_1_btn').val(); 
							  $.ajax({
								type: "POST",
							    url: "/userPwReset",
							    contentType: "application/json",
			                    data: JSON.stringify({
							        user_id: user_id,
							    }),
							    success: function (data) {
									$('#detail_user_modal').modal('hide');
									if(data=='success'){
										if ($('#alert_header_user').hasClass("bg-danger")) 
											{
							            		$('#alert_header_user').removeClass("bg-danger").addClass("bg-success");
							       		 	} 
										$('#alert_title_user').text("회원 비밀번호 초기화 완료");
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
							       		 $('#alert_title_user').text("회원 비밀번호 초기화 실패");
								            $('#alert_modal_user').modal('show');
									}
			                    }
			                });
						});
						$('#deleteWallet_confirm').click(function(){
						var user_id=$('#user_edit_1_btn').val(); 
            			$.ajax({
			                    type: "POST",
			                    url: "/deleteUserAddressByUserId",
			                    contentType: "application/json",
			                    data: JSON.stringify({
							        user_id: user_id
							    }),
			                    success: function (data) {
									if(data=='success'){
										if ($('#alert_header_user').hasClass("bg-danger")) 
											{
							            		$('#alert_header_user').removeClass("bg-danger").addClass("bg-success");
							       		 	} 
										$('#alert_title_user').text("지갑 삭제 완료");
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
							       		 $('#alert_title_user').text("지갑 삭제 실패");
								            $('#alert_modal_user').modal('show');	
									}
			                    	}
			                	});  
        				});
					      
					    $('#user_update_confirm').on('click', function() {     
							   var user_name = $("#user_name").val();
						       var user_email = $('#user_email').val();
						       var user_phone = $('#user_phone').val();
						       var user_status = $('input[name="user_status"]:checked').val();
						       
						       var user_id = $('#user_edit_1_btn').val(); 
						       var fileInput = $('#fileInput')[0].files[0];
						       
						       var formData = new FormData();
						      
								formData.append('user_email', user_email);
								formData.append('user_phone', user_phone);
								formData.append('user_name', user_name);
								formData.append('user_status', user_status);
								formData.append('user_id', user_id); 
								if(fileInput!=undefined){
									formData.append('file', fileInput);
								}else{
									formData.append('file', 'no_change');
								}
								
					       $.ajax({
								type: "POST",
							    url: "/updateUser",
							    data: formData,
							    contentType: false,
							    processData: false,
							    success: function (data) {
									$('#detail_user_modal').modal('hide');
									if(data=='success'){
										if ($('#alert_header_user').hasClass("bg-danger")) 
											{
							            		$('#alert_header_user').removeClass("bg-danger").addClass("bg-success");
							       		 	} 
										$('#alert_title_user').text("회원 정보 수정 완료");
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
							       		 $('#alert_title_user').text("회원 정보 수정 실패");
								            $('#alert_modal_user').modal('show');
									}
			                    }
			                });
					    });
					    
					      $('#add_new_user_button').on('click', function() {     
							   var user_name = $("#name_add").val();
						       var user_email = $('#email_add').val();
						       var user_phone = '8210'+$('#tel_add').val();
						       
						       if(user_name==""||user_email==""||user_phone=="8210"){
										if ($('#alert_header_user').hasClass("bg-success")) 
										{
								            $('#alert_header_user').removeClass("bg-success").addClass("bg-danger");
							       		} 			
							       		 $('#alert_title_user').text("모든 데이터를 입력해 주십시오.");
								            $('#alert_modal_user').modal('show');
								            return;
							   }
					       $.ajax({
			                    type: "POST",
			                    url: "/addNewUser",
			                    contentType: "application/json",
			                    data: JSON.stringify({
							        user_email: user_email,
							        user_phone: user_phone,
							        user_name : user_name
							    }),
			                    success: function (data) {
									$('#add_user_modal').modal('hide');
									if(data=='success'){
										if ($('#alert_header_user').hasClass("bg-danger")) 
											{
							            		$('#alert_header_user').removeClass("bg-danger").addClass("bg-success");
							       		 	} 
										$('#alert_title_user').text("회원 등록 성공");
										$('#alert_modal_user').modal('show');
			                        }else if(data='failed:session_closed'){
										$('#session_alert_user').modal('show');
									}
			                        else{
										if ($('#alert_header_user').hasClass("bg-success")) 
										{
								            $('#alert_header_user').removeClass("bg-success").addClass("bg-danger");
							       		} 			
							       		 $('#alert_title_user').text("제품정보 수정 실패 : 중복된 제품명 또는 같은 정보");
								            $('#alert_modal_user').modal('show');
									}
			                    }
			                });
					    });    
							  $('#user_investment_update').on('click', function() {
							   var purchase_date = $("#datepicker_update").val();
						       var purchase_size = $('#node_tib_update').val();
						       var investment_category_id = $('#selectBox_product_update').val();
						       var investment_id = $(this).val();
						       var fil_invested = $('#node_fil_update').val();
						       var user_id = $('#user_edit_1_btn').val();
							   if(purchase_date==""||purchase_size==""||investment_category_id==""){
										if ($('#alert_header_user').hasClass("bg-success")) 
										{
								            $('#alert_header_user').removeClass("bg-success").addClass("bg-danger");
							       		} 			
							       		 $('#alert_title_user').text("모든 데이터를 입력해 주십시오.");
								            $('#alert_modal_user').modal('show');
								           return;
							   }
							   $.ajax({
			                    type: "POST",
			                    url: "/modifyInvestment",
			                    contentType: "application/json",
			                    data: JSON.stringify({
							        purchase_date: purchase_date,
							        purchase_size: purchase_size,
							        fil_invested: fil_invested,
							        investment_category_id : investment_category_id,
							        investment_id  : investment_id,
							        user_id : user_id
							    }),
			                    success: function (data) {
									$('#add_user_modal').modal('hide');
									if(data=='success'){
										if ($('#alert_header_user').hasClass("bg-danger")) 
											{
							            		$('#alert_header_user').removeClass("bg-danger").addClass("bg-success");
							       		 	} 
										$('#alert_title_user').text("상품투자 수정 성공");
										$('#alert_modal_user').modal('show');
			                        }else if(data='failed:session_closed'){
										$('#session_alert_user').modal('show');
									}
			                        else{
										if ($('#alert_header_user').hasClass("bg-success")) 
										{
								            $('#alert_header_user').removeClass("bg-success").addClass("bg-danger");
							       		} 			
							       		 $('#alert_title_user').text("상품투자 수정 실패 : 중복된 제품명 또는 같은 정보");
								            $('#alert_modal_user').modal('show');
									}
			                    	}
			                	});  
							});
							$('#investment_delete').on('click', function() {
						       var investment_id = $(this).val();
						       var user_id = $('#user_edit_1_btn').val();
							   $.ajax({
			                    type: "POST",
			                    url: "/deleteInvestment",
			                    contentType: "application/json",
			                    data: JSON.stringify({
							        investment_id  : investment_id,
							        user_id : user_id
							    }),
			                    success: function (data) {
									$('#add_user_modal').modal('hide');
									if(data=='success'){
										if ($('#alert_header_user').hasClass("bg-danger")) 
											{
							            		$('#alert_header_user').removeClass("bg-danger").addClass("bg-success");
							       		 	} 
										$('#alert_title_user').text("상품투자 삭제 성공");
										$('#alert_modal_user').modal('show');
			                        }else if(data='failed:session_closed'){
										$('#session_alert_user').modal('show');
									}
			                        else{
										if ($('#alert_header_user').hasClass("bg-success")) 
										{
								            $('#alert_header_user').removeClass("bg-success").addClass("bg-danger");
							       		} 			
							       		 $('#alert_title_user').text("상품투자 삭제 실패 : 중복된 제품명 또는 같은 정보");
								            $('#alert_modal_user').modal('show');
									}
			                    	}
			                	});  
							});
							$('#reg_memo_button').on('click', function() {
								
								var user_id =$('#user_edit_1_btn').val();
								var memo = $('#user_memo').val();
							   $.ajax({
			                    type: "POST",
			                    url: "/regMemo",
			                    contentType: "application/json",
			                    data: JSON.stringify({
									user_id: user_id,
									memo  : memo
							    }),
			                    success: function (data) {
									$('#add_user_modal').modal('hide');
									if(data=='success'){
										if ($('#alert_header_user').hasClass("bg-danger")) 
											{
							            		$('#alert_header_user').removeClass("bg-danger").addClass("bg-success");
							       		 	} 
										$('#alert_title_user').text("메모 등록 성공");
										$('#alert_modal_user').modal('show');
			                        }else if(data='failed:session_closed'){
										$('#session_alert_user').modal('show');
									}
			                        else{
										if ($('#alert_header_user').hasClass("bg-success")) 
										{
								            $('#alert_header_user').removeClass("bg-success").addClass("bg-danger");
							       		} 			
							       		 $('#alert_title_user').text("메모 등록 실패");
								            $('#alert_modal_user').modal('show');
									}
			                    	}
			                	});  
							});
							
							
							
							$('#tokenSend-btn').on('click', function() {     
							   	var send_token_amt = $("#send_token_amt").val();
						       	var user_id = $('#user_edit_1_btn').val();
						       	
						       	$('#user_email_td').text($('#user_email_span').text());
						       	$('#user_name_td').text($('#user_name_span').text());
						       	$('#user_category_name_td').text('개인전송');
						       	$('#fil_amt_td').text(send_token_amt);
      							 tx_list = [{
									cateogry_fil_per_tb: 100,
							        payout_fil: send_token_amt,
							        investment_category_id: 61,
							        is_getting_paid: true,
							        product_name: "개인전송",
							        fil_paid_per_tb: send_token_amt,
							        user_id: user_id,
							        memo :$('#send_memo').val()
								  }];
								var fil_per_tb = $('#payout_fil_amount').val();
							
								if(fil_per_tb<=0){
									$('#alert2_modal').modal('show');
									return;
								}
								  
								$('#sendTokenPersonalModal').modal('show');
						    });
						    
						    $('#payout_confirm_button').on('click', function() {
								       $.ajax({
						                    type: "POST",
						                    url: "/addNewTokenPaid",
						                    contentType: "application/json",
						                    data: JSON.stringify(tx_list),
						                     success: function(data) {
	                                if (data === 'success') {
	                                    // 성공 시 모달 내용 변경
	                                    $('#alert_header_user').removeClass("bg-danger").addClass("bg-success");
	                                    $('#alert_title_user').text("전송완료");
	                                    $('#alert_modal_user').modal('show');
                                    // 승인 완료 모달 표시
                                } else if (data === 'failed:session_closed') {
                                    // 세션 종료 시 다른 처리
                                    $('#session_alert_user').modal('show');
                                } else {
                                    // 실패 시 모달 내용 변경
                                    $('#alert_header_user').removeClass("bg-success").addClass("bg-danger");
                                    $('#alert_title_user').text("승인 실패");
                                }
                            },
			                    error: function(error) {
			                        // 요청에 실패했을 때 수행할 동작
			                        console.error('승인 요청 실패:', error);
			                    },
					        });
					    });
					    
					    $('#tokenMinus-btn').on('click', function() {     
							   	var minus_token_amt = $("#minus_token_amt").val();
						       	var user_id = $('#user_edit_1_btn').val();
						       	var minus_token_amt2 = -Math.abs(minus_token_amt);
						       	$('#user_email_td_c').text($('#user_email_span').text());
						       	$('#user_name_td_c').text($('#user_name_span').text());
						       	$('#user_category_name_td_c').text('개인차감');
						       	$('#fil_amt_td_c').text(minus_token_amt);
      							 tx_list = [{
									cateogry_fil_per_tb: 100,
							        payout_fil: minus_token_amt2,
							        investment_category_id: 62,
							        is_getting_paid: true,
							        fil_paid_per_tb: minus_token_amt2,
							        product_name: "개인차감",
							        user_id: user_id,
							        memo :$('#retract_memo').val()
								  }];
								var fil_per_tb = $('#payout_fil_amount').val();
							
								if(fil_per_tb<=0){
									$('#alert2_modal').modal('show');
									return;
								}
								  
								$('#minusTokenPersonalModal').modal('show');

						    });
						    
						    $('#minus_confirm_button').on('click', function() {
								 
								       $.ajax({
						                    type: "POST",
						                    url: "/addNewTokenPaid",
						                    contentType: "application/json",
						                    data: JSON.stringify(tx_list),
						                     success: function(data) {
	                                if (data === 'success') {
	                                    // 성공 시 모달 내용 변경
	                                    $('#alert_header_user').removeClass("bg-danger").addClass("bg-success");
	                                    $('#alert_title_user').text("차감완료");
	                                    $('#alert_modal_user').modal('show');
                                    // 승인 완료 모달 표시
                                } else if (data === 'failed:session_closed') {
                                    // 세션 종료 시 다른 처리
                                    $('#session_alert_user').modal('show');
                                } else {
                                    // 실패 시 모달 내용 변경
                                    $('#alert_header_user').removeClass("bg-success").addClass("bg-danger");
                                    $('#alert_title_user').text("차감 실패");
                                }
                            },
			                    error: function(error) {
			                        // 요청에 실패했을 때 수행할 동작
			                        console.error('차감 요청 실패:', error);
			                    },
					        });
					     
					    });
					    $('#confirmApproveBtn').on('click', function() {

							var userId = $('.approve_user').attr('data-user-id');
							$('#confirmModal').modal('show');
							var formData = new FormData();
								formData.append('user_status', "정상");
								formData.append('user_id', userId); 
							 $.ajax({
			                    type: "POST",
			                    url: "/updateUser",
			                    contentType: "application/json",
			                    data: formData,
			                    contentType: false,
							    processData: false,
			                    success: function (data) {
									if (data === 'success') {
                                    $('#confirmSuccessModal').modal('show');
									$('#confirmModal').modal('hide');
									location.reload(true);
					                      
                                }
			                        
                
			                    }
			                });
			                
			                });
			                
			              $('#confirmDenyBtn').on('click', function() {

							var userId = $('.approve_user').attr('data-user-id');
							$('#confirmModal').modal('show');
							var formData = new FormData();
								formData.append('user_status', "가입거절");
								formData.append('user_id', userId); 
							 $.ajax({
			                    type: "POST",
			                    url: "/updateUser",
			                    contentType: "application/json",
			                    data: formData,
			                    contentType: false,
							    processData: false,
			                    success: function (data) {
									if (data === 'success') {
                                    $('#confirmSuccessModal').modal('show');
									$('#confirmModal').modal('hide');
									location.reload(true);
					                      
                                }
			                        
                
			                    }
			                });
			                
			                });
					    var dataTable = $('#dataTable').DataTable({
					        "order": [[0, 'desc']],
					    });

					   $('#alert_modal_user').on('hidden.bs.modal', function (e) {
							 if ($('#alert_header_user').hasClass("bg-success")){
								 window.location.href = "/userManager?init_page="+dataTable.page.info().page;
							 } 
					      });		
					   dataTable.page(page).draw('page');
				    
});