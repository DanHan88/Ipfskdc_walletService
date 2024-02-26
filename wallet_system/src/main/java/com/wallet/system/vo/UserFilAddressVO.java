/*
 * Decompiled with CFR 0.151.
 * 
 * Could not load the following classes:
 *  org.springframework.stereotype.Repository
 */
package com.wallet.system.vo;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Date;
import org.springframework.stereotype.Repository;

@Repository(value="UserFillAddressVO")
public class UserFilAddressVO {
	
	private long address_id;
	private int user_id;
	private String fil_address;
	private String status;
	private Date reg_date;
	private String wallet_type_name;
	
	public String getWallet_type_name() {
		return wallet_type_name;
	}
	public void setWallet_type_name(String wallet_type_name) {
		this.wallet_type_name = wallet_type_name;
	}
	public long getAddress_id() {
		return address_id;
	}
	public void setAddress_id(long address_id) {
		this.address_id = address_id;
	}
	public int getUser_id() {
		return user_id;
	}
	public void setUser_id(int user_id) {
		this.user_id = user_id;
	}
	public String getFil_address() {
		return fil_address;
	}
	public void setFil_address(String fil_address) {
		this.fil_address = fil_address;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public Date getReg_date() {
		return reg_date;
	}
	public void setReg_date(Date reg_date) {
		this.reg_date = reg_date;
	}
}

