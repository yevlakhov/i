package org.wf.dp.dniprorada.model.builders;

import org.apache.commons.lang3.StringUtils;
import org.wf.dp.dniprorada.model.MessageModel;

import javax.mail.internet.MimeMultipart;

public class MessageModelBuilder {

    private static final String DEFAULT_SUBJECT_VALUE = "Subject";
    private static final String DEFAULT_BODY_VALUE = "Text";

    private MessageModel mailModel;

    private MessageModelBuilder() {
        mailModel = new MessageModel();
    }

    public MessageModel build() {
        if (StringUtils.isBlank(mailModel.getRecipient())) {
            throw new IllegalArgumentException("Mail recipient not specified");
        }
        return mailModel;
    }

    public static MessageModelBuilder newInstance() {
        return new MessageModelBuilder();
    }

    public MessageModelBuilder withBody(String body) {
        mailModel.setBody(StringUtils.isBlank(body) ? DEFAULT_BODY_VALUE : body);
        return this;
    }

    public MessageModelBuilder withSubject(String subject) {
        mailModel.setSubject(StringUtils.isBlank(subject) ? DEFAULT_SUBJECT_VALUE : subject);
        return this;
    }

    public MessageModelBuilder withRecipient(String recipient) {
        mailModel.setRecipient(recipient);
        return this;
    }

    public MessageModelBuilder withAttachments(MimeMultipart attachments) {
        mailModel.setAttachments(attachments);
        return this;
    }
}
