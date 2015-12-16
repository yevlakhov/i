package org.wf.dp.dniprorada.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.wf.dp.dniprorada.converters.Converter;
import org.wf.dp.dniprorada.model.MessageModel;
import org.wf.dp.dniprorada.populators.Populator;
import org.wf.dp.dniprorada.resources.MailResources;
import org.wf.dp.dniprorada.service.MailService;

import javax.activation.DataSource;
import javax.mail.BodyPart;

@Component("mailService")
public class DefaultMailService implements MailService {

    private static final Logger LOG = LoggerFactory.getLogger(DefaultMailService.class);

    @Autowired
    private MailResources mailResources;
    @Autowired
    private Populator<MessageModel, MailResources> populator;

    @Override
    public void sendWithUniSender(MessageModel messageModel) {
        populateMessageModel(messageModel);
    }

    @Override
    public void sendWithMailClient(MessageModel messageModel) {
        populateMessageModel(messageModel);

    }

    private void populateMessageModel(MessageModel messageModel) {
        populator.populate(messageModel, mailResources);
        printMessageModelInformation(messageModel);
    }

    private void printMessageModelInformation(MessageModel messageModel) {
        LOG.info("oMail.getHead()=" + messageModel.getSubject());
        LOG.info("oMail.getBody()=" + messageModel.getBody());
        LOG.info("oMail.getAuthUser()=" + messageModel.getAuthUser());
        LOG.info("oMail.getAuthPassword()=" + messageModel.getAuthPassword());
        LOG.info("oMail.getFrom()=" + messageModel.getSender());
        LOG.info("oMail.getTo()=" + messageModel.getRecipient());
        LOG.info("oMail.getHost()=" + messageModel.getHost());
        LOG.info("oMail.getPort()=" + messageModel.getPort());
    }
}
