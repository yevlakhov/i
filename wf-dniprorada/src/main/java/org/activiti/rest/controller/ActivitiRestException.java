package org.activiti.rest.controller;

/**
 * Created by diver on 4/6/15.
 */
public class ActivitiRestException extends Exception {

    public enum ErrorCode {

        API_S_ERR_0000, //Базовая системная ошибка
        API_B_ERR_0000 //Базовая бизнес ошибка
    }

    private ErrorCode errorCode;

    public ActivitiRestException(ErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public ActivitiRestException(ErrorCode errorCode, Throwable throwable) {
        super(throwable);
        this.errorCode = errorCode;
    }

    public ActivitiRestException(ErrorCode errorCode, String message, Throwable throwable) {
        super(message, throwable);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode.name();
    }
}
