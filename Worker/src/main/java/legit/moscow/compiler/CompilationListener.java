package legit.moscow.compiler;

/**
 *
 * @author Nathan Dias {@literal <nathanxyzdias@gmail.com>}
 */
@FunctionalInterface
public interface CompilationListener {
    
    public void compilationComplete(CompilationEvent event);
    
}
