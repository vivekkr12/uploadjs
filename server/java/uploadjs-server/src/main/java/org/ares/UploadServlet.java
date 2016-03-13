package org.ares;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.Collection;
import java.util.Date;

import javax.servlet.MultipartConfigElement;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import org.eclipse.jetty.server.Request;

@MultipartConfig
public class UploadServlet extends HttpServlet{

	private static final long serialVersionUID = -6639152264862885887L;

	private static final String DEST_DIR= "";
	private static final String FILE_PART_NAME = "blob";
	private static final int BUFFER_SIZE = 4096;
	
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
		// comment / uncomment the line to block / allow cross origin
		response.setHeader("Access-Control-Allow-Origin", "*");
		
		PrintWriter writer = response.getWriter();
		writer.write("Upload action on post request");
		
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException{
		// comment / uncomment the line to block / allow cross origin
		response.setHeader("Access-Control-Allow-Origin", "*");
		
		// Added to enable multi-part in embedded jetty. Not required when deployed as war
		request.setAttribute(Request.__MULTIPART_CONFIG_ELEMENT, new MultipartConfigElement(DEST_DIR));
		
		int totalChunks = Integer.parseInt(request.getParameter("totalChunks"));
		boolean eof = Boolean.parseBoolean(request.getParameter("eof"));
		String fileName = request.getParameter("name");
		boolean append = totalChunks==1 ? false : true;
		
		Collection<Part> parts = request.getParts();
		
		for(Part p : parts){
			
			if(FILE_PART_NAME.equals(p.getName())){
				FileOutputStream fos = new FileOutputStream(DEST_DIR+fileName, append);
				InputStream is = p.getInputStream();
				
				byte[] buffer = new byte[BUFFER_SIZE];
				int len;
				while((len=is.read(buffer))!=-1){
					fos.write(buffer, 0, len);
					fos.flush();
				}
				
				fos.close();
				is.close();
			}
		}
		
		if(eof){
			response.getWriter().write("Uploaded File "+fileName+" to server at "+new Date());
		}
		else{
			response.getWriter().write("Uploaded a part of file "+fileName+" to server");
		}
		
		
	}

	protected void doOptions(HttpServletRequest request, HttpServletResponse response) throws IOException{
		// comment / uncomment the line to block / allow cross origin
		response.setHeader("Access-Control-Allow-Origin", "*");
	}

}
