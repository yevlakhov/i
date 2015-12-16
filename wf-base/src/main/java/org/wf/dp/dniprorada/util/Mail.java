package org.wf.dp.dniprorada.util;

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
public class Mail implements MailService {

    private final static Logger log = LoggerFactory.getLogger(Mail.class);

    private static final String DEFAULT_ENCODING = "UTF-8";

    @Autowired
    private MailDataResource mailDataResource;
    @Autowired
    private GeneralConfig generalConfig;

    private Session oSession = null;

    public Mail() {}

    public void setMailDataResource(MailDataResource mailDataResource) {
        this.mailDataResource = mailDataResource;
    }

    public MailDataResource getMailDataResource() {
        return mailDataResource;
    }

    @Override
    public void send(MessageModel messageModel) throws EmailException {
        if("true".equals(generalConfig.getUseUniSender())){
            sendWithUniSender(messageModel);
        } else {
            sendOld(messageModel);
        }
    }

    public void sendOld(MessageModel messageModel) throws EmailException {

        try {
            String hostname = mailDataResource.getHostname();
            String sender = mailDataResource.getSender();
            String username = mailDataResource.getUsername();
            String password = mailDataResource.getPassword();
            Integer port = mailDataResource.getPort();
            boolean isSSLEnable = mailDataResource.isSSLEnable();
            boolean isTLSEnable = mailDataResource.isTLSEnable();

            log.info("init");
            MultiPartEmail oMultiPartEmail = new MultiPartEmail();
            oMultiPartEmail.setHostName(hostname);
            log.info("getHost()=" + hostname);
            log.info("getTo()=" + messageModel.getRecipient());
            String sTo = messageModel.getRecipient();
            sTo=sTo.replace("\"", "");
            sTo=sTo.replace("\"", "");
            //sTo=sTo.replaceAll("\"", "");
            oMultiPartEmail.addTo(sTo, "receiver");
            log.info("getTo()=" + sTo);
            //oMultiPartEmail.addTo(getTo(), "receiver");
            //log.info("getTo()=" + getTo());
            oMultiPartEmail.setFrom(sender, sender);//"iGov"
            log.info("getFrom()=" + sender);
            oMultiPartEmail.setSubject(messageModel.getSubject());
            log.info("getHead()=" + messageModel.getSubject());

            if(username != null && !"".equals(username.trim()) ){
                oMultiPartEmail.setAuthentication(username, password);
                log.info("withAuth");
            }else{
                log.info("withoutAuth");
            }
            //oMultiPartEmail.setAuthentication(getAuthUser(), getAuthPassword());
            log.info("getAuthUser()=" + username);
            log.info("getAuthPassword()=" + password);
            oMultiPartEmail.setSmtpPort(port);
            log.info("getPort()=" + port);
            oMultiPartEmail.setSSL(isSSLEnable);
            log.info("isSSL()=" + isSSLEnable);
            oMultiPartEmail.setTLS(isTLSEnable);
            log.info("isTLS()=" + isTLSEnable);

            oSession = oMultiPartEmail.getMailSession();
            MimeMessage oMimeMessage = new MimeMessage(oSession);

            oMimeMessage.setFrom(new InternetAddress(sender, sender));

            oMimeMessage.addRecipient(Message.RecipientType.TO,
                    new InternetAddress(sTo, "recipient", DEFAULT_ENCODING));

            oMimeMessage.setSubject(messageModel.getSubject(), DEFAULT_ENCODING);

            oMimeMessage.setContent(MimeMultipartBuilder.newInstance()._AttachBody(messageModel.getBody()).build());

            Transport.send(oMimeMessage);
            log.info("[send]:Transport.send!");
        } catch (Exception exc) {
            log.error("[send]", exc);
            throw new EmailException("Error happened when sending email", exc);
        }
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

        log.info("oUniResponse_Subscribe: {}", oUniResponse_Subscribe);

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
        log.info("oUniResponse_CreateEmailMessage: {}", oUniResponse_CreateEmailMessage);

        if (oUniResponse_CreateEmailMessage != null && oUniResponse_CreateEmailMessage.getResult() != null) {
            Map<String, Object> mParam = oUniResponse_CreateEmailMessage.getResult();
            log.info("RESULT: {}", mParam);
            Object oID_Message = mParam.get("message_id");
            if (oID_Message != null) {
                log.info("id: {}", oID_Message);
                CreateCampaignRequest oCreateCampaignRequest = CreateCampaignRequest.getBuilder(sKey_Sender, "en")
                        .setMessageId(oID_Message.toString())
                        .build();

                UniResponse oUniResponse_CreateCampaign = oUniSender.createCampaign(oCreateCampaignRequest, messageModel.getRecipient());
                log.info("oUniResponse_CreateCampaign: {}", oUniResponse_CreateCampaign);

            } else {
                throw new EmailException("error while email cration " + oUniResponse_CreateEmailMessage.getError());
            }
        }
    }
}
