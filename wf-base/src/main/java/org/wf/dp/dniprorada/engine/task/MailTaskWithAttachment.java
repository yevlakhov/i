package org.wf.dp.dniprorada.engine.task;

import org.activiti.engine.ActivitiObjectNotFoundException;
import org.activiti.engine.delegate.DelegateExecution;
import org.activiti.engine.delegate.Expression;
import org.activiti.engine.task.Attachment;
import org.apache.commons.mail.ByteArrayDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.wf.dp.dniprorada.model.builders.MessageModelBuilder;
import org.wf.dp.dniprorada.model.builders.MimeMultipartBuilder;
import org.wf.dp.dniprorada.resources.MailDataResource;
import org.wf.dp.dniprorada.services.impl.DefaultMailService;

import javax.activation.DataSource;
import java.io.InputStream;
import java.util.List;

/**
 * @author BW
 */
@Component("mailTaskWithAttachment")
public class MailTaskWithAttachment extends Abstract_MailTaskCustom {

    private final static Logger log = LoggerFactory.getLogger(MailTaskWithAttachment.class);

    private Expression docName;

    @Override
    public void execute(DelegateExecution oExecution) throws Exception {

        DefaultMailService oMail = new DefaultMailService();

        String sFromMail = getStringFromFieldExpression(this.from, oExecution);
        String saToMail = getStringFromFieldExpression(this.to, oExecution);
        String sHead = getStringFromFieldExpression(this.subject, oExecution);
        String sBodySource = getStringFromFieldExpression(this.text, oExecution);
        String sBody = replaceTags(sBodySource, oExecution);

        MailDataResource mailDataResource = createMailDataresourceInstance();

        oMail.setMailDataResource(mailDataResource);

        List<Attachment> aAttachment = oExecution.getEngineServices().getTaskService()
                .getProcessInstanceAttachments(oExecution.getProcessInstanceId());
        InputStream oInputStream_Attachment = null;
        String sFileName = "document";
        String sFileExt = "txt";
        for (Attachment oAttachment : aAttachment) {
            sFileName = oAttachment.getName();
            sFileExt = oAttachment.getType();
            oInputStream_Attachment = oExecution.getEngineServices().getTaskService()
                    .getAttachmentContent(oAttachment.getId());
            if (oInputStream_Attachment == null) {
                throw new ActivitiObjectNotFoundException(
                        "Attachment with id '" + oAttachment.getId() + "' doesn't have content associated with it.",
                        Attachment.class);
            }
        }
        String sAttachName = getStringFromFieldExpression(this.docName, oExecution);
        log.info("sAttachName= " + sAttachName);
        MimeMultipartBuilder attachmentsBuilder = MimeMultipartBuilder.newInstance();
        if (aAttachment != null && !aAttachment.isEmpty()) {
            String sFileExtNew = sFileExt.startsWith("imag") ? sFileExt.substring(11) : sFileExt.substring(25);
            DataSource oDataSource = new ByteArrayDataSource(oInputStream_Attachment, "application/" + sFileExtNew);
            // add the attachment
            log.info("sFileName= " + sFileName);
            log.info("sFileExt= " + sFileExt);
            log.info("sFileExtNew= " + sFileExtNew);

            attachmentsBuilder._Attach(oDataSource, sFileName + "." + sFileExtNew, sAttachName);
            //oMultiPartEmail.attach(oDataSource, sFileName + "." + sFileExtNew, sAttachName);
        } else {
            throw new ActivitiObjectNotFoundException("add the file to send");
        }

        oMail.send(MessageModelBuilder.newInstance().
                withAttachments(attachmentsBuilder.build()).
                withRecipient(saToMail).
                withSubject(sHead).
                withBody(sBody).
                build());
    }

}
