/*
 * Decompiled with CFR 0.151.
 * 
 * Could not load the following classes:
 *  org.springframework.beans.factory.annotation.Autowired
 *  org.springframework.stereotype.Service
 */
package com.wallet.system.service;

import com.wallet.system.mapper.InvestmentMapper;
import com.wallet.system.vo.AdminOptionVO;
import com.wallet.system.vo.EventsAnnouncementVO;
import com.wallet.system.vo.InvestmentCategoryVO;
import com.wallet.system.vo.InvestmentVO;
import com.wallet.system.vo.LoginVO;
import com.wallet.system.vo.MemoVO;
import com.wallet.system.vo.WalletWithdrawalVO;
import com.wallet.system.vo.TokenPaidDetailVO;
import com.wallet.system.vo.TokenPaidVO;
import com.wallet.system.vo.UserInfoVO;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

@Service
public class InvestmentService {
    @Autowired
    InvestmentMapper investmentMapper;
    
    @Autowired
	 private PasswordEncoder pwEncoder;
    
    //**>>>>>   관리자 지갑 정보   <<<<<**//
    @Value("${admin.wallet.address}")
    private String admin_walletAddress;

    //**>>>>>   투자리스트 조회   <<<<<**//
    public List<InvestmentVO> getInvestmentList() {
        return this.investmentMapper.selectInvestmentList();
    }
    //**>>>>>  배분 리스트 조회   <<<<<**//
    public List<TokenPaidVO> selectTokenPaidVOList() {
        return investmentMapper.selectTokenPaidVOList();
    }
    //**>>>>>   배분 상세 리스트 조회   <<<<<**//
    public List<TokenPaidDetailVO> selectTokenDetailList(TokenPaidVO tokenPaidVO) {
        return investmentMapper.selectTokenDetailList(tokenPaidVO);
    }
    //**>>>>>   송금신청 리스트 조회   <<<<<**//
    public List<WalletWithdrawalVO> getRequestFilList() {
        return this.investmentMapper.selectRequestFilList();
    }
    //**>>>>>   유저정보리스트 조회   <<<<<**//
    public List<UserInfoVO> selectUserInfoList() {
        return this.investmentMapper.selectUserInfoList();
    }
    //**>>>>>   상품에따른 투자 목록 조히   <<<<<**//
    public List<InvestmentVO> getInvestmentListByCategory(int category_index) {
        return this.investmentMapper.getInvestmentListByCategory(category_index);
    }
    //**>>>>>   상품 목록 조회   <<<<<**//
    public List<InvestmentCategoryVO> getInvestmentCategoryList() {
        return this.investmentMapper.selectInvestmentCategoryList();
    }
    //**>>>>>   투자 아이디 조회   <<<<<**//
    public List<String> getIDList() {
        return this.investmentMapper.selectIDList();
    }
    //**>>>>>   관리자 아이디로 관리자 조회   <<<<<**//
    public LoginVO findAdminByAdminId(String id) {
        return this.investmentMapper.findAdminByAdminId(id);
    }
    //**>>>>>   세션 체크   <<<<<**//
    public boolean checkSession(HttpServletRequest request,boolean isAdmin) {
    	HttpSession session = request.getSession();
    	LoginVO loginVO = (LoginVO)session.getAttribute("user");
        if (session.getAttribute("user") == null || loginVO.getId() == "") {
	        return false;
	    }
        if(isAdmin!=loginVO.isAdmin()) {
        	return false;
        }
	    return true;
    }
    //**>>>>>  새로운 투자 상품 등록   <<<<<**//
    public InvestmentCategoryVO addNewProductCategory(InvestmentCategoryVO investmentCategoryVO) {
    	InvestmentCategoryVO checked = investmentMapper.verifyProductCategory(investmentCategoryVO.getInvestment_category_name());
    	if(checked!=null) {
    		checked.setResponse("error1");
    		return checked;
    	}
    	investmentMapper.addNewProductCategory(investmentCategoryVO);
    	investmentCategoryVO = investmentMapper.verifyProductCategory(investmentCategoryVO.getInvestment_category_name());
    	investmentCategoryVO.setResponse("success");
    	return investmentCategoryVO;
    }
    //**>>>>>   새 유저 등록   <<<<<**//
    public String addNewUser(UserInfoVO userInfoVO, HttpServletRequest request) {
    	UserInfoVO overlappingUserInfoVO = investmentMapper.verifyUserInfoVO(userInfoVO);
    	if(overlappingUserInfoVO!=null) {
    		return "error1";
    	}
    	userInfoVO.setProfile_picture_url("/profile/default_profile.jpg");
    	userInfoVO.setPassword("$2a$10$swtbwzaZZjnnHAoAmGbUZOCekqeAtaCJoKiYZgtGvVqOZHipPi0iW");
    	investmentMapper.addNewUser(userInfoVO);
    	UserInfoVO newUserInfoVO = investmentMapper.verifyUserInfoVO(userInfoVO);
    	MemoVO memoVO = new MemoVO();
    	memoVO.setUser_id(newUserInfoVO.getUser_id());
    	memoVO.setMemo(newUserInfoVO.memoCreate("유저등록"));
    	regMemo(memoVO, request);
    	return "success";
    }
    //**>>>>>   새 투자 등록   <<<<<**//
    public String addNewInvestment(InvestmentVO investmentVO, HttpServletRequest request) {
    	investmentMapper.addNewInvestment(investmentVO);
    	MemoVO memoVO = new MemoVO();
    	memoVO.setUser_id(investmentVO.getUser_id());
    	memoVO.setMemo(investmentVO.memoCreate("투자등록"));
    	regMemo(memoVO, request);
    	return "success";
    }
    //**>>>>>   투자 수정   <<<<<**//
    public String modifyInvestment(InvestmentVO investmentVO, HttpServletRequest request) {
    	MemoVO memoVO = new MemoVO();
    	memoVO.setUser_id(investmentVO.getUser_id());
    	memoVO.setMemo(investmentVO.memoCreate("투자수정"));
    	regMemo(memoVO, request);
    	investmentMapper.modifyInvestment(investmentVO);
    	return "success";
    }
    //**>>>>>   투자 삭제   <<<<<**//
    public String deleteInvestment(InvestmentVO investmentVO, HttpServletRequest request) {
    	MemoVO memoVO = new MemoVO();
    	memoVO.setUser_id(investmentVO.getUser_id());
    	memoVO.setMemo(investmentVO.memoCreate("투자삭제"));
    	regMemo(memoVO, request);
    	investmentMapper.deleteInvestment(investmentVO);
    	return "success";
    }
    //**>>>>>   유저 메모 조히   <<<<<**//
    public List<MemoVO> selectUserMemo(UserInfoVO userInfoVO) {
    	
    	return investmentMapper.selectUserMemo(userInfoVO);
    }
    //**>>>>>   메모 추가   <<<<<**//
    public String regMemo(MemoVO regMemo, HttpServletRequest request) {
    	HttpSession session = request.getSession();
    	LoginVO loginVO = (LoginVO)session.getAttribute("user");
    	regMemo.setAdmin_id(loginVO.getId());
    	investmentMapper.regMemo(regMemo);
    	return "success";
    }
    //**>>>>>   유저 정보 수정   <<<<<**//
    public String updateUser(UserInfoVO userInfoVO, HttpServletRequest request) {
    	investmentMapper.updateUser(userInfoVO);
    	return "success";
    }
    
