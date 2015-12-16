package org.wf.dp.dniprorada.model;

import javax.mail.internet.MimeMultipart;
import java.util.List;

public class MailModel {

    private List<MimeMultipart> multiparts;

    public List<MimeMultipart> getMultiparts() {
        return multiparts;
    }

    public void setMultiparts(List<MimeMultipart> multiparts) {
        this.multiparts = multiparts;
    }
}
