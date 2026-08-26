#!/usr/bin/env python3
"""
Lightweight Python HTTP Server for MÈO Mental Health Counselling Portal.
Serves static files (HTML, CSS, JS) on http://localhost:8000
"""

import http.server
import socketserver
import os
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 6000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        # Default to index.html for root path
        if path == '/' or path == '':
            path = '/index.html'
        return super().translate_path(path)

def run_server(port=PORT):
    os.chdir(DIRECTORY)
    handler = CustomHTTPRequestHandler
    socketserver.TCPServer.allow_reuse_address = True
    max_port = port + 20
    
    while port < max_port:
        try:
            with socketserver.TCPServer(("0.0.0.0", port), handler) as httpd:
                print("=" * 60, flush=True)
                print(f" MÈO Mental Health Portal Server Running!", flush=True)
                print(f" Local URL: http://localhost:{port}", flush=True)
                print(f" Safety Check Page: http://localhost:{port}/index.html", flush=True)
                print(f" Main Landing Page: http://localhost:{port}/trang-chu.html", flush=True)
                print("=" * 60, flush=True)
                print("Press Ctrl+C to stop the server.", flush=True)
                httpd.serve_forever()
                break
        except OSError as e:
            if e.errno == 48: # Address already in use
                print(f"Port {port} in use, trying port {port + 1}...", flush=True)
                port += 1
            else:
                raise e

if __name__ == '__main__':
    run_server()
