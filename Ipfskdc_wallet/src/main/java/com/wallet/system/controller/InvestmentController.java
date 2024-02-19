/*
 * Decompiled with CFR 0.151.
 * 
 * Could not load the following classes:
 *  javax.servlet.http.HttpServletRequest
 *  javax.servlet.http.HttpServletResponse
 *  javax.servlet.http.HttpSession
 *  org.springframework.beans.factory.annotation.Autowired
 *  org.springframework.security.crypto.password.PasswordEncoder
 *  org.springframework.stereotype.Controller
 *  org.springframework.validation.BindingResult
 *  org.springframework.web.bind.annotation.GetMapping
 *  org.springframework.web.bind.annotation.ModelAttribute
 *  org.springframework.web.bind.annotation.PostMapping
 *  org.springframework.web.servlet.ModelAndView
 *  org.springframework.web.servlet.mvc.support.RedirectAttributes
 */
package com.wallet.system.controller;

import com.wallet.system.service.InvestmentService;
import com.wallet.system.service.UserAppService;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.StringUtils;

import com.wallet.system.vo.EventsAnnouncementVO;
import com.wallet.system.vo.InvestmentCategoryVO;
import com.wallet.system.vo.InvestmentVO;
import com.wallet.system.vo.LoginVO;
import com.wallet.system.vo.MemoVO;
import com.wallet.system.vo.RequestFilVO;
import com.wallet.system.vo.TokenPaidDetailVO;
import com.wallet.system.vo.TokenPaidVO;
import com.wallet.system.vo.UserFilAddressVO;
import com.wallet.system.vo.UserInfoVO;
import com.wallet.system.vo.WalletWithdrawalVO;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;

import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

//**>>>>>   관리자 투자관련 컨트롤러   <<<<<**// 
@Controller
public class InvestmentController {
    @Autowired
    private InvestmentService investmentService;
    @Autowired
    private UserAppService userAppService;
    @Autowired
    private PasswordEncoder pwEncoder;
    
    @Value("${upload.directory}")
    private String uploadDirectory;
    
  //**>>>>>  기본 인덱스 페이지   <<<<<**// 
    @GetMapping(value={"/"})
    public ModelAndView login(@ModelAttribute("loginError") String loginError,@ModelAttribute LoginVO loginVO, HttpServletRequest request) {
        ModelAndView mav = new ModelAndView();
        if(!investmentService.checkSession(request,true)) {
        	mav.setViewName("views/login");
        	mav.addObject("loginError", loginError);
            return mav;
        }
	        mav.setViewName("redirect:/main");
	        return mav;
    }
  //**>>>>>   로그아웃   <<<<<**// 
    @GetMapping(value={"/logoutUser"})
    public String logout(HttpServletRequest request) {
        HttpSession session = request.getSession();
        session.invalidate();
        return "redirect:/";
    }
  //**>>>>>   관리자 비밀번호 변경   <<<<<**// 
    @GetMapping(value={"/adminPwdUpdate"})
    public  ModelAndView adminPwdUpdate(HttpServletRequest request,String sb) {
    	ModelAndView mav = new ModelAndView();
        if(!investmentService.checkSession(request,true)) {
        	mav.setViewName("redirect:/");
            return mav;
        }
        HttpSession session = request.getSession();
        LoginVO loginVO = (LoginVO)session.getAttribute("user");
        mav.addObject("sb", sb);
        mav.addObject("loginVO", loginVO);
        mav.setViewName("views/adminPwdUpdate");
        return mav;
    }

    //**>>>>>   로그인 프로세스   <<<<<**// 
    @PostMapping(value={"/login.do"})
    private String doLogin(LoginVO loginVO, BindingResult result, RedirectAttributes redirect, HttpServletRequest request, HttpServletResponse response) throws Exception {
        LoginVO lvo = this.investmentService.findAdminByAdminId(loginVO.getId());
        HttpSession session = request.getSession();
        String rawPw = "";
        String encodePw = "";
       
        if (lvo != null) {
            rawPw = loginVO.getPassword();
            if (this.pwEncoder.matches((CharSequence)rawPw, encodePw = lvo.getPassword())) {
                lvo.setPassword("");
                lvo.setAdmin(true);
                session.setAttribute("user", (Object)lvo);
                return "redirect:/main";
            }
        }
        redirect.addFlashAttribute("loginError", "아이디와 페스워드를 확인해주세요");
        return "redirect:/";
    }
    
