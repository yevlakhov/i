package org.activiti.rest.controller;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.wf.dp.dniprorada.exchange.AccessCover;
import org.wf.dp.dniprorada.model.MessageModel;
import org.wf.dp.dniprorada.model.builders.MessageModelBuilder;
import org.wf.dp.dniprorada.services.impl.DefaultMailService;

import static org.mockito.Matchers.anyString;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

@WebAppConfiguration
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = IntegrationTestsApplicationConfiguration.class)
public class ActivitiPaymentRestControllerMailTest {

    private static final String VALID_BODY = "oException.getMessage()=not liqpay system<br><br>sID_Order=123456<br>" +
            "sID_PaymentSystem=Test PaySystem<br>sData=Test sdata<br>data=Test data<br>signature=Test signature<br>" +
            "<br>���� ������� �������� ��� �������� �������:<br><form method=\"GET\" action=\"${general.sHost}" +
            "/wf/service/setPaymentStatus_TaskActiviti_Direct?sID_Order=123456&sID_PaymentSystem=Test " +
            "PaySystem&sData=&nID_Subject=0&sAccessContract=Request&sAccessKey=test-access-cover-key\" " +
            "accept-charset=\"utf-8\"><input type=\"text\" name=\"sID_Transaction\" value=\"\"/>" +
            "<input type=\"text\" name=\"sStatus_Payment\" value=\"\"/><input type=\"submit\" value=\"��������� ������ ����������!\"/>" +
            "</form><br><br>���� �� ����������, ��������� �� <a href=\"${general.sHost}/wf/service/setPaymentStatus_TaskActiviti_Direct?" +
            "sID_Order=123456&sID_PaymentSystem=Test PaySystem&sData=&nID_Subject=0&sAccessContract=Request&" +
            "sAccessKey=test-access-cover-key&sID_Transaction=&sStatus_Payment=\" target=\"_top\">���� ������</a>" +
            ", � ���������� ������� �� ����������(sID_Transaction) � ������(sStatus_Payment). �����, ��� ������������� ��������������� " +
            "����� � ������ (����� �������� � ������)<br>" +
            "(${general.sHost}/wf/service/setPaymentStatus_TaskActiviti_Direct?sID_Order=123456&sID_PaymentSystem=Test PaySystem&" +
            "sData=&nID_Subject=0&sAccessContract=Request&sAccessKey=test-access-cover-key&sID_Transaction=&sStatus_Payment=)<br><br>";

    private static final String VALID_SUBJECT = "(test)/setPaymentStatus_TaskActiviti:������ ��� ������� �������� ���������" +
            " ���������� � ������� � ��������-������!";

    private static final String VALID_RECIPIENT = "bvv4ik@gmail.com,dmitrij.zabrudskij@privatbank.ua";

    @Autowired
    private WebApplicationContext webApplicationContext;

    private MockMvc mockMvc;

    @Autowired
    private DefaultMailService mailService;
    @Autowired
    private AccessCover accessCover;

    @Before
    public void setUp() throws Exception {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        when(accessCover.getAccessKey(anyString())).thenReturn("test-access-cover-key");
    }

    @Test
    public void shouldSuccessfullySendDocumentByEmail() throws Exception {
        mockMvc.perform(post("/setPaymentStatus_TaskActiviti").
                param("sID_Order", "123456").
                param("sID_PaymentSystem", "Test PaySystem").
                param("sData", "Test sdata").
                param("sPrefix", "Test prefix").
                param("data", "Test data").
                param("signature", "Test signature")
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
