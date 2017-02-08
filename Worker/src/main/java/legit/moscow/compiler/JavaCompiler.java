package legit.moscow.compiler;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonSyntaxException;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Scanner;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;
import legit.moscow.taskqueue.TaskCommand;
import legit.moscow.taskqueue.TaskExecutor;

/**
 *
 * @author Nathan Dias {@literal <nathanxyzdias@gmail.com>}
 */
public class JavaCompiler implements Compiler, TaskExecutor {

    final static String COMPILATION_DIRECTORY = "legit_moscow_javacompiler";

    final File myDirectory;

    private final int timeout;
    private final String javac, java;

    private int id_counter = 0;

    Gson gson;

    private final Set<CompilationListener> listeners = new HashSet<>();

    public JavaCompiler(File jdkBin, int timeout) {

        this.timeout = timeout;
        gson = new GsonBuilder().setPrettyPrinting().create();
        javac = jdkBin.getAbsolutePath() + "/javac";
        java = jdkBin.getAbsolutePath() + "/java";

        myDirectory = new File(COMPILATION_DIRECTORY + "/" + toString());  //good old memory addresses
        myDirectory.mkdirs();
    }

    final static int MAX_OUTPUT_SIZE = 1000000;

    @Override
    public void buildAndRun(CompilationTask task) {
        System.out.println("Starting task " + task.id);

        File workingDirectory = new File(myDirectory, String.valueOf(task.id));
        workingDirectory.mkdirs();

        List<String> cArgs = new ArrayList<>();
        cArgs.add(javac);
        cArgs.add(task.src.getName());

        File bOut = new File(workingDirectory, task.id + ".build.output");
        try {
            bOut.createNewFile();
        } catch (IOException e) {
            e.printStackTrace();
        }

        ProcessBuilder compile = new ProcessBuilder(cArgs)
                .redirectErrorStream(true)
                .redirectOutput(bOut)
                .directory(workingDirectory);
        System.out.println("Compiling");
        try {
            Process p = compile.start();
            p.waitFor(timeout, TimeUnit.SECONDS);
            p.destroyForcibly();
        } catch (Exception e) {
            e.printStackTrace();
        }

        Scanner cBuild = null;
        try {
            cBuild = new Scanner(new BufferedReader(new FileReader(bOut)));
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }

        StringBuilder cBuilder = new StringBuilder();
        while (cBuild.hasNextLine()) {
            cBuilder.append(cBuild.nextLine()).append("\n");
        }

        String compileOutput = cBuilder.toString();

        List<String> rArgs = new ArrayList<>();
        rArgs.add(java);
        String className = task.src.getName();
        className = className.substring(0, className.lastIndexOf("."));
        rArgs.add(className);

        File rOut = new File(workingDirectory, task.id + ".run.output");
        try {
            rOut.createNewFile();
        } catch (IOException e) {
            e.printStackTrace();
        }

        ProcessBuilder run = new ProcessBuilder(rArgs)
                .redirectErrorStream(true)
                .redirectOutput(rOut)
                .directory(workingDirectory);

        boolean timedOut = false;
        try {
            Process p = run.start();
            if (!p.waitFor(timeout, TimeUnit.SECONDS)) { //timeout
                timedOut = true;
            }
            p.destroyForcibly();
        } catch (Exception e) {
            e.printStackTrace(); //pls don't interrupt this >:(
        }   //        </editor-fold>

        Scanner in = null;
        try {
            in = new Scanner(new BufferedReader(new FileReader(rOut)));
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }

        in.useDelimiter("");
        StringBuilder builder = new StringBuilder();

        int count = 0;
        while (in.hasNext() && count++ < MAX_OUTPUT_SIZE) {
            builder.append(in.next());
        }
        if (in.hasNext()) {
            builder.append("\n//input length exceeded ")
                    .append(MAX_OUTPUT_SIZE)
                    .append(" characters");
        }

        if (timedOut) {
            builder.append("\n\n//Run time exceeded ")
                    .append(timeout)
                    .append(" seconds");
        }

        String runOutput = builder.toString();
        System.out.println("build complete");
        CompilationEvent event = new CompilationEvent(task, compileOutput, runOutput);
        for (CompilationListener listener : listeners) {
            listener.compilationComplete(event);
        }

    }

    @Override
    public void addListener(CompilationListener listener) {
        listeners.add(listener);
    }

    @Override
    public void operate(TaskCommand command) {

        String payload = command.body;

        try {
            JavaCompilationTask task
                    = gson.fromJson(payload, JavaCompilationTask.class);

//            File parent = new File("RUNS");
//            parent.mkdirs();
//            
//            File folder = new File(parent, "Run " + task.id);
//            folder.mkdirs();
            File workingDirectory = new File(myDirectory, String.valueOf(task.id));
            workingDirectory.mkdirs();

            File src = new File(workingDirectory, task.filename);

            try (FileWriter out = new FileWriter(src)) {
                out.append(task.filebody);
                out.flush();
            }

            CompilationTask toRun = new CompilationTask(command, task.id, src);

            buildAndRun(toRun);

        } catch (JsonSyntaxException | IOException e) {
            try {
                command.channel.basicNack(command.envelope.getDeliveryTag(), false, true);
            } catch (IOException ex) {
                //well looks like we've got an exception in our exception...
                ex.printStackTrace();
            }
        }

    }

}

class JavaCompilationTask {

    public String filename, filebody;
    public int id;

}
