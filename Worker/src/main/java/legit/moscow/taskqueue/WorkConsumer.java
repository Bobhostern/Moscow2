package legit.moscow.taskqueue;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.rabbitmq.client.AMQP;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.DefaultConsumer;
import com.rabbitmq.client.Envelope;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 *
 * @author Nathan Dias {@literal <nathanxyzdias@gmail.com>}
 */
public class WorkConsumer extends DefaultConsumer {

    Gson gson;

    public Map<String, TaskExecutor> executors = new HashMap<>(); //sorry for my transgression!

    public WorkConsumer(Channel channel) {
        super(channel);
        gson = new GsonBuilder().setPrettyPrinting().create();

    }

    @Override
    public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {

        String message = new String(body);

        System.out.println("Received " + message);

        TaskCommand command = gson.fromJson(message, TaskCommand.class);

        command.envelope = envelope;
        command.channel = getChannel();

        if (executors.containsKey(command.tag)) {
            executors.get(command.tag).operate(command);
        } else {
            getChannel().basicNack(envelope.getDeliveryTag(), false, true);
        }

//        getChannel().basicAck(envelope.getDeliveryTag(), false);

    }

}
