
import java.io.File;
import java.util.Scanner;

public class Echo{
    
    public static void main(String[] args) throws Exception{
        
        Scanner yo = new Scanner(new File("echo.in"));
        while(yo.hasNextLine()){
            System.out.println(yo.nextLine());
        }
        System.out.println(yo.nextLine());
        
    }
    
}