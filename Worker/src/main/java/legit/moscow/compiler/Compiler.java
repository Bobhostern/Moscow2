package legit.moscow.compiler;

import java.util.HashSet;
import java.util.Set;

/**
 *
 * @author Nathan Dias {@literal <nathanxyzdias@gmail.com>}
 */
public interface Compiler {

    //can block or can spawn a new thread
    public void buildAndRun(CompilationTask task);

    public void addListener(CompilationListener listener);
}
