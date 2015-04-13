package org.activiti.rest.controller;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.core.Is.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Created by diver on 4/12/15.
 */
@WebAppConfiguration
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = IntegrationTestsApplicationConfiguration.class)
public class ActivitiRestApiControllerCreateSessionScenario {

    @Autowired
    private WebApplicationContext webApplicationContext;

    private MockMvc mockMvc;

    @Before
    public void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    @Test
    public void shouldSuccessfullyReturnCreateSessionJsonResponse() throws Exception {
        mockMvc.perform(post("/rest/create-session/pb").
                param("token_access", "1").
                param("token_refresh", "2").
                accept(MediaType.APPLICATION_JSON).
                header("Authorization", "Basic YWN0aXZpdGktbWFzdGVyOlVqaHRKbkV2ZiE=")).
                andDo(print()).
                andExpect(status().isOk()).
                andExpect(content().contentType("application/json;charset=UTF-8")).
                andExpect(jsonPath("$.*", hasSize(1))).
                andExpect(jsonPath("$.id", is("pb")));
    }

    @Test
    public void shouldReturnJsonErrorMessageWithCode_API_ERR_B_0000_IfBankUnsupported() throws Exception {
        mockMvc.perform(post("/rest/create-session/ob").
                accept(MediaType.APPLICATION_JSON).
                header("Authorization", "Basic YWN0aXZpdGktbWFzdGVyOlVqaHRKbkV2ZiE=")).
                andDo(print()).
                andExpect(status().isBadRequest()).
                andExpect(content().contentType("application/json;charset=UTF-8")).
                andExpect(jsonPath("$.*", hasSize(2))).
                andExpect(jsonPath("$.code", is("API_B_ERR_0000"))).
                andExpect(jsonPath("$.message", is("Unsupported bank")));
    }
}
