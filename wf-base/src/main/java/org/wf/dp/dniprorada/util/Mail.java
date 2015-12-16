package org.wf.dp.dniprorada.util;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.mail.EmailException;
import org.apache.commons.mail.MultiPartEmail;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;
import org.wf.dp.dniprorada.model.builders.MimeMultipartBuilder;
import org.wf.dp.dniprorada.util.unisender.UniResponse;
import org.wf.dp.dniprorada.util.unisender.UniSender;
import org.wf.dp.dniprorada.util.unisender.requests.CreateCampaignRequest;
import org.wf.dp.dniprorada.util.unisender.requests.CreateEmailMessageRequest;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import java.io.IOException;
import java.io.InputStream;
import java.util.Collections;
import java.util.Map;

/**
 * @author Belyavtsev Vladimir Vladimirovich (BW)
 */
//@Scope(value = "prototype", proxyMode = ScopedProxyMode.TARGET_CLASS)
@Service("mail")
@Scope("prototype")
public class Mail extends Abstract_Mail {

    private final static Logger log = LoggerFactory.getLogger(Mail.class);

    private static final String DEFAULT_ENCODING = "UTF-8";

    @Autowired
    private GeneralConfig generalConfig;

    private Session oSession = null;

    private MimeMultipart attachments;

    public Mail() {}

    public void setAttachments(MimeMultipart attachments) {
        this.attachments = attachments;
    }

    public MimeMultipart getAttachments() {
        if (attachments == null) {
            attachments = MimeMultipartBuilder.newInstance().build();
        }
        return attachments;
    }

    @Override
    public void send() throws EmailException {
        if("true".equals(generalConfig.getUseUniSender())){
            sendWithUniSender();
        } else {
            sendOld();
        }
    }

    public void sendOld() throws EmailException {

        try {
            log.info("init");
            MultiPartEmail oMultiPartEmail = new MultiPartEmail();
            oMultiPartEmail.setHostName(getHost());
            log.info("getHost()=" + getHost());
            log.info("getTo()=" + getTo());
            String sTo=getTo();
            sTo=sTo.replace("\"", "");
            sTo=sTo.replace("\"", "");
            //sTo=sTo.replaceAll("\"", "");
            oMultiPartEmail.addTo(sTo, "receiver");
            log.info("getTo()=" + sTo);
            //oMultiPartEmail.addTo(getTo(), "receiver");
            //log.info("getTo()=" + getTo());
            oMultiPartEmail.setFrom(getFrom(), getFrom());//"iGov"
            log.info("getFrom()=" + getFrom());
            oMultiPartEmail.setSubject(getHead());
            log.info("getHead()=" + getHead());

            String sLogin=getAuthUser();
            if(sLogin!=null&&!"".equals(sLogin.trim()) ){
                oMultiPartEmail.setAuthentication(sLogin, getAuthPassword());
                log.info("withAuth");
            }else{
                log.info("withoutAuth");
            }
            //oMultiPartEmail.setAuthentication(getAuthUser(), getAuthPassword());
            log.info("getAuthUser()=" + getAuthUser());
            log.info("getAuthPassword()=" + getAuthPassword());
            oMultiPartEmail.setSmtpPort(getPort());
            log.info("getPort()=" + getPort());
            oMultiPartEmail.setSSL(isSSL());
            log.info("isSSL()=" + isSSL());
            oMultiPartEmail.setTLS(isTLS());
            log.info("isTLS()=" + isTLS());

            oSession = oMultiPartEmail.getMailSession();
            MimeMessage oMimeMessage = new MimeMessage(oSession);

            //oMimeMessage.setFrom(new InternetAddress(getFrom(), "iGov", DEFAULT_ENCODING));
            oMimeMessage.setFrom(new InternetAddress(getFrom(), getFrom()));
            //oMimeMessage.addRecipient(Message.RecipientType.CC, new InternetAddress(sTo, sToName, DEFAULT_ENCODING));
            oMimeMessage.addRecipient(Message.RecipientType.TO,
                    new InternetAddress(sTo, "recipient", DEFAULT_ENCODING));
                    //new InternetAddress(getTo(), "recipient", DEFAULT_ENCODING));

            oMimeMessage.setSubject(getHead(), DEFAULT_ENCODING);

            oMimeMessage.setContent(MimeMultipartBuilder.newInstance()._AttachBody(getBody()).build());

            //            oMimeMessage.getRecipients(Message.RecipientType.CC);
            Transport.send(oMimeMessage);
            log.info("[send]:Transport.send!");
        } catch (Exception exc) {
            log.error("[send]", exc);
            throw new EmailException("Error happened when sending email", exc);
        }
    }

    public void sendWithUniSender() throws EmailException{

        String sKey_Sender = generalConfig.getsKey_Sender();
        long nID_Sender = generalConfig.getUniSenderListId();
        if(StringUtils.isBlank(sKey_Sender)){
            throw new IllegalArgumentException("Please check api_key in UniSender property file configuration");
        }
        if(StringUtils.isBlank(sKey_Sender)){
            throw new IllegalArgumentException("Please check api_key in UniSender property file configuration");
        }

        UniSender oUniSender = new UniSender(sKey_Sender, "en");
        UniResponse oUniResponse_Subscribe = oUniSender.subscribe(Collections.singletonList(String.valueOf(nID_Sender)), getTo());

        log.info("oUniResponse_Subscribe: {}", oUniResponse_Subscribe);
        
        String sBody = getBody();
        
        CreateEmailMessageRequest.Builder oBuilder = CreateEmailMessageRequest
                //.getBuilder(sKey_Sender, "en")
                .getBuilder(sKey_Sender, "ua")
                .setSenderName("no reply")
                .setSenderEmail(getFrom())
                .setSubject(getHead())
                .setBody(sBody)
                .setListId(String.valueOf(nID_Sender));

            try {
                int nAttachments = attachments.getCount();
                for(int i = 0; i< nAttachments; i++){
                    BodyPart oBodyPart = attachments.getBodyPart(i);
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

        if(oUniResponse_CreateEmailMessage != null && oUniResponse_CreateEmailMessage.getResult() != null){
            Map<String, Object> mParam = oUniResponse_CreateEmailMessage.getResult();
            log.info("RESULT: {}", mParam);
            Object oID_Message = mParam.get("message_id");
            if(oID_Message != null){
                log.info("id: {}", oID_Message);
                CreateCampaignRequest oCreateCampaignRequest = CreateCampaignRequest.getBuilder(sKey_Sender, "en")
                        .setMessageId(oID_Message.toString())
                        .build();

                UniResponse oUniResponse_CreateCampaign = oUniSender.createCampaign(oCreateCampaignRequest, this.getTo());
                log.info("oUniResponse_CreateCampaign: {}", oUniResponse_CreateCampaign);

            } else {
                throw new EmailException("error while email cration " + oUniResponse_CreateEmailMessage.getError());
            }
        }
    }

    public void reset() {
        attachments = new MimeMultipart();
    }
}