    //**>>>>>   유저 비번 초기화   <<<<<**//
    public String userPwReset(UserInfoVO userInfoVO, HttpServletRequest request) {
    	investmentMapper.userPwReset(userInfoVO);
    	return "success";
    }
    
    
    //**>>>>>  투자 상품정보 수정   <<<<<**//
    public InvestmentCategoryVO updateProductCategory(InvestmentCategoryVO investmentCategory) {
    	InvestmentCategoryVO investmentCategoryVO = investmentMapper.verifyProductCategory(investmentCategory.getInvestment_category_name());
    	if(investmentCategoryVO!=null&&investmentCategoryVO.getInvestment_category_index()!=investmentCategory.getInvestment_category_index()) {
    		if(investmentCategoryVO.getInvestment_category_index()!=investmentCategory.getInvestment_category_index()||investmentCategoryVO.getStatus().equals(investmentCategory.getStatus())) {
    			investmentCategoryVO.setResponse("error1");
        		return investmentCategoryVO;
    		}
    	}
    	investmentMapper.updateProductCategory(investmentCategory);
    	investmentCategoryVO = investmentMapper.selectInvestmentCategoryByIndex(investmentCategory.getInvestment_category_index());
    	investmentCategoryVO.setResponse("success");
    	return investmentCategoryVO;
    }
    //**>>>>>   유저에 따른 투자 목록 조회   <<<<<**//
    public List<InvestmentVO> selectInvestmentListForUser(int user_id){
    	return investmentMapper.selectInvestmentListForUser(user_id);
    }
    
