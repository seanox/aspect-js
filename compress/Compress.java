/**
 *  LIZENZBEDINGUNGEN - Seanox Software Solutions ist ein Open-Source-Projekt,
 *  im Folgenden Seanox Software Solutions oder kurz Seanox genannt.
 *  Diese Software unterliegt der Version 2 der GNU General Public License.
 *
 *  Seanox aspect-js, Fullstack JavaScript UI Framework
 *  Copyright (C) 2019 Seanox Software Solutions
 *
 *  This program is free software; you can redistribute it and/or modify it
 *  under the terms of version 2 of the GNU General Public License as published
 *  by the Free Software Foundation.
 *
 *  This program is distributed in the hope that it will be useful, but WITHOUT
 *  ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 *  FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
 *  more details.
 *
 *  You should have received a copy of the GNU General Public License along
 *  with this program; if not, write to the Free Software Foundation, Inc.,
 *  51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
 */
import java.io.File;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.channels.FileChannel;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.Scanner;

public class Compress {
    
    private static final String SERVICE_URL = "https://javascript-minifier.com/raw";
    
    private static final String SERVICE_CONTENT = "input=%s";
    
    public static void main(String[] options) throws Exception {

        if (options == null
                || options.length < 1) {
            System.out.println("usage: java -jar compress.jar <file>");
            return;
        }
            
        Path path = new File(options[0]).toPath();
        long before;
        try (FileChannel channel = FileChannel.open(path)) {
            before = channel.size();
        }
        
        String content = new String(Files.readAllBytes(path));
        content = String.format(SERVICE_CONTENT, URLEncoder.encode(content, "UTF-8"));
        
        URL url = new URL(SERVICE_URL);
        HttpURLConnection connection = (HttpURLConnection)url.openConnection();
        connection.setDoOutput(true);
        connection.setRequestMethod("POST");
        try (OutputStream output = connection.getOutputStream()) {
            output.write(content.getBytes());
        }
        connection.connect();

        try (InputStream input = connection.getInputStream();
                Scanner scanner = new Scanner(input).useDelimiter("\\A")) {
            content = scanner.hasNext() ? scanner.next() : "";
        }
        
        Files.write(path, content.getBytes(), StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING, StandardOpenOption.WRITE);
        
        long after;
        try (FileChannel channel = FileChannel.open(path)) {
            after = channel.size();
        }
        System.out.println("Compressing: " + path + System.lineSeparator() + "\t" + (100 -(after *100 /before)) + "% (" + after + " bytes)");
    }
}