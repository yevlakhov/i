package ua.org.bankid.oauth.systest

import groovy.util.logging.Slf4j
import groovyx.net.http.RESTClient
import org.apache.http.client.params.ClientPNames
import org.junit.Before
import org.junit.BeforeClass
import org.junit.Ignore
import org.junit.Test
import org.springframework.http.HttpStatus

import javax.ws.rs.core.MediaType

import static org.junit.Assert.assertEquals
import static org.junit.Assert.fail

@Slf4j(value = "logger")
public class OAuthNotAuthorizedFlowTest {

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

    @Test
    public void testPublicResourceAvailable() {
        logger.info("starting testPublicResourceAvailable ...")
        def resp = rest.get(path:"/public/citizen/stub")
        assertEquals(HttpStatus.OK.value(), resp.status)
    }

    @Test
    public void testNotProtectedURLResourceAvailable() {
        logger.info("starting testNotProtectedURLResourceAvailable ...")
        def resp = rest.get(path:"/not_protected/citizen/stub")
        assertEquals(HttpStatus.OK.value(), resp.status)
    }

    @Test
    public void testNotProtectedURLProtectedResourceForbiden() {
        logger.info("starting testNotProtectedURLProtectedResourceForbiden ...")
        def resp = rest.get(path:"/not_protected/citizen/protected_stub")
        assertEquals(HttpStatus.FOUND.value(), resp.status)
    }

    @Test
    public void testProtectedURLResourceForbiden() {
        logger.info("starting testProtectedURLResourceForbiden ...")

        def resp = rest.get(path:"/protected/citizen/stub")
        assertEquals(HttpStatus.FOUND.value(), resp.status)

        resp = rest.get(path:"/protected/citizen/protected_stub")
        assertEquals(HttpStatus.FOUND.value(), resp.status)
    }

}