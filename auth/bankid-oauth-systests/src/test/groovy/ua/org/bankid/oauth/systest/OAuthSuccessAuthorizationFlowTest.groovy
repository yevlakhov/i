package ua.org.bankid.oauth.systest

import groovy.util.logging.Slf4j
import groovyx.net.http.RESTClient
import org.apache.http.client.params.ClientPNames
import org.junit.BeforeClass
import org.junit.Ignore
import org.junit.Test
import org.springframework.http.HttpStatus

import javax.ws.rs.core.HttpHeaders
import javax.ws.rs.core.MediaType

import static org.junit.Assert.assertEquals

/**
 * @author zora.borys
 */
@Slf4j(value = "logger")
class OAuthSuccessAuthorizationFlowTest {

    private static RESTClient rest
    private static ConfigObject conf;

    @BeforeClass
    public static void setUp() throws Exception {
        logger.info("setup rest client")
        ConfigObject conf = Utils.loadConfig("oauth-config.groovy", System.getProperty("test_env"))
        rest = new RESTClient(conf.server.egov.url)
        rest.client.params.setParameter(ClientPNames.HANDLE_REDIRECTS, Boolean.FALSE)
        rest.handler.failure = { resp -> return resp }
        rest.contentType = MediaType.APPLICATION_JSON
    }

    @Ignore
    @Test
    public void testOAuthSuccessFlow() {
        logger.info("starting testOAuthSuccessFlow ...")
        logger.info("test oauth success flow with rest client: {}", rest)

        def resp = rest.get(path:"/protected/citizen/stub")
        assertEquals(HttpStatus.FOUND.value(), resp.status)

        String clientBase64Encoded = Utils.getBasicAuthString("consumer", "password")

        resp = rest.post(
                path:resp.headers.location,
                headers: [ "Accept": "application/json",
                           "Authorization": "Basic ${clientBase64Encoded}",
                           "Content-Type": MediaType.APPLICATION_FORM_URLENCODED],
                body: [ grant_type: "password", username: "consumer", password: "password"]);
        assertEquals(HttpStatus.OK.value(), resp.status)
    }
}
