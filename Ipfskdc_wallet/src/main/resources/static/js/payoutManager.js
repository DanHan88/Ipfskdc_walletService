$(document).ready(function() {
						$('#dataTableContainer').show();
						 $('#alert_modal_payout').on('hidden.bs.modal', function (e) {
							 if ($('#alert_header_payout').hasClass("bg-success")){
								 location.reload(true);
							 } 
					      });			
						$('.payout_detail').on('click', function() {
							var token_paid_id = $(this).val();
							$('#payout_detail_table').DataTable({
						        "order": [[0, 'desc']],
						        "destroy": true,
						        "ajax": {
						            "type": "POST",
						            "url": "/selectTokenDetailList",
						            "contentType": "application/json",
						            "data": function (d) {
						                return JSON.stringify({
						                    token_paid_id: token_paid_id
						                });
						            },
						            "dataSrc": function (data) {
						                return data;
						            }
						        },
						        "columns": [
						            { "data": "user_email" },
						            { "data": "user_name" },
						            { "data": "investment_category_name" },
						            { "data": "paid_fil" },
						        ]
						    });
						    $('.table-responsive').addClass('p-2');
					       $('#payout_detail_list_modal').modal('show');
					    });	
					    $('.payout_update').on('click', function() {
							$("#payout_update_confirm_btn").val($(this).val());
							$('#payout_fil_per_tb').val($(this).parent().parent().find('#paid_per_tb_td').text());
							$('#original_fil_per_tb').val($('#payout_fil_per_tb').val());
							if($(this).parent().parent().find('#status_td').text()=='정상'){
								$('input[name="payout_status"][value="정상"]').prop('checked', true);
							}else{
								$('input[name="payout_status"][value="취소"]').prop('checked', true);
							}		
					       $('#payout_update_modal').modal('show');
					    });	
					    $('#payout_update_confirm_btn').on('click', function() {   
							   var token_paid_id = $("#payout_update_confirm_btn").val();
						       var fil_paid_per_tb = $('#payout_fil_per_tb').val();
						       if(fil_paid_per_tb<=0){
								$('#alert2_modal').modal('show');
								return;
							}
						       var original_fil_per_tb = $('#original_fil_per_tb').val();
						       var status = $('input[name="payout_status"]:checked').val();
						       var fil_paid_ratio_change = fil_paid_per_tb/original_fil_per_tb;
					       $.ajax({
			                    type: "POST",
			                    url: "/updateTokenPaid",
			                    contentType: "application/json",
			                    data: JSON.stringify({
							        token_paid_id: token_paid_id,
							        fil_paid_ratio_change:fil_paid_ratio_change,
							        fil_paid_per_tb: fil_paid_per_tb,
							        status : status
							    }),
			                    success: function (data) {
									$('#detail_user_modal').modal('hide');
									if(data=='success'){
										if ($('#alert_modal_payout').hasClass("bg-danger")) 
											{
							            		$('#alert_header_payout').removeClass("bg-danger").addClass("bg-success");
							       		 	} 
										$('#alert_title_payout').text("회원 정보 수정 완료");
										$('#alert_modal_payout').modal('show');
			                        }
			                        else if(data='failed:session_closed'){
										$('#session_alert_payout').modal('show');
									}
			                        else{
										if ($('#alert_header_payout').hasClass("bg-success")) 
										{
								            $('#alert_header_payout').removeClass("bg-success").addClass("bg-danger");
							       		} 			
							       		 $('#alert_title_payout').text("제품정보 수정 실패 : 중복된 제품명 또는 같은 정보");
								         $('#alert_modal_payout').modal('show');
									}
			                    }
			                });
					    });	
						$('.request-approve').each(function() {
						   if($(this).parent().parent().find('#user_status').text()!='요청'){
							   $(this).hide();
							   $(this).parent().parent().find('.request-decline').hide();
						   }
						});
						
					     $('#dataTable').DataTable({
					    	 "order": [[0, 'desc']]
						});
					    
});