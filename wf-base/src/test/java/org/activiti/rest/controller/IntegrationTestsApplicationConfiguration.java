package org.activiti.rest.controller;

import org.activiti.explorer.conf.ApplicationConfiguration;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.ImportResource;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@EnableWebMvc
@Configuration
@Import(ApplicationConfiguration.class)
@ImportResource("classpath:mock-beans.xml")
public class IntegrationTestsApplicationConfiguration {

}