    //**>>>>>   이벤트 조회   <<<<<**//
    public List<EventsAnnouncementVO> selectEvents(){
    	return investmentMapper.selectEvents();
    }
    //**>>>>>   공지사항 조회   <<<<<**//
	public List<EventsAnnouncementVO> selectAnnouncements(){
		return investmentMapper.selectAnnouncements();
	}
	 //**>>>>>   유저 배분 추가   <<<<<**//
    public String addNewTokenPaidInfo(List<InvestmentVO> listInvestment, HttpServletRequest request) {
    	TokenPaidVO tokenPaidVO = new TokenPaidVO();
    	tokenPaidVO.setFil_paid_per_tb(listInvestment.get(0).getFil_paid_per_tb());
    	HttpSession session = request.getSession();
    	LoginVO loginVO = (LoginVO)session.getAttribute("user");
    	tokenPaidVO.setAdmin_id(loginVO.getId());
    	tokenPaidVO.setMemo(listInvestment.get(0).getMemo());
    	investmentMapper.addNewTokenPaidInfo(tokenPaidVO);
    	double token_paid_id = investmentMapper.selectLastTokenPaidInfo();
    	for(int i=0;i<listInvestment.size();i++) {
    		if(listInvestment.get(i).isIs_getting_paid()) {
	    		TokenPaidDetailVO tokenPaidDetailVO = new TokenPaidDetailVO();
	    		tokenPaidDetailVO.setToken_paid_id(token_paid_id);
	    		tokenPaidDetailVO.setUser_id(listInvestment.get(i).getUser_id());
	    		tokenPaidDetailVO.setPaid_fil(listInvestment.get(i).getPayout_fil());
	    		tokenPaidDetailVO.setInvestment_category_index(listInvestment.get(i).getInvestment_category_id());
	    		investmentMapper.addNewTokenPaidDetailInfo(tokenPaidDetailVO);
    		}
    	}
    	return "success";
    }
    //**>>>>>   유저 배분 수정   <<<<<**//
 public String updateTokenPaid(TokenPaidVO tokenPaidVO) {
    	
	 
    	investmentMapper.updateTokenPaidInfo(tokenPaidVO);
    	
    	List<TokenPaidDetailVO> tokenPaidDetailList = investmentMapper.selectTokenDetailList(tokenPaidVO);
    	if(tokenPaidDetailList!=null && tokenPaidDetailList.size()==1) {
    		if(tokenPaidDetailList.get(0).getStatus().equals("개인전송") ||tokenPaidDetailList.get(0).getStatus().equals("개인차감")) {
    			investmentMapper.updatePersonalTokenPaidDetailInfo(tokenPaidVO);
        		return "success";
    			
    		}
    	}
    	investmentMapper.updateTokenPaidDetailInfo(tokenPaidVO);
    	return "success";
    }
 
