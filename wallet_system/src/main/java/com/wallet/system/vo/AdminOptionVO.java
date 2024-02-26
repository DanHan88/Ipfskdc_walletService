package com.wallet.system.vo;

import java.util.Date;

import org.springframework.stereotype.Repository;

@Repository(value="AdminOptionVO")
public class AdminOptionVO {
	
	private int  admin_option_id;
	private boolean is_request_allowed;
	private int request_per_day;
	
	public int getRequest_per_day() {
		return request_per_day;
	}
	public void setRequest_per_day(int request_per_day) {
		this.request_per_day = request_per_day;
	}
	public int getAdmin_option_id() {
		return admin_option_id;
	}
	public void setAdmin_option_id(int admin_option_id) {
		this.admin_option_id = admin_option_id;
	}
	public boolean isIs_request_allowed() {
		return is_request_allowed;
	}
	public void setIs_request_allowed(boolean is_request_allowed) {
		this.is_request_allowed = is_request_allowed;
	}
	
	
	
	
}
