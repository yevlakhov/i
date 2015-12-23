package org.activiti.rest.controller;

import org.egov.service.HistoryEventService;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.wf.dp.dniprorada.model.MessageModel;
import org.wf.dp.dniprorada.model.builders.MessageModelBuilder;
import org.wf.dp.dniprorada.services.impl.DefaultMailService;
import org.wf.dp.dniprorada.util.SecurityUtilsService;

import static org.mockito.Matchers.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

@WebAppConfiguration
@ActiveProfiles({"default", "integration_mail"})
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = IntegrationTestsApplicationConfiguration.class)
public class ActivitiRestApiControllerMailTest {

    private static final String VALID_RECIPIENT = "recipient@gmail.com";
    private static final String VALID_SUBJECT = "Recipient email subject";
    private static final String VALID_BODY = "Recipient email body<br/><table><tr><th>Поле</th><th>Тип </th>" +
            "<th> Поточне значення</th></tr><tr><td>31312</td><td>T</td><td>TEST</td></tr></table><br/>" +
            "mock://host/order/search?nID=123456&sToken=asfd-asdfq-234-asdf-asdf<br/>";

    @Autowired
    private WebApplicationContext webApplicationContext;

    private MockMvc mockMvc;

    @Autowired
    private DefaultMailService mailService;
    @Autowired
    private HistoryEventService historyEventService;
    @Autowired
    private SecurityUtilsService securityUtilsService;

    @Before
    public void setUp() throws Exception {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();

        when(historyEventService.updateHistoryEvent(anyString(), anyString(), anyBoolean(), anyMap()))
                .thenReturn("History event message");
        when(securityUtilsService.generateSecret()).thenReturn("asfd-asdfq-234-asdf-asdf");
    }

    @Test
    public void shouldSuccessfullySendEmail() throws Exception {
        mockMvc.perform(get("/rest/setTaskQuestions").
                param("sID_Order", "123456").
                param("nID_Protected", "654321").
                param("nID_Process", "9876").
                param("nID_Server", "6789").
                param("saField", "[{\"id\":31312, \"type\":\"T\", \"value\":\"TEST\"}]").
                param("sMail", "recipient@gmail.com").
                param("sHead", "Recipient email subject").
                param("sBody", "Recipient email body")
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