 //**>>>>>  송금신청 승인   <<<<<**//
public String approveFundRequest(WalletWithdrawalVO walletWithdrawalVO) {
	String is_request_state = walletWithdrawalVO.getIs_request_state();
	walletWithdrawalVO = investmentMapper.selectRequestFilById(walletWithdrawalVO);
	walletWithdrawalVO.setIs_request_state(is_request_state);
    String encrypted_address = walletWithdrawalVO.getEncrypted_wallet();
    String address = walletWithdrawalVO.getWallet_address();
    
	if(!this.pwEncoder.matches((CharSequence)(address+walletWithdrawalVO.getUser_id()), encrypted_address)) {
    	return "에러 : 지갑주소가 프로세스 중에 변경되었습니다. 관리자에게 문의 부탁드립니다.";
    }
	
	
	BigDecimal walletCheck = walletCheck();
	if(walletCheck.equals(BigDecimal.valueOf(-1))) {
    	return "에러: 로터스 노드 연결실패:"+ walletCheck;
    }
    System.out.println("테스트 조회 : " + walletCheck);
    BigDecimal filAmount = walletWithdrawalVO.getFil_amount();
    BigDecimal one = BigDecimal.ONE;
    if (filAmount.add(one).compareTo(walletCheck) > 0) {
        return "에러: 관리자 지갑 잔고 부족:" + walletCheck;
    }

    
    

    String returnHash = lotusSend(walletWithdrawalVO.getWallet_address(),walletWithdrawalVO.getFil_amount());
    if(returnHash.equals("Command failed")){
    	return "에러 : 송금실패";
    };
    walletWithdrawalVO.setMessage(returnHash);
	investmentMapper.updateStatus(walletWithdrawalVO);
	System.out.println("send 결과 : " + returnHash);
    return "success";  
}

//**>>>>>   송금신청 거부   <<<<<**//
public String declineFundRequest(WalletWithdrawalVO walletWithdrawalVO) {
	// TODO Auto-generated method stub
	investmentMapper.updateStatus(walletWithdrawalVO);
    // 조회된 행이 존재하고 상태가 '신청'인 경우에만 업데이트
	return "success";	
}
//**>>>>>   지갑 체크   <<<<<**//
public BigDecimal walletCheck() {
    String cmd = "echo $(lotus wallet balance "+ admin_walletAddress +") | awk '{print $1}'";
    System.out.println(cmd);
    String[] command = {"/bin/sh", "-c", cmd};
    BigDecimal result = new BigDecimal(0); 
    try {
        ProcessBuilder processBuilder = new ProcessBuilder(command);
        Process process = processBuilder.start();
        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
        String line;
        while ((line = reader.readLine()) != null) {
            try {
                result = new BigDecimal(line);
            } catch (NumberFormatException e) {
                result = new BigDecimal(-1);
            }
        }
        int exitCode = process.waitFor();
        if (exitCode != 0) {
            result = new BigDecimal(-1); 
        }
    } catch (Exception e) {
        result = new BigDecimal(-1); 
    }
    return result;
}
//**>>>>>   로터스 송금   <<<<<**//
public String lotusSend(String user_address, BigDecimal fil_amount) {
    String cmd = "lotus send --from " +  admin_walletAddress +  " " + user_address + " " + fil_amount.toPlainString();
    System.out.println(cmd);
    
    String[] command = {"/bin/sh", "-c", cmd};
    String result = "";

    try {
        ProcessBuilder processBuilder = new ProcessBuilder(command);
        Process process = processBuilder.start();
        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
        String line;

        while ((line = reader.readLine()) != null) {
            result += line + "\n";
        }

        int exitCode = process.waitFor();
        if (exitCode != 0) {
            result = "Command failed";
        }
    } catch (Exception e) {
        result = "ERROR";
    }

    return result.trim();
}
//**>>>>>   이벤트&공지사항 추가   <<<<<**//
public String insert_Events_or_Announcement(EventsAnnouncementVO eventsAnnouncementVO) {
	investmentMapper.insertAnnouncement(eventsAnnouncementVO);
    // 조회된 행이 존재하고 상태가 '신청'인 경우에만 업데이트
	return "success";	
}
//**>>>>>   이벤트&공지사항 수정   <<<<<**//
public String update_Events_or_Announcement(EventsAnnouncementVO eventsAnnouncementVO) {
	investmentMapper.updateAnnouncement(eventsAnnouncementVO);
	return "success";	
}
//**>>>>>   이벤트&공지사항 삭제   <<<<<**//
public String delete_Events_or_Announcement(EventsAnnouncementVO eventsAnnouncementVO) {
	investmentMapper.deleteAnnouncement(eventsAnnouncementVO);
	return "success";	
}
//**>>>>>   관리자 비번 수정   <<<<<**//
public String update_Admin_Password(LoginVO loginVO) {
	investmentMapper.update_Admin_Password(loginVO);
	return "success";
}

public AdminOptionVO selectAdminOption() {
	return investmentMapper.selectAdminOption();
}
public void updateAdminOption(AdminOptionVO adminOptionVO) {
	investmentMapper.updateAdminOption(adminOptionVO);
}

}

