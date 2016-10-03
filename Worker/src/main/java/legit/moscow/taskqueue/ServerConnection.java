package legit.moscow.taskqueue;

import com.github.kevinsawicki.http.HttpRequest;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonSyntaxException;
import java.util.Map;

/**
 *
 * @author Nathan Dias {@literal <nathanxyzdias@gmail.com>}
 */
public class ServerConnection {

    String server;

    Gson gson;

    final static String REQ_TEMPLATE = "http://%s/%s";

    public ServerConnection(String server) {
        this.server = server;
        gson = new GsonBuilder().setPrettyPrinting().create();
    }

    public String post(String sub, Map<?, ?> form) {

        try {
            String requrl = String.format(REQ_TEMPLATE, server, sub);
            HttpRequest request = new HttpRequest(requrl, "POST");

            request.form(form);

            String response = request.body();
            
            return response;
            
        } catch (HttpRequest.HttpRequestException | JsonSyntaxException e) {
            return null;
        }
    }

}
