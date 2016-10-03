package legit.moscow.taskqueue;

/**
 *
 * @author Nathan Dias {@literal <nathanxyzdias@gmail.com>}
 */
public interface TaskExecutor {
    
    public void operate(TaskCommand command);
    
}