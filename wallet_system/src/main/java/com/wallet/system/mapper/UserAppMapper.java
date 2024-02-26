/*
 * Decompiled with CFR 0.151.
 * 
 * Could not load the following classes:
 *  org.apache.ibatis.annotations.Mapper
 */
package com.wallet.system.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.wallet.system.vo.EventsAnnouncementVO;
import com.wallet.system.vo.InvestmentVO;
import com.wallet.system.vo.TokenPaidDetailVO;
import com.wallet.system.vo.UserFilAddressVO;
import com.wallet.system.vo.UserInfoVO;
import com.wallet.system.vo.WalletWithdrawalVO;

@Mapper
public interface UserAppMapper {
	public List<InvestmentVO> getInvestmentListByUser(UserInfoVO userInfoVO);
	public List<TokenPaidDetailVO> getTokenPaidDetailListByUser(UserInfoVO userInfoVO);
	public void addWalletWithdrawal(WalletWithdrawalVO walletWithdrawalVO);
	
	public List<WalletWithdrawalVO> selectWalletWithdrawalByUser(UserInfoVO userInfoVO);
	public void updateUserProfileImg(UserInfoVO userInfoVO);
	public void updateUserPassword(UserInfoVO userInfoVO);
	public String selectUserPassword(int user_id);
	public UserInfoVO selectDetailUserInfoByUserId(int user_id);
	public List<EventsAnnouncementVO> selectAnnouncementEventByUser(int user_id);
	public String selectCheckUserEmail(String user_email);
	public void insertUser(UserInfoVO userInfoVO);
	
	public void insertUserAddress(UserFilAddressVO userFillAddressVO);
	public void deleteUserAddressByUserId(int user_id);
	public UserFilAddressVO selectUserAddress(int user_id);
	public int selectUserRequestFundCnt(int user_id);
	
	
}

