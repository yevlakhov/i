package org.wf.dp.dniprorada.services.impl;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.mail.EmailException;
import org.apache.commons.mail.MultiPartEmail;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.wf.dp.dniprorada.model.MessageModel;
import org.wf.dp.dniprorada.model.builders.MimeMultipartBuilder;
import org.wf.dp.dniprorada.resources.MailDataResource;
import org.wf.dp.dniprorada.services.MailService;
import org.wf.dp.dniprorada.util.GeneralConfig;
import org.wf.dp.dniprorada.util.unisender.UniResponse;
import org.wf.dp.dniprorada.util.unisender.UniSender;
import org.wf.dp.dniprorada.util.unisender.requests.CreateCampaignRequest;
import org.wf.dp.dniprorada.util.unisender.requests.CreateEmailMessageRequest;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.io.IOException;
import java.io.InputStream;
import java.util.Collections;
import java.util.Map;

/**
 * @author Belyavtsev Vladimir Vladimirovich (BW)
 */
@Service("mail")
public class DefaultMailService implements MailService {

    private final static Logger LOG = LoggerFactory.getLogger(DefaultMailService.class);

    private static final String UNISENDER_ENABLE_MODE_VALUE = "true";
    private static final String DEFAULT_ENCODING = "UTF-8";
    private static final String RECEIVER = "receiver";
    private static final String RECIPIENT = "recipient";

    @Autowired
    private MailDataResource mailDataResource;
    @Autowired
    private GeneralConfig generalConfig;

    public DefaultMailService() {}

    public void setMailDataResource(MailDataResource mailDataResource) {
        this.mailDataResource = mailDataResource;
    }

    public MailDataResource getMailDataResource() {
        return mailDataResource;
    }

    @Override
    public void send(MessageModel message) throws EmailException {
        if(isUniSenderModeEnable()){
            sendWithUniSender(message);
        } else {
            sendWithJavaMail(message);
        }
    }

    private boolean isUniSenderModeEnable() {
        return UNISENDER_ENABLE_MODE_VALUE.equals(generalConfig.getUseUniSender());
    }

    public void sendWithJavaMail(MessageModel model) throws EmailException {
        LOG.info("Send message with standard 'Java' mail client ...");
        try {
            MultiPartEmail multiPartEmail = createMultiPartEmailInstance(model);
            printMailDataAndMessageModelParameters(model);
            if(isMultiPartEmailAuthenticationEnable()) {
                enableMultiPartEmailAuthentication(multiPartEmail);
                LOG.info("Multipart email sender work with authentication");
            }else{
                LOG.info("Multipart email sender work without authentication");
            }
            Transport.send(createMimeMessageInstance(multiPartEmail, model));
            LOG.info("[send]:Transport.send!");
        } catch (Exception exc) {
            LOG.error("[send]", exc);
            throw new EmailException("Error happened when sending email", exc);
        }
    }

    private MimeMessage createMimeMessageInstance(MultiPartEmail multiPartEmail, MessageModel model) throws Exception {
        Session session = multiPartEmail.getMailSession();
        MimeMessage mimeMessage = new MimeMessage(session);
        mimeMessage.setFrom(createSenderInternetAddress());
        mimeMessage.setSubject(model.getSubject(), DEFAULT_ENCODING);
        mimeMessage.addRecipient(Message.RecipientType.TO,createRecipientInternetAddress(model));
        mimeMessage.setContent(MimeMultipartBuilder.newInstance().withBody(model.getBody()).build());
        return mimeMessage;
    }

    private Address createRecipientInternetAddress(MessageModel model) throws Exception {
        return new InternetAddress(clearRecipientFormat(model.getRecipient()), RECIPIENT, DEFAULT_ENCODING);
    }

    private InternetAddress createSenderInternetAddress() throws Exception {
        return new InternetAddress(mailDataResource.getSender(), mailDataResource.getSender());
    }

    private void enableMultiPartEmailAuthentication(MultiPartEmail multiPartEmail) {
        String username = mailDataResource.getUsername();
        String password = mailDataResource.getPassword();
        multiPartEmail.setAuthentication(username, password);
    }

    private boolean isMultiPartEmailAuthenticationEnable() {
        return StringUtils.isNotBlank(mailDataResource.getUsername());
    }

