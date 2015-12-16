package org.wf.dp.dniprorada.model.builders;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.activation.FileDataSource;
import javax.activation.URLDataSource;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMultipart;
import javax.mail.internet.MimeUtility;
import java.io.File;
import java.net.URL;

public class MimeMultipartBuilder {

    private static final Logger LOG = LoggerFactory.getLogger(MimeMultipartBuilder.class);

    private static final String DEFAULT_ENCODING = "UTF-8";

    private MimeMultipart mimeMultipart;

    private MimeMultipartBuilder() {
        mimeMultipart = new MimeMultipart();
    }

    public MimeMultipart build() {
        return mimeMultipart;
    }

    public static MimeMultipartBuilder newInstance() {
        return new MimeMultipartBuilder();
    }

    public MimeMultipartBuilder _Attach(File oFile) {
        _Attach(new FileDataSource(oFile), oFile.getName(), "");
        return this;
    }

    public MimeMultipartBuilder _Attach(File[] aFile) {
        LOG.info("[_Attach:aoFile]:aFile.length=" + aFile.length);
        for (File oFile : aFile) {
            _Attach(oFile);
        }
        return this;
    }

    public MimeMultipartBuilder _Attach(DataSource oDataSource, String sFileName, String sDescription) {
        try {
            MimeBodyPart oMimeBodyPart = new MimeBodyPart();
            oMimeBodyPart.setHeader("Content-Type", "multipart/mixed");
            oMimeBodyPart.setDataHandler(new DataHandler(oDataSource));
            oMimeBodyPart.setFileName(MimeUtility.encodeText(sFileName));
            mimeMultipart.addBodyPart(oMimeBodyPart);
            LOG.info("[_Attach:oFile]:sFileName=" + sFileName + ",sDescription=" + sDescription);
        } catch (Exception oException) {
            LOG.error("[_Attach:oFile]sFileName=" + sFileName + ",sDescription=" + sDescription, oException);
        }
        return this;
    }

    public MimeMultipartBuilder _Attach(URL[] aoURL, String[] asName) {
        LOG.info("[_Attach:aoURL]:asName=" + asName);
        for (int n = 0; n < aoURL.length; n++) {
            try {
                if (asName == null) {
                    _Attach(aoURL[n], null);
                } else {
                    _Attach(aoURL[n], asName[n]);
                }
            } catch (Exception oException) {
                LOG.error("[_Attach:aoURL]", oException);
            }
        }
        return this;
    }

    public MimeMultipartBuilder _Attach(URL oURL, String sName) {
        try {
            MimeBodyPart oMimeBodyPart = new MimeBodyPart();//javax.activation
            oMimeBodyPart.setHeader("Content-Type", "multipart/mixed");
            DataSource oDataSource = new URLDataSource(oURL);
            oMimeBodyPart.setDataHandler(new DataHandler(oDataSource));
            //oPart.setFileName(MimeUtility.encodeText(source.getName()));
            oMimeBodyPart.setFileName(
                    MimeUtility.encodeText(sName == null || "".equals(sName) ? oDataSource.getName() : sName));
            mimeMultipart.addBodyPart(oMimeBodyPart);
            LOG.info("[_Attach:oURL]:sName=" + sName);
        } catch (Exception oException) {
            LOG.error("[_Attach:oURL]:sName=" + sName, oException);
        }
        return this;
    }

    public MimeMultipartBuilder _AttachBody(String sBody) {
        try {
            MimeBodyPart oMimeBodyPart = new MimeBodyPart();
            //oMimeBodyPart.setText(sBody,DEFAULT_ENCODING,"Content-Type: text/html;");
            oMimeBodyPart.setText(sBody, DEFAULT_ENCODING);
            //         oMimeBodyPart.setHeader("Content-Type", "text/html");
            oMimeBodyPart.setHeader("Content-Type", "text/html;charset=utf-8");
            mimeMultipart.addBodyPart(oMimeBodyPart);
            LOG.info("[_Attach:sBody]:sBody=" + sBody);
        } catch (Exception oException) {
            LOG.error("[_Attach:sBody]", oException);
        }
        return this;
    }

    public MimeMultipartBuilder _Attach(URL[] aoURL) {
        return _Attach(aoURL, null);
    }
}
