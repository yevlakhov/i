package org.wf.dp.dniprorada.model;

import javax.mail.internet.MimeMultipart;

public class MessageModel {

    private String body;
    private String subject;
    private String recipient;
    private MimeMultipart attachments;

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getRecipient() {
        return recipient;
    }

    public void setRecipient(String recipient) {
        this.recipient = recipient;
    }

    public MimeMultipart getAttachments() {
        return attachments;
    }

    public void setAttachments(MimeMultipart attachments) {
        this.attachments = attachments;
    }
}
