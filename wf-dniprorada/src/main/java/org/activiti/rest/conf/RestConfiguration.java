package org.activiti.rest.conf;

import org.activiti.rest.common.application.ContentTypeResolver;
import org.activiti.rest.common.application.DefaultContentTypeResolver;
import org.activiti.rest.service.api.RestResponseFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ImportResource;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.PropertySources;

/**
 * @author Joram Barrez
 */
@Configuration
@PropertySources({
		@PropertySource(value = "classpath:db.properties", ignoreResourceNotFound = true),
		@PropertySource(value = "classpath:engine.properties", ignoreResourceNotFound = true),
		@PropertySource(value = "classpath:bankID.properties", ignoreResourceNotFound = true)})
@ComponentScan(basePackages = {
                //"org.activiti.explorer.conf"
                //,
                //"org.egov.web.controller"
                "org.activiti.rest.conf"
                , "org.activiti.rest.controller"
                //, "org.activiti.rest.conf"
                ////, "org.activiti.rest.service.api"
                //, "org.wf.dp.dniprorada.engine.task"
                })
public class RestConfiguration {
	private final Logger log = LoggerFactory
			.getLogger(RestConfiguration.class);
	
	@Bean()
	public RestResponseFactory restResponseFactory() {
		RestResponseFactory restResponseFactory = new RestResponseFactory();
		log.info("restResponseFactory init");
		return restResponseFactory;
	}

	@Bean()
	public ContentTypeResolver contentTypeResolver() {
		ContentTypeResolver resolver = new DefaultContentTypeResolver();
		return resolver;
	}
}