    //**>>>>>   송금 신청 처리   <<<<<**// 
    @ResponseBody  
    @PostMapping(value={"/updateFundRequest"})
    public String updateFundRequest(@RequestBody WalletWithdrawalVO walletWithdrawalVO, HttpServletRequest request) {
        
        
        if ("승인".equals(walletWithdrawalVO.getIs_request_state())) {
            return investmentService.approveFundRequest(walletWithdrawalVO);
        } else if ("거절".equals(walletWithdrawalVO.getIs_request_state())) {
            return investmentService.declineFundRequest(walletWithdrawalVO);
        }

        return "failed:invalid_request_state";
    	}
    //**>>>>>   관리자 지갑 FIL 수량 체크   <<<<<**// 
    @ResponseBody  
    @PostMapping(value={"/checkAdminBalance"})
    public BigDecimal checkAdminBalance(HttpServletRequest request) {
    	BigDecimal balance = investmentService.walletCheck();
        return balance;
    	}
    
    //**>>>>>   새로운 투자상품 등록   <<<<<**// 
    @ResponseBody  
    @PostMapping(value={"/addNewProduct"})
    public InvestmentCategoryVO addNewProduct(@RequestBody InvestmentCategoryVO investmentCategoryVO,  HttpServletRequest request) {
    	if(!investmentService.checkSession(request,true)) {
    		investmentCategoryVO.setResponse("success");
    		return investmentCategoryVO;
    	}
        return investmentService.addNewProductCategory(investmentCategoryVO);
    }
    
    //**>>>>>   상품 정보 업데이트   <<<<<**// 
    @ResponseBody
    @PostMapping(value={"/updateProduct"})
    public InvestmentCategoryVO updateProduct(@RequestBody InvestmentCategoryVO investmentCategoryVO, HttpServletRequest request) {
    	if(!investmentService.checkSession(request,true)) {
    		investmentCategoryVO.setResponse("success");
    		return investmentCategoryVO;
    	}
    	return investmentService.updateProductCategory(investmentCategoryVO);
    }
    //**>>>>>   특정 유저의 투자 목록 조회   <<<<<**// 
    @ResponseBody
    @PostMapping(value={"/selectInvestmentListForUser"})
    public List<InvestmentVO> selectInvestmentListForUser(@RequestBody int user_id) {
    	return investmentService.selectInvestmentListForUser(user_id);
    }
    //**>>>>>   관리자에서 새로운 유저 추가   <<<<<**// 
    @ResponseBody
    @PostMapping(value={"/addNewUser"})
    public String addNewUser(@RequestBody UserInfoVO userInfoVO, HttpServletRequest request) {
    	if(!investmentService.checkSession(request,true)) {
    		return "failed:session_closed";
    	}
    	return investmentService.addNewUser(userInfoVO,request);
    }   
    //**>>>>>   관리자에서 새로운 투자 추가   <<<<<**// 
    @ResponseBody
    @PostMapping(value={"/addNewInvestment"})
    public String addNewInvestment(@RequestBody InvestmentVO investmentVO, HttpServletRequest request) {
    	if(!investmentService.checkSession(request,true)) {
    		return "failed:session_closed";
    	}
    	return investmentService.addNewInvestment(investmentVO,request);
    }  
    //**>>>>>   관리자 에서 투자 정보 수정   <<<<<**// 
    @ResponseBody
    @PostMapping(value={"/modifyInvestment"})
    public String modifyInvestment(@RequestBody InvestmentVO investmentVO, HttpServletRequest request) {
    	if(!investmentService.checkSession(request,true)) {
    		return "failed:session_closed";
    	}
    	return investmentService.modifyInvestment(investmentVO,request);
    } 
    //**>>>>>   관리자 에서 투자 정보 삭제   <<<<<**// 
    @ResponseBody
    @PostMapping(value={"/deleteInvestment"})
    public String deleteInvestment(@RequestBody InvestmentVO investmentVO, HttpServletRequest request) {
    	if(!investmentService.checkSession(request,true)) {
    		return "failed:session_closed";
    	}
    	return investmentService.deleteInvestment(investmentVO,request);
    } 
    //**>>>>>   유저 메모 조회   <<<<<**// 
    @ResponseBody
    @PostMapping(value={"/selectUserMemo"})
    public List<MemoVO> selectUserMemo(@RequestBody UserInfoVO userInfoVO) {
    	return investmentService.selectUserMemo(userInfoVO);
    } 
    //**>>>>>   배분상세정보 리스트 조회   <<<<<**// 
    @ResponseBody
    @PostMapping(value={"/selectTokenDetailList"})
    public List<TokenPaidDetailVO> selectTokenDetailList(@RequestBody TokenPaidVO tokenPaidVO) {
    	return investmentService.selectTokenDetailList(tokenPaidVO);	
    } 
    
