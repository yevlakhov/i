package org.wf.dp.dniprorada.model;

import org.apache.commons.lang3.StringUtils;

import javax.mail.BodyPart;

public class MessageModel {

    private String recipient;
    private String subject;
    private String sender;
    private String body;

    public String getRecipient() {
        return recipient;
    }

    public void setRecipient(String recipient) {
        this.recipient = recipient;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public static class Builder {

        private MessageModel messageModel;

        private Builder() {
            messageModel = new MessageModel();
        }

        public Builder withRecipient(String recipient) {
            messageModel.recipient = recipient;
            return this;
        }

        public Builder withSubject(String subject) {
            messageModel.subject = subject;
            return this;
        }

        public Builder withBody(String body) {
            messageModel.body = body;
            return this;
        }

        public void withAttache(BodyPart bodyPart) {
            throw new UnsupportedOperationException("Attachments");
        }

        public static Builder newInstance() {
            return new Builder();
        }

        public MessageModel build() {
            if (StringUtils.isBlank(messageModel.recipient)) {
                throw new NullPointerException("Recipient paramter of message model not specified");
            }
            return messageModel;
        }
    }
}
