package org.ares;

import java.util.Arrays;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletContextHandler;

public class App {
	
    public static void main( String[] args ) throws Exception {
    	
    	int port = 8080;
    	
    	System.out.println(Arrays.toString(args));
    	
    	if(args.length!=0 && args[0]!=null){
    		port = Integer.parseInt(args[0]);
    	}
    	
    	Server server = new Server(port);
    	ServletContextHandler handler = new ServletContextHandler(ServletContextHandler.SESSIONS);
    	handler.setContextPath("/");
    	server.setHandler(handler);
    	handler.addServlet(UploadServlet.class, "/");
    	server.start();
    	server.join();
        
    }
}
