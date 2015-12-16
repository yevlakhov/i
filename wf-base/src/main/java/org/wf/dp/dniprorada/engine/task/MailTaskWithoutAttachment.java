package org.wf.dp.dniprorada.engine.task;

import org.activiti.engine.delegate.DelegateExecution;
import org.springframework.stereotype.Component;
import org.wf.dp.dniprorada.model.builders.MessageModelBuilder;
import org.wf.dp.dniprorada.resources.MailDataResource;
import org.wf.dp.dniprorada.services.impl.DefaultMailService;

/**
 * @author BW
 */
@Component("MailTaskWithoutAttachment")
public class MailTaskWithoutAttachment extends Abstract_MailTaskCustom {

    @Override
    public void execute(DelegateExecution oExecution) throws Exception {
        DefaultMailService oMail = new DefaultMailService();
        MailDataResource mailDataResource = createMailDataresourceInstance();
        oMail.setMailDataResource(mailDataResource);
        oMail.send(MessageModelBuilder.newInstance().build());
    }
}
