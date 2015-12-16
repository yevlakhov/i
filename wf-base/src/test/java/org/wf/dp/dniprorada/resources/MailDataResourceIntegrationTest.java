package org.wf.dp.dniprorada.resources;

import org.activiti.rest.controller.IntegrationTestsApplicationConfiguration;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

@WebAppConfiguration
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = IntegrationTestsApplicationConfiguration.class)
public class MailDataResourceIntegrationTest {

    private static final String VALID_SENDER = "admin@igov.org.ua";
    private static final String VALID_USERNAME = "dnipro.egov.test.ua";
    private static final String VALID_PASSWORD = "dnipro.egov.tes";
    private static final String VALID_HOSTNAME = "localhost";

    private static final Integer UNDEFINED_PORT_VALUE = null;
    private static final Integer DEFAULT_PORT = 465;
    private static final Integer VALID_PORT = 25;

    @Autowired
    private MailDataResource mailDataResource;

    @Test
    public void shouldSuccessfullyReadInformationFromPeroptyFile() {
        assertEquals(VALID_SENDER, mailDataResource.getSender());
        assertEquals(VALID_USERNAME, mailDataResource.getUsername());
        assertEquals(VALID_PASSWORD, mailDataResource.getPassword());
        assertEquals(VALID_HOSTNAME, mailDataResource.getHostname());
        assertEquals(VALID_PORT, mailDataResource.getPort());
        assertFalse(mailDataResource.isSSL());
        assertTrue(mailDataResource.isTLS());
    }

    @Test
    public void shouldReturnDefaultPortIfPropertyPortNotSpecified() {
        mailDataResource.setPort(UNDEFINED_PORT_VALUE);

        assertEquals(DEFAULT_PORT, mailDataResource.getPort());
    }
}
