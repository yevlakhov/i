package org.wf.dp.dniprorada.resources;

import org.springframework.beans.factory.annotation.Value;

import javax.annotation.Resource;

@Resource
public class MailResources {

    @Value("${mailServerDefaultFrom}")
    private String sFrom; //"noreplay@gmail.com";
    @Value("${mailAddressNoreply}")
    private String saTo; //"noreplay@gmail.com";
    private String sHead = "Subject";
    private String sBody = "Text";
    @Value("${mailServerUsername}")
    private String sAuthUser; //"user";
    @Value("${mailServerPassword}")
    private String sAuthPassword; //"password";
    @Value("${mailServerHost}")
    private String sHost; //"gmail.com";
    @Value("${mailServerPort}")
    private Integer nPort = 465; //Integer.valueOf(mailServerPort);
    @Value("${mailServerUseSSL}")
    private boolean bSSL;
    @Value("${mailServerUseTLS}")
    private boolean bTLS;

    public String getFrom() {
        return sFrom;
    }

    public void setFrom(String sFrom) {
        this.sFrom = sFrom;
    }

    public String getSaTo() {
        return saTo;
    }

    public void setSaTo(String saTo) {
        this.saTo = saTo;
    }

    public String getHead() {
        return sHead;
    }

    public void setHead(String sHead) {
        this.sHead = sHead;
    }

    public String getBody() {
        return sBody;
    }

    public void setBody(String sBody) {
        this.sBody = sBody;
    }

    public String getAuthUser() {
        return sAuthUser;
    }

    public void setAuthUser(String sAuthUser) {
        this.sAuthUser = sAuthUser;
    }

    public String getAuthPassword() {
        return sAuthPassword;
    }

    public void setAuthPassword(String sAuthPassword) {
        this.sAuthPassword = sAuthPassword;
    }

    public String getHost() {
        return sHost;
    }

    public void setHost(String sHost) {
        this.sHost = sHost;
    }

    public Integer getPort() {
        return nPort;
    }

    public void setPort(Integer nPort) {
        this.nPort = nPort;
    }

    public boolean isSSL() {
        return bSSL;
    }

    public void setSSL(boolean bSSL) {
        this.bSSL = bSSL;
    }

    public boolean isTLS() {
        return bTLS;
    }

    public void setTLS(boolean bTLS) {
        this.bTLS = bTLS;
    }
}
