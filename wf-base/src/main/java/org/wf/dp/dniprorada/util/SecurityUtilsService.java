package org.wf.dp.dniprorada.util;

import org.springframework.stereotype.Component;

@Component
public class SecurityUtilsService {

    public String generateSecret() {
        return SecurityUtils.generateSecret();
    }
}
