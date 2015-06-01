package ua.gov.systests.bankid.oauth

import groovy.text.GStringTemplateEngine
import org.apache.commons.lang3.Validate

import java.util.prefs.Base64

/**
 * @author zora.borys
 */
public class Utils {

    public static ConfigObject loadConfig(String configName, String env) {
        Validate.notBlank(env)
        URL url = Thread.currentThread().getContextClassLoader().getResource(configName)
        return new ConfigSlurper(env).parse(url)
    }

    public static def renderJsonTemplate(String templatePath, Map binding) throws FileNotFoundException {
        File templateFile = getValidatedFile(templatePath)
        def engine = new GStringTemplateEngine()
        def template = engine.createTemplate(templateFile).make(binding)
        return template.toString()
    }

    private static getValidatedFile(String filePath) throws FileNotFoundException {
        File file = new File(filePath)
        if (! file.exists()) {
            file = new File(Thread.currentThread().contextClassLoader.getResource(filePath).getFile())
        }
        if (! file.exists()) throw new FileNotFoundException("file with path: ${filePath} not found")
        return file
    }

    public static String getBasicAuthString(String id, String secret){
        return Base64.byteArrayToBase64("$id:$secret".getBytes("UTF-8"))
    }
}
