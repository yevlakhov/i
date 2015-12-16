package org.wf.dp.dniprorada.services;

import org.apache.commons.mail.EmailException;
import org.wf.dp.dniprorada.model.MessageModel;

public interface MailService {

    void send(MessageModel messageModel) throws EmailException;
}
