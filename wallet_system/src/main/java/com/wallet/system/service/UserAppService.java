/*
 * Decompiled with CFR 0.151.
 * 
 * Could not load the following classes:
 *  org.springframework.beans.factory.annotation.Autowired
 *  org.springframework.stereotype.Service
 */
package com.wallet.system.service;

import com.wallet.system.mapper.InvestmentMapper;
import com.wallet.system.mapper.UserAppMapper;
import com.wallet.system.vo.EventsAnnouncementVO;
import com.wallet.system.vo.InvestmentVO;
import com.wallet.system.vo.MemoVO;
import com.wallet.system.vo.TokenPaidDetailVO;
import com.wallet.system.vo.UserFilAddressVO;
import com.wallet.system.vo.UserInfoVO;
import com.wallet.system.vo.WalletWithdrawalVO;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserAppService {
    @Autowired
    UserAppMapper userAppMapper;
    @Autowired
    InvestmentMapper investmentMapper;
    @Autowired
    private InvestmentService investmentService;
    //**>>>>>   유저 에따른 투자 목록 조회   <<<<<**//
    public List<InvestmentVO> getInvestmentListByUser(UserInfoVO userInfoVO) {
        return this.userAppMapper.getInvestmentListByUser(userInfoVO);
    }
    //**>>>>>   유저에 따른배분 상세 정보 조회   <<<<<**//
    public List<TokenPaidDetailVO> getTokenPaidDetailListByUser(UserInfoVO userInfoVO) {
        return this.userAppMapper.getTokenPaidDetailListByUser(userInfoVO);
    }
    //**>>>>>   송금신청 추가   <<<<<**//
    public String addWalletWithdrawal(WalletWithdrawalVO walletWithdrawalVO) {
    	
        userAppMapper.addWalletWithdrawal(walletWithdrawalVO); 
        return "success";
    }
    //**>>>>>   송금 신청 리스트 유저에 따른 조회   <<<<<**//
    public List<WalletWithdrawalVO> selectWalletWithdrawal(UserInfoVO userInfoVO) {
        return userAppMapper.selectWalletWithdrawalByUser(userInfoVO); 
    }
    //**>>>>>   유저 프로파일 사진 수정   <<<<<**//
    public String updateUserProfileImg(UserInfoVO userInfoVO, HttpServletRequest request) {
    	MemoVO memoVO = new MemoVO();
    	memoVO.setUser_id(userInfoVO.getUser_id());
    	userAppMapper.updateUserProfileImg(userInfoVO);
    	return "success";
    }
    //**>>>>>   유저 비번 업데이트   <<<<<**//
    public String updateUserPassword(UserInfoVO userInfoVO, HttpServletRequest request) {
    	MemoVO memoVO = new MemoVO();
    	memoVO.setUser_id(userInfoVO.getUser_id());
    	userAppMapper.updateUserPassword(userInfoVO);
    	return "success";
    }
    //**>>>>>   유저 비번 조회   <<<<<**//
    public String selectUserPassword(int user_id) {
    	return userAppMapper.selectUserPassword(user_id);
    }
    //**>>>>>   유저 상세 정보 조회   <<<<<**//
    public UserInfoVO selectDetailUserInfoByUserId(int user_id) {
    	return userAppMapper.selectDetailUserInfoByUserId(user_id);
    }
    //**>>>>>   유저에 관련된 이벤트나 공지사항 조회   <<<<<**//
	public List<EventsAnnouncementVO> selectAnnouncementEventByUser(int user_id){
		return userAppMapper.selectAnnouncementEventByUser(user_id);
	}
	 //**>>>>>   이메일 존제 여부 체크   <<<<<**//
	public boolean selectUserEmail(UserInfoVO userInfoVO) {
		if (userAppMapper.selectCheckUserEmail(userInfoVO.getUser_email()) == null) {
			return false;
		}
		return true;
	}
	 //**>>>>>   유저 추기  <<<<<**//
	public String insertUser(UserInfoVO userInfoVO) {
		 userAppMapper.insertUser(userInfoVO);
		 return "success";
	}
	 //**>>>>>   유저 지갑 추가   <<<<<**//
	public String insertUserAddress(UserFilAddressVO userFillAddressVO) {
		 userAppMapper.insertUserAddress(userFillAddressVO);
		 return "success";
	}
	 //**>>>>>   유저 지갑 삭제   <<<<<**//
	public String deleteUserAddressByUserId(int user_id) {
		 userAppMapper.deleteUserAddressByUserId(user_id);
		 return "success";
	}
	 //**>>>>>   유저 지갑 조회   <<<<<**//
	public UserFilAddressVO selectUserAddress(int user_id) {
		 return userAppMapper.selectUserAddress(user_id);
	}
	
	public String checkUserRequestFundLimit(int user_id, int request_per_day) {
		 if(userAppMapper.selectUserRequestFundCnt(user_id)>=request_per_day) {
			 return "일일 송금신청 한도 초과";
		 }
		 return "송금신청 가능";
	}
	
	
	
	}
    


