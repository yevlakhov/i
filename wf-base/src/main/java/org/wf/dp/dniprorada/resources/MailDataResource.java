package org.wf.dp.dniprorada.resources;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class MailDataResource {

    private static final int DEFAULT_EMAIL_PORT = 465;

    @Value("${mailServerDefaultFrom}")
    private String sender;
    @Value("${mailAddressNoreply}")
    private String recipient;
    @Value("${mailServerUsername}")
    private String username;
    @Value("${mailServerPassword}")
    private String password;
    @Value("${mailServerHost}")
    private String hostname;
    @Value("${mailServerPort}")
    private Integer port;
    @Value("${mailServerUseSSL}")
    private boolean isSSL;
    @Value("${mailServerUseTLS}")
    private boolean isTLS;

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getRecipient() {
        return recipient;
    }

    public void setRecipient(String recipient) {
        this.recipient = recipient;
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

    public boolean isSSL() {
        return isSSL;
    }

    public void setSSL(boolean isSSL) {
        this.isSSL = isSSL;
    }

    public boolean isTLS() {
        return isTLS;
    }

    public void setTLS(boolean isTLS) {
        this.isTLS = isTLS;
    }
}
