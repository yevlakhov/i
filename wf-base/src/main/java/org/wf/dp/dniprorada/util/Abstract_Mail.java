package org.wf.dp.dniprorada.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.wf.dp.dniprorada.resources.MailDataResource;

/**
 * @author Belyavtsev Vladimir Vladimirovich (BW)
 */
public abstract class Abstract_Mail {

    private static final String DEFAULT_HEADER_VALUE = "Subject";
    private static final String DEFAULT_BODY_VALUE = "Text";

    @Autowired
    private MailDataResource mailDataResource;

    private String header;
    private String body;

    public Abstract_Mail() {
        header = DEFAULT_HEADER_VALUE;
        body = DEFAULT_BODY_VALUE;
    }

    public String getFrom() {
        return mailDataResource.getSender();
    }

    public Abstract_Mail _From(String sFrom) {
        mailDataResource.setSender(sFrom);
        return this;
    }

    public String getTo() {
        return mailDataResource.getRecipient();
    }

    public Abstract_Mail _To(String saTo) {
        mailDataResource.setRecipient(saTo);
        return this;
    }

    public String getHead() {
        return header;
    }

    public Abstract_Mail _Head(String sHead) {
        this.header = sHead;
        return this;
    }

    public String getBody() {
        return body;
    }

    public Abstract_Mail _Body(String sBody) {
        this.body = sBody;
        return this;
    }

    public String getAuthUser() {
        return mailDataResource.getUsername();
    }

    public Abstract_Mail _AuthUser(String sAuthUser) {
        mailDataResource.setUsername(sAuthUser);
        return this;
    }

    public String getAuthPassword() {
        return mailDataResource.getPassword();
    }

    public Abstract_Mail _AuthPassword(String sAuthPassword) {
        mailDataResource.setPassword(sAuthPassword);
        return this;
    }

    public String getHost() {
        return mailDataResource.getHostname();
    }

    public Abstract_Mail _Host(String sHost) {
        mailDataResource.setHostname(sHost);
        return this;
    }

    public Integer getPort() {
        return mailDataResource.getPort();
    }

    public Abstract_Mail _Port(Integer nPort) {
        mailDataResource.setPort(nPort);
        return this;
    }

    public boolean isSSL() {
        return mailDataResource.isSSL();
    }

    public Abstract_Mail _SSL(boolean bSSL) {
        mailDataResource.setSSL(bSSL);
        return this;
    }

    public boolean isTLS() {
        return mailDataResource.isTLS();
    }

    public Abstract_Mail _TLS(boolean bTLS) {
        mailDataResource.setTLS(bTLS);
        return this;
    }

    abstract public void send() throws Exception;
}
