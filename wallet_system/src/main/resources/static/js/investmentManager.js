var uncheckedList=[];
$(document).ready(function() {
						$('#dataTableContainer').show();
						$('#alert_modal').on('hidden.bs.modal', function (e) {
							 if ($('#alert_header').hasClass("bg-success")){
								 location.reload(true);
							 } 
					    });
					    $('#payout_fil_token').on('click', function() {
							$("#payout_confirmation_table").find('tbody').empty();
							var fil_per_tb = $('#payout_fil_amount').val();
							
							if(fil_per_tb<=0){
								$('#alert2_modal').modal('show');
								return;
							}
							for(var i = 0; i < listInvestment.length; i++){
								if(uncheckedList.includes(listInvestment[i].investment_id.toString()))continue;
								var payout_fil = listInvestment[i].purchase_size*fil_per_tb*listInvestment[i].cateogry_fil_per_tb/100;
								var newRow = '<tr>' +
									        '<td align="center" name="payout_user_email">' + listInvestment[i].user_email + '</td>' +
									        '<td align="center" name="payout_user_name">' + listInvestment[i].user_name + '</td>' +
									        '<td align="center" name="product_name">' + listInvestment[i].product_name + '</td>'+
									        '<td align="center" name="payout_fil">' + payout_fil + '</td>';
									    $("#payout_confirmation_table").append(newRow);
									  listInvestment[i].payout_fil=payout_fil;
									  listInvestment[i].fil_paid_per_tb = fil_per_tb;
									  listInvestment[i].is_getting_paid=true;  
									    
							}  		
					       $('#payout_list_modal').modal('show');
					    });
					    $('#payout_confirm_button').on('click', function() {
							$('#loadingModal_investment').modal('show');
							 $('#payout_confirm_button').hide();	
					       $.ajax({
			                    type: "POST",
			                    url: "/addNewTokenPaid",
			                    contentType: "application/json",
			                    data: JSON.stringify(listInvestment),
			                    success: function (data) {
									$('#loadingModal_investment').modal('hide');
									$('#create_new_product').modal('hide');
									if(data=='success'){
										if ($('#alert_header').hasClass("bg-danger")) 
											{
							            		$('#alert_header').removeClass("bg-danger").addClass("bg-success");
							       		 	} 
										$('#alert_title').text("지급 완료");
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
							       		 $('#alert_title').text("지급 실패");
								            $('#alert_modal').modal('show');	
									}	
									$('#payout_confirm_button').show();	
			                    }
			                });
					    });
					     
					    $(document).on('click', '.payout_box', function() {
							if($(this).is(':checked')){
								var indexToRemove = uncheckedList.indexOf($(this).val());
								if (indexToRemove !== -1) {
									 uncheckedList.splice(indexToRemove, 1);
								}
							}else{
								uncheckedList.push($(this).val());
							}
						});
					    
					    $('#session_alert_user').on('hidden.bs.modal', function (e) {
								 window.location.href = "/";
					    });  
						$('#create_product_manager_button').on('click', function() {
					       $('#create_product_manager').modal('show');
					    });
					    $('#add_new_product_btn').on('click', function() {
						   $('#new_product_name').val('');
					       $('#create_new_product').modal('show');
					    });
					     $(document).on('click', '.update_product_btn', function() {
						    $('#update_product').modal('show');
						    var parentRow = $(this).closest('tr');
						    $('#update_product_name').val(parentRow.find('#investment_category_name').text());
						    $('#update_cateogry_fil_per_tb').val(parentRow.find('#cateogry_fil_per_tb').text());
							$('#node_product_edit_btn').val($(this).val());
						    if (parentRow.find('#investment_status').text() == '사용') {
						        $('input[name="investment_status"][value="사용"]').prop('checked', true);
						    } else {
						        $('input[name="investment_status"][value="중지"]').prop('checked', true);
						    }
						     if (parentRow.find('#on_all_search').text() == '포함') {
						        $('input[name="on_all_search"][value="포함"]').prop('checked', true);
						    } else {
						        $('input[name="on_all_search"][value="제외"]').prop('checked', true);
						    }
						});
					     $('#add_new_product_ajax').on('click', function() {
					       var investment_category_name = $("#new_product_name").val();
					       var cateogry_fil_per_tb = $("#new_cateogry_fil_per_tb").val();	
					       var on_all_search = $('input[name="on_all_search_add"]:checked').val();			 
							  if (!/^[1-9]\d*$/.test(cateogry_fil_per_tb)) {
								  $('#alert2_modal').modal('show');
						          return;
						        } 
			                $.ajax({
			                    type: "POST",
			                    url: "/addNewProduct",
			                    contentType: "application/json",
			                    data: JSON.stringify({
							        investment_category_name: investment_category_name,
									cateogry_fil_per_tb:cateogry_fil_per_tb,
									on_all_search:on_all_search
							    }),
			                    success: function (data) {
									$('#create_new_product').modal('hide');
									if(data.response=='success'){
										if ($('#alert_header').hasClass("bg-danger")) 
											{
							            		$('#alert_header').removeClass("bg-danger").addClass("bg-success");
							       		 	} 
										$('#alert_title').text("제품등록 성공");
										$('#alert_modal').modal('show');
			                        }
			                        else if(data.response='failed:session_closed'){
										$('#session_alert_investment').modal('show');
									}
			                        else{
										if ($('#alert_header').hasClass("bg-success")) 
										{
								            $('#alert_header').removeClass("bg-success").addClass("bg-danger");
							       		} 		
							       		 $('#alert_title').text("제품등록 실패 : 중복된 제품명");
								            $('#alert_modal').modal('show');	
									}
			                    }
			                });
					    });
					    $('#node_product_edit_btn').on('click', function() {
					       var investment_category_name = $("#update_product_name").val();
					       var status = $('input[name="investment_status"]:checked').val();
					        var on_all_search = $('input[name="on_all_search"]:checked').val();
					       var cateogry_fil_per_tb = $("#update_cateogry_fil_per_tb").val();
					        if (!/^[1-9]\d*$/.test(cateogry_fil_per_tb)) {
								  $('#alert2_modal').modal('show');
						          return;
						        } 
					       var index = $('#node_product_edit_btn').val();
					       $.ajax({
			                    type: "POST",
			                    url: "/updateProduct",
			                    contentType: "application/json",
			                     data: JSON.stringify({
							        investment_category_name: investment_category_name,
							        status: status,
							        cateogry_fil_per_tb:cateogry_fil_per_tb,
							        investment_category_index : index,
							        on_all_search : on_all_search
							    }),
			                    success: function (data) {
									$('#update_product').modal('hide');
									if(data.response=='success'){	
										if ($('#alert_header').hasClass("bg-danger")) 
											{
							            		$('#alert_header').removeClass("bg-danger").addClass("bg-success");
							       		 	} 
										$('#alert_title').text("제품정보 수정 성공");
										$('#alert_modal').modal('show');
			                        } else if(data.response='failed:session_closed'){
										$('#session_alert_investment').modal('show');
									}
			                        else{
										if ($('#alert_header').hasClass("bg-success")) 
										{
								            $('#alert_header').removeClass("bg-success").addClass("bg-danger");
							       		} 			
							       		 $('#alert_title').text("제품정보 수정 실패 : 중복된 제품명 또는 같은 정보");
								            $('#alert_modal').modal('show');
									}
			                    }
			                });
					    });
					     $('#dataTable').DataTable({
					    	"ordering": false
						});
					    
});