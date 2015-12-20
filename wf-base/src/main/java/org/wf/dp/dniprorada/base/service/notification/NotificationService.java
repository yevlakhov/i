package org.wf.dp.dniprorada.base.service.notification;

import org.apache.commons.mail.EmailException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.wf.dp.dniprorada.model.builders.MessageModelBuilder;
import org.wf.dp.dniprorada.util.GeneralConfig;
import org.wf.dp.dniprorada.services.impl.DefaultMailService;

/**
 * User: goodg_000
 * Date: 25.08.2015
 * Time: 22:54
 */
public class NotificationService {

    @Autowired
    GeneralConfig generalConfig;

    @Autowired
    @Qualifier("mail")
    DefaultMailService mail;

    public void sendTaskCreatedInfoEmail(String receiverEmail, Long nID_Protected) throws EmailException {

      /*
      String sHead = String.format("Ви подали заяву №%s на послугу через портал %s", nID_Protected,
              generalConfig.sHostCentral());

      String sBody = String.format("Ви подали заяву №%s на послугу через портал %s", nID_Protected,
              generalConfig.sHostCentral()) +
              "<br>(Ви завжди можете подивитись її статус на порталі у разділі \"Статуси\")" +
              "<br>" +
              "При надходжені Вашої заявки у систему госоргану - Вам буде додатково направлено персональний лист - повідомленя.<br>";
      */

        String sHead = String.format("Ваша заявка %s прийнята!", nID_Protected);

        String sBody = String.format("Ваша заявка %s прийнята!", nID_Protected) +
                "<br>Ви завжди зможете переглянути її поточний статус у розділі <a href=\""+generalConfig.sHostCentral() + "/order/search?nID=" + nID_Protected+"\">\"Статуси\"</a>. Також на кожному етапі Ви будете отримувати email-повідомлення.	";

        mail.send(MessageModelBuilder.newInstance().withRecipient(receiverEmail).withSubject(sHead).withBody(sBody).build());
    }
}