    //**>>>>>   유저 정보 업데이트   <<<<<**// 
    @ResponseBody
    @PostMapping(value = { "/updateUser" })
    public String updateUser(MultipartHttpServletRequest request) {
        if (!investmentService.checkSession(request,true)) {
            return "failed:session_closed";
        }
        String user_email = request.getParameter("user_email");
        String user_phone = request.getParameter("user_phone");
        String user_name = request.getParameter("user_name");
        String user_status = request.getParameter("user_status");
        int user_id = Integer.parseInt(request.getParameter("user_id"));
        
        MultipartFile file = request.getFile("file");
        String filePathString ="";
        
        if (file != null && !file.isEmpty()) {
            try {
                String fileName = StringUtils.cleanPath(file.getOriginalFilename());

                java.nio.file.Path uploadPath = java.nio.file.Paths.get(uploadDirectory);
                if (!java.nio.file.Files.exists(uploadPath)) {
                    java.nio.file.Files.createDirectories(uploadPath);
                }

                java.nio.file.Path filePath = uploadPath.resolve(user_id+fileName);
                file.transferTo(filePath.toFile());
                filePathString = "/profile/"+user_id+fileName;
            } catch (IOException e) {
                e.printStackTrace();
            }
        }else {
        	filePathString="no_change";
        }
        UserInfoVO userInfoVO = new UserInfoVO();
        userInfoVO.setUser_email(user_email);
        userInfoVO.setUser_phone(user_phone);
        userInfoVO.setUser_name(user_name);
        userInfoVO.setUser_status(user_status);
        userInfoVO.setUser_id(user_id);
        userInfoVO.setProfile_picture_url(filePathString);

        return investmentService.updateUser(userInfoVO, request);
    }
    //**>>>>>   관리자 에서 특정 유저 비번 초기화   <<<<<**// 
    @ResponseBody
    @PostMapping(value = { "/userPwReset" })
    public String userPwReset(@RequestBody UserInfoVO userInfoVO, HttpServletRequest request) {
        if (!investmentService.checkSession(request,true)) {
            return "failed:session_closed";
        }

        return investmentService.userPwReset(userInfoVO, request);
    }
    //**>>>>>   관리자에서 메모 등록   <<<<<**// 
    @ResponseBody
    @PostMapping(value={"/regMemo"})
    public String regMemo(@RequestBody MemoVO memoVO, HttpServletRequest request) {
    	if(!investmentService.checkSession(request,true)) {
    		return "failed:session_closed";
    	}
    	return investmentService.regMemo(memoVO,request);
    }  
  //**>>>>>   새로운 배분 추가   <<<<<**//
    @ResponseBody
    @PostMapping(value={"/addNewTokenPaid"})
    public String addNewTokenPaid(@RequestBody List<InvestmentVO> listInvestment, HttpServletRequest request) {
    	if(!investmentService.checkSession(request,true)) {
    		return "failed:session_closed";
    	}
        return investmentService.addNewTokenPaidInfo(listInvestment ,request);
    }
  //**>>>>>   배분 정보 수정   <<<<<**//
    @ResponseBody
    @PostMapping(value={"/updateTokenPaid"})
    public String updateTokenPaid(@RequestBody TokenPaidVO tokenPaidVO, HttpServletRequest request) {
    	if(!investmentService.checkSession(request,true)) {
    		return "failed:session_closed";
    	}
        return investmentService.updateTokenPaid(tokenPaidVO);
    }
  //**>>>>>   공지사항 추가   <<<<<**//
    @ResponseBody
    @PostMapping(value={"/uploadAnnouncements"})
    public String upload_announcement(@RequestBody EventsAnnouncementVO eventsAnnouncementVO, HttpServletRequest request) {
    	if(!investmentService.checkSession(request,true)) {
    		return "failed:session_closed";
    	}
    	 HttpSession session = request.getSession();
    	LoginVO loginVO = (LoginVO)session.getAttribute("user");
    	eventsAnnouncementVO.setAdmin(loginVO.getId());
    	return investmentService.insert_Events_or_Announcement(eventsAnnouncementVO);
    }
  //**>>>>>   이벤트 추가   <<<<<**//
    @ResponseBody
    @PostMapping(value={"/uploadEvents"})
    public String upload_Events(@RequestBody EventsAnnouncementVO eventsAnnouncementVO, HttpServletRequest request) {
    	if(!investmentService.checkSession(request,true)) {
    		return "failed:session_closed";
    	}
    	HttpSession session = request.getSession();
    	LoginVO loginVO = (LoginVO)session.getAttribute("user");
    	eventsAnnouncementVO.setAdmin(loginVO.getId());
    	return investmentService.insert_Events_or_Announcement(eventsAnnouncementVO);
    }
  //**>>>>>   공지사항 수정   <<<<<**//
    @ResponseBody
    @PostMapping(value={"/updateAnnouncements"})
    public String update_announcement(@RequestBody EventsAnnouncementVO eventsAnnouncementVO, HttpServletRequest request) {
    	if(!investmentService.checkSession(request,true)) {
    		return "failed:session_closed";
    	}
    	 HttpSession session = request.getSession();
    	LoginVO loginVO = (LoginVO)session.getAttribute("user");
    	eventsAnnouncementVO.setAdmin(loginVO.getId());
    	return investmentService.update_Events_or_Announcement(eventsAnnouncementVO);
    }
  //**>>>>>   이벤트 수정   <<<<<**//
    @ResponseBody
    @PostMapping(value={"/updateEvents"})
    public String update_Events(@RequestBody EventsAnnouncementVO eventsAnnouncementVO, HttpServletRequest request) {
    	if(!investmentService.checkSession(request,true)) {
    		return "failed:session_closed";
    	}
    	HttpSession session = request.getSession();
    	LoginVO loginVO = (LoginVO)session.getAttribute("user");
    	eventsAnnouncementVO.setAdmin(loginVO.getId());
    	return investmentService.update_Events_or_Announcement(eventsAnnouncementVO);
    }
  //**>>>>>   공지사항 삭제   <<<<<**//
    @ResponseBody
    @PostMapping(value={"/deleteAnnouncements"})
    public String delete_announcement(@RequestBody EventsAnnouncementVO eventsAnnouncementVO, HttpServletRequest request) {
    	if(!investmentService.checkSession(request,true)) {
    		return "failed:session_closed";
    	}
    	 HttpSession session = request.getSession();
    	LoginVO loginVO = (LoginVO)session.getAttribute("user");
    	eventsAnnouncementVO.setAdmin(loginVO.getId());
    	return investmentService.delete_Events_or_Announcement(eventsAnnouncementVO);
    }
  //**>>>>>   이벤트 삭제   <<<<<**//
    @ResponseBody
    @PostMapping(value={"/deleteEvents"})
    public String delete_Events(@RequestBody EventsAnnouncementVO eventsAnnouncementVO, HttpServletRequest request) {
    	if(!investmentService.checkSession(request,true)) {
    		return "failed:session_closed";
    	}
    	HttpSession session = request.getSession();
    	LoginVO loginVO = (LoginVO)session.getAttribute("user");
    	eventsAnnouncementVO.setAdmin(loginVO.getId());
    	return investmentService.delete_Events_or_Announcement(eventsAnnouncementVO);
    }
    
