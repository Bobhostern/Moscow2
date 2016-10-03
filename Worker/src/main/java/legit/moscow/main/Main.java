package legit.moscow.main;

import com.google.gson.Gson;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;
import legit.moscow.compiler.CompilationEvent;
import legit.moscow.compiler.JavaCompiler;
import legit.moscow.taskqueue.ServerConnection;
import legit.moscow.taskqueue.WorkConsumer;

/**
 *
 * @author Nathan Dias {@literal <nathanxyzdias@gmail.com>}
 */
public class Main {

    public static void main(String[] args) throws Exception {
        Gson gson = new Gson();

//        ClassThatWillBeDeletedSoon compiler = new ClassThatWillBeDeletedSoon(
//                "C:/Program Files/Java/jdk1.8.0_101/bin/javac.exe",
//                "C:/Program Files/Java/jdk1.8.0_101/bin/java.exe",
//                10);
//
//        System.out.println(compiler.compileAndRun(
//                new File("Test Compilation Files"), "Echo.java", "Echo"));
        String server = "localhost";
        String rabbit = "localhost";
        File jdkBin = new File("C:/Program Files/Java/jdk1.8.0_101/bin");

        final String WORK_QUEUE = "WORK_QUEUE";

//        ServerConnection serverConnection = new ServerConnection(server);
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost(rabbit);
        Connection connection = factory.newConnection();
        Channel channel = connection.createChannel();

        channel.queueDeclare(WORK_QUEUE, true, false, false, null);
        System.out.println("Channel joined");

        channel.basicQos(1);

        WorkConsumer consumer = new WorkConsumer(channel);
        JavaCompiler javaCompiler = new JavaCompiler(jdkBin, 60);
        consumer.executors.put("legit_moscow_javacompiler", javaCompiler);

        ServerConnection serverConnection = new ServerConnection(server);

        javaCompiler.addListener((CompilationEvent event) -> {
//            System.out.println("Compilation listened to");
            if (event.failure) {
                try {
                    event.task.command.channel.basicNack(
                            event.task.command.envelope.getDeliveryTag(),
                            false,
                            true);
                } catch (IOException ex) {
                    ex.printStackTrace(); //welp can't do much more
                }
            } else {
                try {
                    Map<String, String> form = new HashMap<>();

                    form.put("id", String.valueOf(event.task.id));
                    form.put("buildOutput", event.buildOutput);
                    form.put("runOutput", event.runOutput);
//                    System.out.println("Sending results");
                    String res = serverConnection.post("rest/worker/submitJudgement", form);
//                    System.out.println("response: " + res);
                    boolean success = gson.fromJson(res, Success.class).success;
                    if (success) {
                        event.task.command.channel.basicAck(
                                event.task.command.envelope.getDeliveryTag(),
                                false);
                    } else{
                        event.task.command.channel.basicNack(
                            event.task.command.envelope.getDeliveryTag(),
                            false,
                            true);
                    }
                } catch (IOException ex) {
                    ex.printStackTrace(); //can't do much :/
                }
            }
        });

        channel.basicConsume(WORK_QUEUE, false, consumer);
        new Scanner(System.in).nextLine();
        System.exit(0);

    }

}

class Success {

    public boolean success;
}
