import subprocess

# Start the Flask HTTP server
subprocess.Popen(['python', 'run.py'])

# Start the WebSocket server
subprocess.Popen(['python', 'websocket_server/websocket_server.py'])
