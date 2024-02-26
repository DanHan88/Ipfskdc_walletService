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

@Repository(value="WalletWithdrawalVO")
public class WalletWithdrawalVO {
	
	private int user_id;
	private BigDecimal fil_amount;
	private String status;
	private String message;
	private String wallet_address;
	private Date request_date;
	private Date complete_date;
	private long wallet_withdrawals_id;
	private String user_name;
	private String user_email;
	private String memo;
	private String is_request_state;
	private String encrypted_wallet;
	private String wallet_type_name;
	
	public String getWallet_type_name() {
		return wallet_type_name;
	}
	public void setWallet_type_name(String wallet_type_name) {
		this.wallet_type_name = wallet_type_name;
	}
	public String getEncrypted_wallet() {
		return encrypted_wallet;
	}
	public void setEncrypted_wallet(String encrypted_wallet) {
		this.encrypted_wallet = encrypted_wallet;
	}
	
	
	public String getMemo() {
		return memo;
	}
	public void setMemo(String memo) {
		this.memo = memo;
	}
	public String getIs_request_state() {
		return is_request_state;
	}
	public void setIs_request_state(String is_request_state) {
		this.is_request_state = is_request_state;
	}
	public String getUser_name() {
		return user_name;
	}
	public void setUser_name(String user_name) {
		this.user_name = user_name;
	}
	public String getUser_email() {
		return user_email;
	}
	public void setUser_email(String user_email) {
		this.user_email = user_email;
	}
	public int getUser_id() {
		return user_id;
	}
	public void setUser_id(int user_id) {
		this.user_id = user_id;
	}
	public BigDecimal getFil_amount() {
		
		if (fil_amount != null) {
            return fil_amount.setScale(10, RoundingMode.HALF_UP).stripTrailingZeros();
        } 
		return new BigDecimal("0").stripTrailingZeros();
	}
	public void setFil_amount(BigDecimal fil_amount) {
		if (fil_amount != null) {
			this.fil_amount = fil_amount.setScale(10, RoundingMode.HALF_UP).stripTrailingZeros();
        } 
		this.fil_amount= fil_amount;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public String getWallet_address() {
		return wallet_address;
	}
	public void setWallet_address(String wallet_address) {
		this.wallet_address = wallet_address;
	}
	public Date getRequest_date() {
		return request_date;
	}
	public void setRequest_date(Date request_date) {
		this.request_date = request_date;
	}
	public Date getComplete_date() {
		return complete_date;
	}
	public void setComplete_date(Date complete_date) {
		this.complete_date = complete_date;
	}
	public long getWallet_withdrawals_id() {
		return wallet_withdrawals_id;
	}
	public void setWallet_withdrawals_id(long wallet_withdrawals_id) {
		this.wallet_withdrawals_id = wallet_withdrawals_id;
	}
}

