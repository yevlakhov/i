package org.wf.dp.dniprorada.model.builders;

import org.wf.dp.dniprorada.model.MailModel;

import javax.mail.internet.MimeMultipart;
import java.util.ArrayList;
import java.util.List;

public class MailModelBuilder {

    private MailModel mailModel;

    private MailModelBuilder() {
        mailModel = new MailModel();
    }

    public MailModel build() {
        return mailModel;
    }

    public static MailModelBuilder newInstance() {
        return new MailModelBuilder();
    }

    public MailModelBuilder addAttachment(MimeMultipart attachment) {
        if (attachment != null) {
            List<MimeMultipart> multiparts = mailModel.getMultiparts();
            if (multiparts == null) {
                multiparts = new ArrayList<>();
                mailModel.setMultiparts(multiparts);
            }
            multiparts.add(attachment);
        }
        return this;
    }
}
