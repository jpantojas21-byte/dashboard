import http.server
import socketserver
import os
import sys

PORT = 8080
DIRECTORY = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'dashboard')

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

if __name__ == '__main__':
    print(f"=========================================================")
    print(f" Servidor Dashboard Ejecutivo - Aeronáutica Civil       ")
    print(f" Dirección: http://localhost:{PORT}")
    print(f" Sirviendo archivos desde: {DIRECTORY}")
    print(f" Presione Ctrl+C para detener el servidor.               ")
    print(f"=========================================================")
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServidor detenido.")
            sys.exit(0)
