package org.wf.dp.dniprorada.resources;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class MailDataResource {

    private static final int DEFAULT_EMAIL_PORT = 465;

    @Value("${mailServerDefaultFrom}")
    private String sender;
    @Value("${mailServerUsername}")
    private String username;
    @Value("${mailServerPassword}")
    private String password;
    @Value("${mailServerHost}")
    private String hostname;
    @Value("${mailServerPort}")
    private Integer port;
    @Value("${mailServerUseSSL}")
    private boolean isSSLEnable;
    @Value("${mailServerUseTLS}")
    private boolean isTLSEnable;

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getHostname() {
        return hostname;
    }

    public void setHostname(String hostname) {
        this.hostname = hostname;
    }

    public Integer getPort() {
        return port == null ? DEFAULT_EMAIL_PORT : port;
    }

    public void setPort(Integer port) {
        this.port = port;
    }

    public boolean isSSLEnable() {
        return isSSLEnable;
    }

    public void setSSLEnable(boolean isSSL) {
        this.isSSLEnable = isSSL;
    }

    public boolean isTLSEnable() {
        return isTLSEnable;
    }

    public void setTLSEnable(boolean isTLS) {
        this.isTLSEnable = isTLS;
    }
}
