package org.wf.dp.dniprorada.util;

import org.apache.commons.mail.EmailException;
import org.apache.commons.mail.MultiPartEmail;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.wf.dp.dniprorada.resources.MailDataResource;

import javax.activation.DataSource;
import javax.mail.BodyPart;
import javax.mail.MessagingException;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMultipart;
import java.util.List;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * @author Belyavtsev Vladimir Vladimirovich (BW)
 */
@Component("mailOld")
public class MailOld extends Abstract_Mail {

    private final static Logger log = LoggerFactory.getLogger(Mail.class);

    private MultiPartEmail oMultiPartEmail = null;

    @Autowired
    private MailDataResource mailDataResource;

    public MailOld() {
    }

    public void init() throws EmailException {

        String hostname = mailDataResource.getHostname();
        String sender = mailDataResource.getSender();

        log.info("init");
        oMultiPartEmail = new MultiPartEmail();
        oMultiPartEmail.setHostName(hostname);
        log.info("getHost()=" + hostname);
        oMultiPartEmail.addTo(getTo(), "receiver");
        log.info("getTo()=" + getTo());
        oMultiPartEmail.setFrom(sender, sender);//"iGov"
        log.info("getFrom()=" + sender);
        oMultiPartEmail.setSubject(getHead());
        log.info("getHead()=" + getHead());
    }

    public MailOld _BodyAsText() throws EmailException {
        //        init();
        log.info("_BodyAsText");
        oMultiPartEmail.setMsg(getBody());
        //oMultiPartEmail.setContent(sBody, "text/html; charset=\"utf-8\"");
        log.info("getBody()=" + getBody());
        return this;
    }

    public MailOld _BodyAsHTML() throws EmailException {
        //        init();
        log.info("_BodyAsHTML");
        //oMultiPartEmail.setMsg(sBody);
        oMultiPartEmail.setContent(getBody(), "text/html");
        oMultiPartEmail.setCharset("UTF-8");
        log.info("getBody()=" + getBody());
        return this;
    }

    public MailOld _PartHTML() throws MessagingException, EmailException {
        //        init();
        log.info("_PartHTML");
        //oMultiPartEmail.setMsg("0");
        MimeMultipart oMimeMultipart = new MimeMultipart("related");
        BodyPart oBodyPart = new MimeBodyPart();
        oBodyPart.setContent(getBody(), "text/html; charset=\"utf-8\"");
        oMimeMultipart.addBodyPart(oBodyPart);
        oMultiPartEmail.setContent(oMimeMultipart);
        log.info("getBody()=" + getBody());
        return this;
    }

    public MailOld _Part(DataSource oDataSource) throws MessagingException, EmailException {
        //        init();
        log.info("_Part");
        MimeMultipart oMimeMultipart = new MimeMultipart("related");
        BodyPart oBodyPart = new MimeBodyPart();
        oBodyPart.setContent(oDataSource, "application/zip");
        oMimeMultipart.addBodyPart(oBodyPart);
        return this;
    }

    public MailOld _Attach(DataSource oDataSource, String sName, String sNote)
            throws MessagingException, EmailException {
        //        init();
        log.info("1)oMultiPartEmail.isBoolHasAttachments()=" + oMultiPartEmail.isBoolHasAttachments());
        // add the attachment
        oMultiPartEmail.attach(oDataSource, sName, sNote);
        log.info("2)oMultiPartEmail.isBoolHasAttachments()=" + oMultiPartEmail.isBoolHasAttachments());
        oMultiPartEmail.setBoolHasAttachments(true);
        log.info("3)oMultiPartEmail.isBoolHasAttachments()=" + oMultiPartEmail.isBoolHasAttachments());
        return this;
    }

    private MailOld _Parts(List<DataSource> aDataSource) throws MessagingException {
        return this;
    }

    @Override
    public void send() throws EmailException {
        String username = mailDataResource.getUsername();
        String password = mailDataResource.getPassword();
        Integer port = mailDataResource.getPort();
        boolean isSSLEnable = mailDataResource.isSSLEnable();
        boolean isTLSEnable = mailDataResource.isTLSEnable();

        oMultiPartEmail.setAuthentication(username, password);
        log.info("getAuthUser()=" + username);
        log.info("getAuthPassword()=" + password);
        oMultiPartEmail.setSmtpPort(port);
        log.info("getPort()=" + port);
        oMultiPartEmail.setSSL(isSSLEnable);
        log.info("isSSL()=" + isSSLEnable);
        oMultiPartEmail.setTLS(isTLSEnable);
        log.info("isTLS()=" + isTLSEnable);

        oMultiPartEmail.sendMimeMessage();
        log.info("sendMimeMessage!");
    }
}
