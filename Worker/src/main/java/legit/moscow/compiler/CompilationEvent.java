package legit.moscow.compiler;

/**
 *
 * @author Nathan Dias {@literal <nathanxyzdias@gmail.com>}
 */
public class CompilationEvent {

    final public String buildOutput, runOutput;
    final public CompilationTask task;
    public boolean failure = false;
    
    final static String GENERAL_FAILURE = "General Failure";
    
    public static CompilationEvent failure(int id){
        CompilationEvent event = new CompilationEvent(new CompilationTask(null,id, null),GENERAL_FAILURE,GENERAL_FAILURE);
        event.failure = true;
        return event;
    }

    public CompilationEvent(CompilationTask task, String buildOutput, String runOutput) {
        this.task = task;
        this.buildOutput = buildOutput;
        this.runOutput = runOutput;
    }

}
