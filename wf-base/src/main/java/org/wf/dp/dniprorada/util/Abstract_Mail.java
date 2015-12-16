package org.wf.dp.dniprorada.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.wf.dp.dniprorada.resources.MailDataResource;

/**
 * @author Belyavtsev Vladimir Vladimirovich (BW)
 */
public abstract class Abstract_Mail {

    private static final String DEFAULT_HEADER_VALUE = "Subject";
    private static final String DEFAULT_BODY_VALUE = "Text";

    private String header;
    private String body;
    private String to;

    public Abstract_Mail() {
        header = DEFAULT_HEADER_VALUE;
        body = DEFAULT_BODY_VALUE;
    }

    public String getHead() {
        return header;
    }

    public Abstract_Mail _Head(String sHead) {
        this.header = sHead;
        return this;
    }

    public String getBody() {
        return body;
    }

    public Abstract_Mail _Body(String sBody) {
        this.body = sBody;
        return this;
    }

    public String getTo() {
        return to;
    }

    public Abstract_Mail _To(String to) {
        this.to = to;
        return this;
    }

    abstract public void send() throws Exception;
}
