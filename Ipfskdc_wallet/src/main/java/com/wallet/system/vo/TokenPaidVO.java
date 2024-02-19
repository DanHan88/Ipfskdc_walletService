package com.wallet.system.vo;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Repository;

@Repository(value="TokenPaidVO")
public class TokenPaidVO {

	private double token_paid_id;
	private Date paid_date;
	private BigDecimal fil_paid_per_tb;
	private String admin_id;
	private String status;
	private Date update_date;
	private BigDecimal fil_paid_ratio_change;
	private BigDecimal total_paid;
	private int unique_category_count;
	private String payout_category_name;
	
	public int getUnique_category_count() {
		return unique_category_count;
	}
	public void setUnique_category_count(int unique_category_count) {
		this.unique_category_count = unique_category_count;
	}
	public String getPayout_category_name() {
		return payout_category_name;
	}
	public void setPayout_category_name(String payout_category_name) {
		this.payout_category_name = payout_category_name;
	}
	public BigDecimal getFil_paid_ratio_change() {
		if (fil_paid_ratio_change != null) {
			 return fil_paid_ratio_change.setScale(10, RoundingMode.HALF_UP).stripTrailingZeros();
	           }
		return new BigDecimal("0").stripTrailingZeros();
	}
	public void setFil_paid_ratio_change(BigDecimal fil_paid_ratio_change) {
		if (fil_paid_ratio_change != null) {
			this.fil_paid_ratio_change = fil_paid_ratio_change.setScale(10, RoundingMode.HALF_UP).stripTrailingZeros();
	           }
		this.fil_paid_ratio_change = fil_paid_ratio_change;
	}
	public BigDecimal getTotal_paid() {
		if (total_paid != null) {
			 return total_paid.setScale(10, RoundingMode.HALF_UP).stripTrailingZeros();
	           }
		return new BigDecimal("0").stripTrailingZeros();
	}
	public void setTotal_paid(BigDecimal total_paid) {
		if (total_paid != null) {
			this.total_paid = total_paid.setScale(10, RoundingMode.HALF_UP).stripTrailingZeros();
	           }
		this.total_paid = total_paid;
	}
	private List<TokenPaidDetailVO> tokenPaidDetailVOList;
	
	public List<TokenPaidDetailVO> getTokenPaidDetailVOList() {
		return tokenPaidDetailVOList;
	}
	public void setTokenPaidDetailVOList(List<TokenPaidDetailVO> tokenPaidDetailVOList) {
		this.tokenPaidDetailVOList = tokenPaidDetailVOList;
	}
	public Date getUpdate_date() {
		return update_date;
	}
	public void setUpdate_date(Date update_date) {
		this.update_date = update_date;
	}
	public double getToken_paid_id() {
		return token_paid_id;
	}
	public void setToken_paid_id(double token_paid_id) {
		this.token_paid_id = token_paid_id;
	}
	public Date getPaid_date() {
		return paid_date;
	}
	public void setPaid_date(Date paid_date) {
		this.paid_date = paid_date;
	}
	public BigDecimal getFil_paid_per_tb() {
		if (fil_paid_per_tb != null) {
			 return fil_paid_per_tb.setScale(10, RoundingMode.HALF_UP).stripTrailingZeros();
	           }
		return new BigDecimal("0").stripTrailingZeros();
	}
	public void setFil_paid_per_tb(BigDecimal fil_paid_per_tb) {
		if (fil_paid_per_tb != null) {
			this.fil_paid_per_tb = fil_paid_per_tb.setScale(10, RoundingMode.HALF_UP).stripTrailingZeros();
	           }
		this.fil_paid_per_tb = fil_paid_per_tb;
	}
	public String getAdmin_id() {
		return admin_id;
	}
	public void setAdmin_id(String admin_id) {
		this.admin_id = admin_id;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
}
