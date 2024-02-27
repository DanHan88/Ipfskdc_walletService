$(document).ready(function() {
	var wallet_withdrawals_id;
	var userStatus;
	var fil_amount;
	var wallet_address;
	
    $('#dataTableContainer').show();
    
    $('#confirmSuccessModal').on('hidden.bs.modal', function (e) {
		location.reload(true);
    });
    $('#declineSuccessModal').on('hidden.bs.modal', function (e) {
        location.reload(true);
    }); 
    $('.request-approve').on('click', function() {
        var clickedButton = $(this);
        wallet_withdrawals_id = clickedButton.closest('tr').find('[data-wallet-withdrawals-id]').data('wallet-withdrawals-id');
        userStatus = clickedButton.closest('tr').find('#status').text().trim();
        fil_amount = clickedButton.closest('tr').find('#fil_amount').text().trim();
        wallet_address = clickedButton.closest('tr').find('#wallet_address').text();
        
        $.ajax({
                    type: 'POST',
                    url: '/checkAdminBalance',
                    contentType: 'application/json',
                    success: function(data) {
                                if(data != -1){
								        $('#alert_title_user').text("승인 하시겠습니까?");
								        $('#admin_balance').text("잔고 : " + data);
								        $('#approvalModal').modal('show');
                                }
                                 else{
									 $('#success_header_fundRequest').removeClass("bg-success").addClass("bg-danger");
									$('#success_body_fundRequest').text("에러 : 잔고확인 실패");
                                    $('#success_title_fundRequest').text("승인 실패하였습니다");
                                    $('#confirmSuccessModal').modal('show');
								 }
                            },
                    error: function(error) {
                        // 요청에 실패했을 때 수행할 동작
                        console.error('승인 요청 실패:', error);
                    },   
                });
    });
     $('#request_fund_manager_btn').on('click', function() {
							$("#payout_update_confirm_btn").val($(this).val());
							$('#payout_fil_per_tb').val($(this).parent().parent().find('#paid_per_tb_td').text());
							$('#original_fil_per_tb').val($('#payout_fil_per_tb').val());
							if($(this).parent().parent().find('#status_td').text()=='정상'){
								$('input[name="payout_status"][value="정상"]').prop('checked', true);
							}else{
								$('input[name="payout_status"][value="취소"]').prop('checked', true);
							}		
					       $('#request_fund_manager').modal('show');
					    });	
    
    
     // 모달 내 '확인' 버튼 클릭 처리
        $('#confirmModal').off('click').on('click', function() {
			 $('#approvalModal').modal('hide');
			 $('#loadingModal_fund').modal('show');
			 
            if (userStatus === '신청') {
                $.ajax({
                    type: 'POST',
                    url: '/updateFundRequest',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        wallet_withdrawals_id: wallet_withdrawals_id,
                        is_request_state: "승인",
                        fil_amount: fil_amount,
                        wallet_address :wallet_address
                    }),
                    success: function(data) {
								 $('#loadingModal_fund').modal('hide');
                                if (data === 'success') {	
                                    // 성공 시 모달 내용 변경
                                    $('#success_header_fundRequest').removeClass("bg-danger").addClass("bg-success");
                                    $('#success_title_fundRequest').text("승인 되었습니다");
                                    $('#confirmSuccessModal').modal('show'); 
                                    // 승인 완료 모달 표시
                                } else if (data === 'failed:session_closed') {
                                    // 세션 종료 시 다른 처리
                                    $('#session_alert_user').modal('show');
                                    
                                } else {
                                    // 실패 시 모달 내용 변경
                                    $('#success_header_fundRequest').removeClass("bg-success").addClass("bg-danger");
									$('#success_body_fundRequest').text(data);
                                    $('#success_title_fundRequest').text("승인 실패하였습니다");
                                    $('#confirmSuccessModal').modal('show');
                                }
                            },
                    error: function(error) {
                        // 요청에 실패했을 때 수행할 동작
                        console.error('승인 요청 실패:', error);
                    },   
                });
            } else {
                console.log('이 요청은 처리할 수 없습니다. 상태: ' + userStatus);
            }
        });

    $('.request-decline').on('click', function() {
		$('#declineModal').modal('show');
		wallet_withdrawals_id = $(this).closest('tr').find('[data-wallet-withdrawals-id]').data('wallet-withdrawals-id');
	    userStatus = $(this).closest('tr').find('#status').text().trim();
    });
    
    $('#declineConfirmBtn').off('click').on('click', function() {
			var memo = $('#declineReason').val();
	        if (userStatus === '신청') {
	            $.ajax({
	                type: 'POST',
	                url: '/updateFundRequest',
	                contentType: 'application/json',
	                data: JSON.stringify({
	                    wallet_withdrawals_id: wallet_withdrawals_id,
	                    is_request_state: "거절",
	                    memo: memo
	                }),
	                success: function(data) {
						$('#declineModal').modal('hide');
                    if (data === 'success') {
                        // 성공 시
                        $('#declineSuccess_header_fundRequest').removeClass("bg-danger").addClass("bg-success");
                        $('#declineSuccess_title_fundRequest').text("거절 성공"); 
                        $('#declineSuccessModal').modal('show');  
                    } else if (data === 'failed:session_closed') {
                        // 세션 종료 시 다른 처리
                        $('#session_alert_user').modal('show');
                    } else {
                        // 실패 시
                        $('#declineSuccess_header_fundRequest').removeClass("bg-success").addClass("bg-danger");
                        $('#declineSuccess_title_fundRequest').text("거절 실패");
                        $('#declineSuccessModal').modal('show');
                    }
                },
	                error: function(error) {
	                    // 요청에 실패했을 때 수행할 동작
	                    console.error('거절 요청 실패:', error);
	                }
	            });
	        } else {
	            console.log('이 요청은 처리할 수 없습니다. 상태: ' + userStatus);
	        }
       });
        $('.request-DeclineMemo').on('click', function() {
							var memo = $(this).data('decline-memo');
							$('#declineMemoModal_body').text(memo);
							 
					    	$('#declineMemoModal').modal('show');
					    });
		$('.request-confirmMessage').on('click', function() {
							var message = $(this).data('message');
								 var modal = $(this);
							     var url = 'https://filfox.info/en/message/' +message;
     								window.open(url, '_blank');
					    });

	    $('#request_fund_manager_confirm').on('click', function() {
					       var request_per_day = $("#request_per_day").val();
					       var is_request_allowed = $('input[name="is_request_allowed"]:checked').val();
					       $.ajax({
			                    type: "POST",
			                    url: "/updateAdminOption",
			                    contentType: "application/json",
			                     data: JSON.stringify({
							        is_request_allowed: is_request_allowed,
							        request_per_day: request_per_day
							    }),
			                    success: function (data) {
									$('#update_product').modal('hide');
								            if (data === 'success') {
				                        // 성공 시
				                        $('#declineSuccess_header_fundRequest').removeClass("bg-danger").addClass("bg-success");
				                        $('#declineSuccess_title_fundRequest').text("옵션 수정 성공"); 
				                        $('#declineSuccessModal').modal('show');  
				                    } else if (data === 'failed:session_closed') {
				                        // 세션 종료 시 다른 처리
				                        $('#session_alert_user').modal('show');
				                    } else {
				                        // 실패 시
				                        $('#declineSuccess_header_fundRequest').removeClass("bg-success").addClass("bg-danger");
				                        $('#declineSuccess_title_fundRequest').text("옵션 수정 실패");
				                        $('#declineSuccessModal').modal('show');
				                    }
			                    }
			                });
					    });




    $('#dataTable').DataTable({
        "order": [[0, 'desc']]
       
    });

});
function updateQueryStringParameter(uri, key, value) {
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + "=" + value + '$2');
    } else {
        return uri + separator + key + "=" + value;
    }
}