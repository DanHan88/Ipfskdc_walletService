package com.wallet.system.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import com.wallet.system.vo.UserInfoVO;

public class FCMNotificationService {
	@Autowired
    private  FirebaseMessaging firebaseMessaging;
	@Autowired
    private  InvestmentService investmentService;
	@Autowired
    private  UserAppService userAppService;
	 //**>>>>>   앱 메시지 기능 미완성   <<<<<**//
    public String sendNotificationByToken() {

    	List<UserInfoVO> userList = investmentService.selectUserInfoList();
    	/*
        if (userList!=null) {
            if (user.get().getFirebaseToken() != null) {
                Notification notification = Notification.builder()
                        .setTitle(requestDto.getTitle())
                        .setBody(requestDto.getBody())
                        // .setImage(requestDto.getImage())
                        .build();

                Message message = Message.builder()
                        .setToken(user.get().getFirebaseToken())
                        .setNotification(notification)
                        // .putAllData(requestDto.getData())
                        .build();

                try {
                    firebaseMessaging.send(message);
                    return "알림을 성공적으로 전송했습니다. targetUserId=" + requestDto.getTargetUserId();
                } catch (FirebaseMessagingException e) {
                    e.printStackTrace();
                    return "알림 보내기를 실패하였습니다. targetUserId=" + requestDto.getTargetUserId();
                }
            } else {
                return "서버에 저장된 해당 유저의 FirebaseToken이 존재하지 않습니다. targetUserId=" + requestDto.getTargetUserId();
            }

        } else {
            return "해당 유저가 존재하지 않습니다. targetUserId=" + requestDto.getTargetUserId();
        }
          */ return null;
    }
  
}