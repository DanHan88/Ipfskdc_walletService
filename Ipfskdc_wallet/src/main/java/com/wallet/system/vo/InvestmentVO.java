/*
 * Decompiled with CFR 0.151.
 * 
 * Could not load the following classes:
 *  org.springframework.stereotype.Repository
 */
package com.wallet.system.vo;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.SimpleDateFormat;
import java.util.Date;
import org.springframework.stereotype.Repository;

@Repository(value="investmentVO")
public class InvestmentVO {
    private int investment_id;
    private String user_email;
    private String user_name;
    private String product_name;
    private int user_id;
    private int investment_category_id;
    private Date purchase_date;
    private int purchase_size;
    private BigDecimal payout_fil;
    private BigDecimal fil_paid_per_tb;
    private boolean is_getting_paid;
	private int cateogry_fil_per_tb;
	private BigDecimal fil_invested;
	
	
    
	public BigDecimal getFil_invested() {
		 if (fil_invested != null) {
			 return fil_invested.setScale(10, RoundingMode.HALF_UP).stripTrailingZeros();
	           }
		return new BigDecimal("0").stripTrailingZeros();
	}

	public void setFil_invested(BigDecimal fil_invested) {
		if (fil_invested != null) {
			this.fil_invested = fil_invested.setScale(10, RoundingMode.HALF_UP).stripTrailingZeros();
	           }
		this.fil_invested = fil_invested;
	}

	public int getCateogry_fil_per_tb() {
		return cateogry_fil_per_tb;
	}

	public void setCateogry_fil_per_tb(int cateogry_fil_per_tb) {
		this.cateogry_fil_per_tb = cateogry_fil_per_tb;
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

	public BigDecimal getPayout_fil() {
		 if (payout_fil != null) {
			 return payout_fil.setScale(10, RoundingMode.HALF_UP).stripTrailingZeros();
	           }
		return new BigDecimal("0").stripTrailingZeros();
	}

	public void setPayout_fil(BigDecimal payout_fil) {
		if (payout_fil != null) {
			this.payout_fil = payout_fil.setScale(10, RoundingMode.HALF_UP).stripTrailingZeros();
	           }
		this.payout_fil = payout_fil;
	}

	public boolean isIs_getting_paid() {
		return is_getting_paid;
	}

	public void setIs_getting_paid(boolean is_getting_paid) {
		this.is_getting_paid = is_getting_paid;
	}

	public int getInvestment_category_id() {
		return investment_category_id;
	}

	public void setInvestment_category_id(int investment_category_id) {
		this.investment_category_id = investment_category_id;
	}

	public int getUser_id() {
		return user_id;
	}

	public void setUser_id(int user_id) {
		this.user_id = user_id;
	}

	public String getUser_email() {
        return this.user_email;
    }

    public void setUser_email(String user_email) {
        this.user_email = user_email;
    }

    public String getUser_name() {
        return this.user_name;
    }

    public void setUser_name(String user_name) {
        this.user_name = user_name;
    }

    public String getProduct_name() {
        return this.product_name;
    }

    public void setProduct_name(String product_name) {
        this.product_name = product_name;
    }

    public Date getPurchase_date() {
        return this.purchase_date;
    }

    public void setPurchase_date(Date purchase_date) {
        this.purchase_date = purchase_date;
    }

    public int getPurchase_size() {
        return this.purchase_size;
    }

    public void setPurchase_size(int purchae_size) {
        this.purchase_size = purchae_size;
    }

    public int getInvestment_id() {
        return this.investment_id;
    }

    public void setInvestment_id(int investment_id) {
        this.investment_id = investment_id;
    }
    
    public String memoCreate(String title) {
    	Date date;
    	if(purchase_date==null) {
    		 date = new Date();
    	}else {
    		date = purchase_date;
    	}
    	SimpleDateFormat simpleDateFormat =new SimpleDateFormat("yyyy.MM.dd a HH:mm:ss"); 
    	String memo = "Title:" + title + ",date:" +simpleDateFormat.format(date)+",type:tib,amount:"+purchase_size+",status:active";
    	return memo;
    }
    
}

