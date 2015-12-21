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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        MessageModel that = (MessageModel) o;

        if (body != null ? !body.equals(that.body) : that.body != null) return false;
        if (subject != null ? !subject.equals(that.subject) : that.subject != null) return false;
        if (recipient != null ? !recipient.equals(that.recipient) : that.recipient != null) return false;
        return attachments != null ? attachments.equals(that.attachments) : that.attachments == null;

    }

    @Override
    public int hashCode() {
        int result = body != null ? body.hashCode() : 0;
        result = 31 * result + (subject != null ? subject.hashCode() : 0);
        result = 31 * result + (recipient != null ? recipient.hashCode() : 0);
        result = 31 * result + (attachments != null ? attachments.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "MessageModel{" +
                "body='" + body + '\'' +
                ", subject='" + subject + '\'' +
                ", recipient='" + recipient + '\'' +
                ", attachments=" + attachments +
                '}';
    }
}
