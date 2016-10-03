package legit.moscow.compiler;

import java.io.File;
import legit.moscow.taskqueue.TaskCommand;

/**
 *
 * @author Nathan Dias {@literal <nathanxyzdias@gmail.com>}
 */
public class CompilationTask {

    public final File src;
    public final int id;
    public TaskCommand command;

    public CompilationTask(TaskCommand command, int id, File src) {
        this.command = command;
        this.id = id;
        this.src = src;
    }

}