    private void printMailDataAndMessageModelParameters(MessageModel model) {
        LOG.info("init");
        LOG.info("getHost()=" + mailDataResource.getHostname());
        LOG.info("getTo()=" + clearRecipientFormat(model.getRecipient()));
        LOG.info("getFrom()=" + mailDataResource.getSender());
        LOG.info("getHead()=" + model.getSubject());
        LOG.info("getAuthUser()=" + mailDataResource.getUsername());
        LOG.info("getAuthPassword()=" + mailDataResource.getPassword());
        LOG.info("getPort()=" + mailDataResource.getPort());
        LOG.info("isSSL()=" + mailDataResource.isSSLEnable());
        LOG.info("isTLS()=" + mailDataResource.isTLSEnable());
    }

    private MultiPartEmail createMultiPartEmailInstance(MessageModel model) throws EmailException {
        MultiPartEmail multiPartEmail = new MultiPartEmail();
        multiPartEmail.setFrom(mailDataResource.getSender(), mailDataResource.getSender());
        multiPartEmail.setSubject(model.getSubject());
        multiPartEmail.addTo(clearRecipientFormat(model.getRecipient()), RECEIVER);
        multiPartEmail.setHostName(mailDataResource.getHostname());
        multiPartEmail.setSmtpPort(mailDataResource.getPort());
        multiPartEmail.setSSL(mailDataResource.isSSLEnable());
        multiPartEmail.setTLS(mailDataResource.isTLSEnable());
        return multiPartEmail;
    }

    private String clearRecipientFormat(String recipient) {
        recipient = recipient.replace("\"", "");
        return recipient.replace("\"", "");
    }

    public void sendWithUniSender(MessageModel messageModel) throws EmailException {

        String sKey_Sender = generalConfig.getsKey_Sender();
        long nID_Sender = generalConfig.getUniSenderListId();
        if (StringUtils.isBlank(sKey_Sender)) {
            throw new IllegalArgumentException("Please check api_key in UniSender property file configuration");
        }
        if (StringUtils.isBlank(sKey_Sender)) {
            throw new IllegalArgumentException("Please check api_key in UniSender property file configuration");
        }

        UniSender oUniSender = new UniSender(sKey_Sender, "en");
        UniResponse oUniResponse_Subscribe = oUniSender.subscribe(
                Collections.singletonList(String.valueOf(nID_Sender)),
                messageModel.getRecipient());

        LOG.info("oUniResponse_Subscribe: {}", oUniResponse_Subscribe);

        String sBody = messageModel.getBody();

        CreateEmailMessageRequest.Builder oBuilder = CreateEmailMessageRequest
                //.getBuilder(sKey_Sender, "en")
                .getBuilder(sKey_Sender, "ua")
                .setSenderName("no reply")
                .setSenderEmail(mailDataResource.getSender())
                .setSubject(messageModel.getSubject())
                .setBody(sBody)
                .setListId(String.valueOf(nID_Sender));

        try {
            int nAttachments = messageModel.getAttachments().getCount();
            for (int i = 0; i < nAttachments; i++) {
                BodyPart oBodyPart = messageModel.getAttachments().getBodyPart(i);
                String sFileName = oBodyPart.getFileName();
                InputStream oInputStream = oBodyPart.getInputStream();
                oBuilder.setAttachment(sFileName, oInputStream);
            }
        } catch (IOException e) {
            throw new EmailException("Error while getting attachment.");
        } catch (MessagingException e) {
            throw new EmailException("Error while getting attachment.");
        }

        CreateEmailMessageRequest oCreateEmailMessageRequest = oBuilder.build();

        UniResponse oUniResponse_CreateEmailMessage = oUniSender.createEmailMessage(oCreateEmailMessageRequest);
        LOG.info("oUniResponse_CreateEmailMessage: {}", oUniResponse_CreateEmailMessage);

        if (oUniResponse_CreateEmailMessage != null && oUniResponse_CreateEmailMessage.getResult() != null) {
            Map<String, Object> mParam = oUniResponse_CreateEmailMessage.getResult();
            LOG.info("RESULT: {}", mParam);
            Object oID_Message = mParam.get("message_id");
            if (oID_Message != null) {
                LOG.info("id: {}", oID_Message);
                CreateCampaignRequest oCreateCampaignRequest = CreateCampaignRequest.getBuilder(sKey_Sender, "en")
                        .setMessageId(oID_Message.toString())
                        .build();

                UniResponse oUniResponse_CreateCampaign = oUniSender.createCampaign(oCreateCampaignRequest, messageModel.getRecipient());
                LOG.info("oUniResponse_CreateCampaign: {}", oUniResponse_CreateCampaign);

            } else {
                throw new EmailException("error while email cration " + oUniResponse_CreateEmailMessage.getError());
            }
        }
    }
}
