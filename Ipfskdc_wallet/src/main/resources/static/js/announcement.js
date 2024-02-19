$(document).ready(function() {
						var clickedAnnouncementId;
						 $('.announcementBodyBtn').on('click', function() {
							 clickedAnnouncementId = $(this).data('announced-id');
							 $('#announcement_body').val($(this).data('announce-dody'));
							 $('#announcement_title').val($(this).data('announce-title'));
					    	$('#announcementBodyModal').modal('show');
					    });     
						    
						 $('#dataTableContainer').show();
						 
						 $('#announcementModal').on('click', function() {
					    	$('#announcementModal').modal('show');
					    	
					    	 
					    }); 
					    $('#announcementConfirm').off('click').on('click', function() {		
													 
					                $.ajax({
					                    type: 'POST',
					                    url: '/uploadAnnouncements',
					                    contentType: 'application/json',
					                    data: JSON.stringify({
					                        title: $('#announcementTitle').val(),
					                        body: $('#announcementBody').val(),
					                        event_or_announcement: "공지사항"
					                        
					                    }),
					                    success: function(data) {
													$('#announcementModal').modal('hide');
					                                if (data === 'success') {
					                                    // 성공 시 모달 닫고 새로고침
					                                    location.reload(true);
					                                    
					                                  
					                      
					                                } else if (data === 'failed:session_closed') {
					                                    // 세션 종료 시 다른 처리
					                                    $('#session_alert_user').modal('show');
					                                }
					                            },
					                    error: function(error) {
					                        // 요청에 실패했을 때 수행할 동작
					                        console.error('승인 요청 실패:', error);
					                    },   
					                });
					            
					        }); 
					         $('#alert_modal_user').on('hidden.bs.modal', function (e) {
							 if ($('#alert_header_user').hasClass("bg-success")){
								 location.reload(true);
							 } 
						      });
					        
					         $('#editButton').off('click').on('click', function() {			
								 	var announcementId = clickedAnnouncementId;
								    var updatedTitle = $('#announcement_title').val();
								    var updatedBody = $('#announcement_body').val();
								
								    // �꽌踰꾨줈 �뾽�뜲�씠�듃 �슂泥� 蹂대궡湲�
								    $.ajax({
								        type: 'POST',
								        url: '/updateAnnouncements', // �떎�젣 �뾽�뜲�씠�듃瑜� �닔�뻾�븯�뒗 �꽌踰� �뿏�뱶�룷�씤�듃濡� �꽕�젙
								        contentType: 'application/json',
								        data: JSON.stringify({
								            id: announcementId,
								            title: updatedTitle,
								            body: updatedBody
								        }),
					                    success: function(data) {
													//$('#announcementModal').modal('hide');
													
					                                if (data === 'success') {
					                                    // �꽦怨� �떆 紐⑤떖 �떕怨� �깉濡쒓퀬移�
					                                    $('#announcementModal').modal('hide');
					                                    $('#alert_header_user').removeClass("bg-danger").addClass("bg-success");
					                                    $('#alert_title_user').text("수정완료");
					                                    $('#alert_modal_user').modal('show');
					                                    //location.reload(true);
					                                    
					                                  
					                      
					                                } else if (data === 'failed:session_closed') {
					                                    // �꽭�뀡 醫낅즺 �떆 �떎瑜� 泥섎━
					                                    $('#session_alert_user').modal('show');
					                                }
					                            },
					                    error: function(error) {
					                        // �슂泥��뿉 �떎�뙣�뻽�쓣 �븣 �닔�뻾�븷 �룞�옉
					                        console.error('요청 실패:', error);
					                    },   
					                });
					            
					        }); 
					         $('#deleteButton').off('click').on('click', function() {			
								 	var announcementId = clickedAnnouncementId;
								    
								
								    // �꽌踰꾨줈 �뾽�뜲�씠�듃 �슂泥� 蹂대궡湲�
								    $.ajax({
								        type: 'POST',
								        url: '/deleteAnnouncements',
								        contentType: 'application/json',
								        data: JSON.stringify({
								            id: announcementId,
								            event_or_announcement:"삭제된항목"
								        }),
					                    success: function(data) {
													//$('#announcementModal').modal('hide');
													
					                                if (data === 'success') {
					                                    // �꽦怨� �떆 紐⑤떖 �떕怨� �깉濡쒓퀬移�
					                                    $('#announcementModal').modal('hide');
					                                    $('#alert_header_user').removeClass("bg-danger").addClass("bg-success");
					                                    $('#alert_title_user').text("삭제완료");
					                                    $('#alert_modal_user').modal('show');
					                                    //location.reload(true);
					                                    
					                                  
					                      
					                                } else if (data === 'failed:session_closed') {
					                                    // �꽭�뀡 醫낅즺 �떆 �떎瑜� 泥섎━
					                                    $('#session_alert_user').modal('show');
					                                }
					                            },
					                    error: function(error) {
					                        // �슂泥��뿉 �떎�뙣�뻽�쓣 �븣 �닔�뻾�븷 �룞�옉
					                        console.error('요청 실패:', error);
					                    },   
					                });
					            
					        });
					    
					     $('#dataTable').DataTable({
					    	 "order": [[0, 'desc']]
						});		

					    
});