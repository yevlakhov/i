package org.activiti.rest.controller;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.wf.dp.dniprorada.model.MessageModel;
import org.wf.dp.dniprorada.model.builders.MessageModelBuilder;
import org.wf.dp.dniprorada.services.impl.DefaultMailService;

import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

@WebAppConfiguration
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = IntegrationTestsApplicationConfiguration.class)
public class ActivitiDocumentAccessControllerMailTest {

    private static final String VALID_BODY = "Вам надано доступ до документу на Порталі державних послуг iGov.org.ua." +
            "<br><br><b>Код документу:</b> %1000%<br><br>Щоб переглянути цей документ, зайдіть на " +
            "<a href=\"${general.sHostCentral}\">iGov.org.ua</a>, пункт меню <b>Документи</b>, " +
            "вкладка <b>Пошук документу за кодом</b>. Там оберіть тип документу, того, хто його надає та введіть код." +
            "<br><br>З повагою,<br>команда порталу державних послу iGov";

    private static final String VALID_SUBJECT = "Доступ до документу";

    private static final String VALID_RECIPIENT = "test@gmail.com";

    @Autowired
    private WebApplicationContext webApplicationContext;
    private MockMvc mockMvc;

    @Autowired
    @Qualifier("mail")
    private DefaultMailService mailService;

    @Before
    public void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    @Test
    public void shouldSuccessfullySendDocumentByEmail() throws Exception {
        mockMvc.perform(get("/setDocumentLink").
                param("nID_Document", "123456").
                param("sFIO", "Test FIO").
                param("sTarget", "Test target").
                param("sTelephone", "+390923041554").
                param("nMS", "3000").
                param("sMail", "test@gmail.com")
        );

        verify(mailService).send(eq(dummyOfMessageModel()));
    }

    private MessageModel dummyOfMessageModel() {
        return MessageModelBuilder.newInstance().
                withRecipient(VALID_RECIPIENT).
                withSubject(VALID_SUBJECT).
                withBody(VALID_BODY).build();
    }
}
