package legit.moscow.compiler;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.util.concurrent.TimeUnit;
import java.util.logging.Logger;

/**
 *
 * @author Nathan Dias {@literal <nathanxyzdias@gmail.com>}
 */
public class ClassThatWillBeDeletedSoon {

    private final String compilePath;
    private final String runPath;
    private final int timeout;

    private static int count = 0;

    //compilePath null if interpreted langauge (IE javascript does not need
    //to compile)
    public ClassThatWillBeDeletedSoon(String compilePath, String runPath, int timeout) {
        this.compilePath = compilePath;
        this.runPath = runPath;
        this.timeout = timeout;
    }

    //the full deal. cFile, argC, and argR can be null.
    //will just blindly try appending cFile and rFile to commands if
    //argC and argR are null
    public String compileAndRun(File workingDirectory, String cFile, String rFile, String[] argC, String[] argR) throws IOException {
        if (compilePath != null) {  //<editor-fold>
            if (cFile == null) {
                throw new IllegalArgumentException("cFile cannot be null if"
                        + "language is compiled");
            }
            List<String> cArgs = new ArrayList<>();
            cArgs.add(compilePath);
            if (argC != null) {
                for (String s : argC) {
                    cArgs.add(s);
                }
            } else {
                cArgs.add(cFile);
            }

            File bOut = new File(workingDirectory, cFile + "." + rFile + ".build.output"); //guaranteed not to conflict!!!! :D
            bOut.createNewFile();

            ProcessBuilder compile = new ProcessBuilder(cArgs)
                    .redirectErrorStream(true)
                    .redirectOutput(bOut)
                    .directory(workingDirectory);

            Process p = compile.start();
            try {
                p.waitFor(timeout, TimeUnit.SECONDS);
                p.destroyForcibly();
            } catch (InterruptedException e) {
                e.printStackTrace(); //pls don't interrupt this ;)
            }
        }//</editor-fold>

        if (cFile == null) {    //        <editor-fold>
            throw new IllegalArgumentException("cFile cannot be null if"
                    + "language is compiled");
        }
        List<String> rArgs = new ArrayList<>();
        rArgs.add(runPath);
        if (argR != null) {
            for (String s : argR) {
                rArgs.add(s);
            }
        } else {
            rArgs.add(rFile);
        }

        File rOut = new File(workingDirectory, cFile + "." + rFile + ".run.output"); //guaranteed not to conflict!!!! :D
        rOut.createNewFile();

        ProcessBuilder run = new ProcessBuilder(rArgs)
                .redirectErrorStream(true)
                .redirectOutput(rOut)
                .directory(workingDirectory);

        Process p = run.start();
        boolean timedOut = false;
        try {
            if (!p.waitFor(timeout, TimeUnit.SECONDS)) { //timeout
                p.destroyForcibly();
                timedOut = true;
            }
        } catch (InterruptedException e) {
            e.printStackTrace(); //pls don't interrupt this >:(
        }   //        </editor-fold>

        Scanner in = new Scanner(new BufferedReader(new FileReader(rOut)));

        StringBuilder builder = new StringBuilder();
        while (in.hasNextLine()) {
            builder.append(in.nextLine()).append("\n");
        }
        if (timedOut) {
            builder.append("\n\n//Run time exceeded ")
                    .append(timeout)
                    .append(" seconds");
        }

        return builder.toString();

    }

    //shortcut for no arguments. cFile should be null for scripting language
    public String compileAndRun(File workingDirectory, String cFile, String rFile) throws IOException {
        return compileAndRun(workingDirectory, cFile, rFile, null, null);
    }

    //shortcut for scripting languages
    public String compileAndRun(File workingDirectory, String rFile) throws IOException {
        return compileAndRun(workingDirectory, null, rFile);
    }

}
