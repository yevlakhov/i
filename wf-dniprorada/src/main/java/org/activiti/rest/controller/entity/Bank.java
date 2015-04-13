package org.activiti.rest.controller.entity;

import org.apache.commons.lang3.StringUtils;

/**
 * Created by diver on 4/13/15.
 */
public enum Bank {
    PB,//ПриватБанк
    OB;//ОщадБанк

    public static Bank valueOfEqualIgnoreCase(String value) {
        if (StringUtils.isBlank(value)) {
            return valueOf(value);
        } else {
            return valueOf(value.toUpperCase());
        }
    }
}
