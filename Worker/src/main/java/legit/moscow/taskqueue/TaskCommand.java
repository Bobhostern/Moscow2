package legit.moscow.taskqueue;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Envelope;

/**
 *
 * @author Nathan Dias {@literal <nathanxyzdias@gmail.com>}
 */
public class TaskCommand {
    public String tag, body;
    
    public transient Envelope envelope = null;
    public transient Channel channel = null;
}