  //**>>>>>   관리자 비번 수정   <<<<<**//
    @ResponseBody
    @PostMapping(value = { "/DOadminPwdUpdate" })
    public String DOadminPwdUpdate(@RequestBody LoginVO loginVO, HttpServletRequest request) {
    LoginVO lvo = this.investmentService.findAdminByAdminId(loginVO.getId());
	   if(!investmentService.checkSession(request,true)) {
    		return "failed:session_closed";
    	}
	   String rawPw = "";
       String encodePw = "";
      
       String user_id = loginVO.getId();   		
       rawPw = loginVO.getPassword();
        if (this.pwEncoder.matches((CharSequence)rawPw, encodePw = lvo.getPassword())) {
        	loginVO.setNew_password(pwEncoder.encode(loginVO.getNew_password()));
        	HttpSession session = request.getSession();
        	session.invalidate();
            	return  investmentService.update_Admin_Password(loginVO);
           }
            else{
            	return "비밀번호가 일치하지 않습니다";}
    }
    
  //**>>>>>  회원관리   <<<<<**//
    @GetMapping(value={"/userManager"})
    public ModelAndView userManager(HttpServletRequest request,String sb,Integer init_page) {
        ModelAndView mav = new ModelAndView();
        
        if(!investmentService.checkSession(request,true)) {
        	mav.setViewName("redirect:/");
            return mav;
        }
        HttpSession session = request.getSession();
        LoginVO loginVO = (LoginVO)session.getAttribute("user");
        List<UserInfoVO> userInfoList = this.investmentService.selectUserInfoList();
        List<InvestmentCategoryVO> listInvestmentCategory = this.investmentService.getInvestmentCategoryList();
        int page = (init_page != null) ? init_page : 0;
        mav.addObject("page",page);
        mav.addObject("sb", sb);
        mav.addObject("listInvestmentCategory", listInvestmentCategory);
        mav.addObject("userInfoList", userInfoList);
        mav.addObject("loginVO", loginVO);
        mav.setViewName("views/userManager");
        return mav;
    }
  //**>>>>>   공지사항 수정   <<<<<**//
    @GetMapping(value={"/fundRequest"})
    public ModelAndView fundRequest(HttpServletRequest request,String sb) {
        ModelAndView mav = new ModelAndView();
        if(!investmentService.checkSession(request,true)) {
        	mav.setViewName("redirect:/");
            return mav;
        }
        HttpSession session = request.getSession();
        LoginVO loginVO = (LoginVO)session.getAttribute("user");
        List<WalletWithdrawalVO> requestFilList = this.investmentService.getRequestFilList();
        mav.addObject("sb", sb);
        mav.addObject("requestFilList", requestFilList);
        mav.addObject("loginVO", loginVO);
        mav.addObject("loading",true);
        mav.setViewName("views/fundRequest");
        
        return mav;
    }
  //**>>>>>  투자&배분 관리    <<<<<**//
    @GetMapping(value={"/main"})
    public ModelAndView main(HttpServletRequest request, String category,String sb) {
        ModelAndView mav = new ModelAndView();
        
        if(!investmentService.checkSession(request,true)) {
        	mav.setViewName("redirect:/");
            return mav;
        }
        HttpSession session = request.getSession();
        LoginVO loginVO = (LoginVO)session.getAttribute("user");
        List<InvestmentCategoryVO> listInvestmentCategory = this.investmentService.getInvestmentCategoryList();
        List<InvestmentVO> listInvestment = category == null || category.equals("0") ? this.investmentService.getInvestmentList() : this.investmentService.getInvestmentListByCategory(Integer.parseInt(category));
        mav.addObject("sb", sb);
        mav.addObject("listInvestment", listInvestment);
        mav.addObject("listInvestmentCategory", listInvestmentCategory);
        mav.addObject("loginVO", loginVO);
        mav.setViewName("views/investmentManager");
        return mav;
    }
    //**>>>>>   투자&배분 내역 관리   <<<<<**//
    @GetMapping(value={"/payoutManager"})
    public ModelAndView payoutManager(HttpServletRequest request, String category,String sb) {
        ModelAndView mav = new ModelAndView();
        if(!investmentService.checkSession(request,true)) {
        	mav.setViewName("redirect:/");
            return mav;
        }
        HttpSession session = request.getSession();
        LoginVO loginVO = (LoginVO)session.getAttribute("user");
        
        List<TokenPaidVO> tokenPaidVOList = investmentService.selectTokenPaidVOList();
        
        
        mav.addObject("sb", sb);
        mav.addObject("tokenPaidVOList", tokenPaidVOList);
        mav.addObject("loginVO", loginVO);
        mav.setViewName("views/payoutManager");
        return mav;
    }
  //**>>>>>   이벤트   <<<<<**//
    @GetMapping(value={"/events"})
    public ModelAndView events(HttpServletRequest request,String sb) {
        ModelAndView mav = new ModelAndView();
        HttpSession session = request.getSession();
        if(!investmentService.checkSession(request,true)) {
        	mav.setViewName("redirect:/");
            return mav;
        }
        LoginVO loginVO = (LoginVO)session.getAttribute("user");
        List<EventsAnnouncementVO> eventList = investmentService.selectEvents();
        mav.addObject("eventList", eventList);
        mav.addObject("sb", sb);
        mav.addObject("loginVO", loginVO);
        mav.setViewName("views/events");
        return mav;
    }
  //**>>>>>   공지사항   <<<<<**//
   @GetMapping(value={"/announcements"})
    public ModelAndView announcements(HttpServletRequest request,String sb) {
        ModelAndView mav = new ModelAndView();
        HttpSession session = request.getSession();
        if(!investmentService.checkSession(request,true)) {
        	mav.setViewName("redirect:/");
            return mav;
        }
        LoginVO loginVO = (LoginVO)session.getAttribute("user");
        List<EventsAnnouncementVO> announcementList = investmentService.selectAnnouncements();
        mav.addObject("announcementList", announcementList);
        mav.addObject("sb", sb);
        mav.addObject("loginVO", loginVO);
        mav.setViewName("views/announcements");
        return mav;
    }
    
    
    
    
   
}

