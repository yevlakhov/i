package org.wf.dp.dniprorada.service;

import org.wf.dp.dniprorada.model.MessageModel;

public interface MailService {

    void sendWithUniSender(MessageModel messageModel);

    void sendWithMailClient(MessageModel messageModel);
}
