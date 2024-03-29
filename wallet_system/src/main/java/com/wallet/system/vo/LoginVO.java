/*
 * Decompiled with CFR 0.151.
 * 
 * Could not load the following classes:
 *  org.springframework.beans.factory.annotation.Autowired
 *  org.springframework.security.crypto.password.PasswordEncoder
 *  org.springframework.stereotype.Repository
 */
package com.wallet.system.vo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Repository;

@Repository(value="loginVO")
public class LoginVO {
    

	@Autowired
    private PasswordEncoder pwEncoder;
    private String id;
    private String password;
    private UserInfoVO userInfoVO;
    private boolean isAdmin;
    private String new_password;
    
    
    
  

	public boolean isAdmin() {
		return isAdmin;
	}

	public void setAdmin(boolean isAdmin) {
		this.isAdmin = isAdmin;
	}

	public UserInfoVO getUserInfoVO() {
		return userInfoVO;
	}

	public void setUserInfoVO(UserInfoVO userInfoVO) {
		this.userInfoVO = userInfoVO;
	}

	public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
    public String getNew_password() {
		return new_password;
	}

	public void setNew_password(String new_password) {
		this.new_password = new_password;
	}
}

