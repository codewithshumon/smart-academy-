# MCP Server Troubleshooting Guide: Common Pitfalls and Solutions

This guide covers common pitfalls and their solutions for z.ai-vision and Web Search MCP servers when used with VS Code. Each section includes symptoms, diagnostic procedures, specific fixes, and prevention tips.

## 1. Incorrect File Paths

### Symptoms
- Server fails to start with "file not found" or "cannot access" errors
- Configuration files are not being loaded
- VS Code shows "Server connection failed" messages
- MCP server logs show path-related errors

### Diagnostic Procedures
1. Check the current working directory:
   ```bash
   # Windows
   cd
   dir
   
   # Unix-like systems
   pwd
   ls -la
   ```

2. Verify the exact paths in your configuration:
   ```bash
   # Windows
   echo %APPDATA%\Claude\claude_desktop_config.json
   type %APPDATA%\Claude\claude_desktop_config.json
   
   # Unix-like systems
   echo $HOME/.config/claude/claude_desktop_config.json
   cat $HOME/.config/claude/claude_desktop_config.json
   ```

3. Validate MCP server executable paths:
   ```bash
   # Windows
   where node
   where npx
   
   # Unix-like systems
   which node
   which npx
   ```

### Specific Fixes
1. Use absolute paths in configuration:
   ```json
   {
     "mcpServers": {
       "z-ai-vision": {
         "command": "C:\\Program Files\\nodejs\\node.exe",
         "args": ["C:\\Users\\YourUser\\AppData\\Roaming\\npm\\node_modules\\@z-ai\\vision\\index.js"]
       }
     }
   }
   ```

2. Fix path separators for cross-platform compatibility:
   ```json
   {
     "mcpServers": {
       "web-search": {
         "command": "node",
         "args": ["${workspaceFolder}/node_modules/@web-search/server/dist/index.js"]
       }
     }
   }
   ```

3. Use environment variables for dynamic paths:
   ```json
   {
     "mcpServers": {
       "z-ai-vision": {
         "command": "node",
         "args": ["${env:USERPROFILE}/projects/mcp-servers/z-ai-vision/index.js"]
       }
     }
   }
   ```

### Prevention Tips
- Use VS Code workspace variables (`${workspaceFolder}`, `${env:VARIABLE_NAME}`)
- Test paths with the actual command before adding to configuration
- Use relative paths when possible for portable configurations
- Document the exact directory structure required for your setup

## 2. Missing API Keys for Web Search Server

### Symptoms
- Web search requests return authentication errors
- Server logs show "401 Unauthorized" or "API key invalid" messages
- Search functionality appears to work but returns no results
- VS Code extension shows "Authentication failed" notifications

### Diagnostic Procedures
1. Check if API key is set in environment:
   ```bash
   # Windows
   echo %WEB_SEARCH_API_KEY%
   set | findstr WEB_SEARCH
   
   # Unix-like systems
   echo $WEB_SEARCH_API_KEY
   env | grep WEB_SEARCH
   ```

2. Test API key validity:
   ```bash
   # Replace with actual API endpoint and key
   curl -H "Authorization: Bearer YOUR_API_KEY" https://api.websearch.com/v1/search?q=test
   ```

3. Check server logs for authentication errors:
   ```bash
   # Windows
   type %TEMP%\mcp-web-search.log
   
   # Unix-like systems
   tail -f ~/.local/share/mcp/logs/web-search.log
   ```

### Specific Fixes
1. Set API key as environment variable:
   ```bash
   # Windows (temporary)
   set WEB_SEARCH_API_KEY=your_actual_api_key_here
   
   # Windows (permanent)
   setx WEB_SEARCH_API_KEY "your_actual_api_key_here"
   
   # Unix-like systems (temporary)
   export WEB_SEARCH_API_KEY="your_actual_api_key_here"
   
   # Unix-like systems (permanent)
   echo 'export WEB_SEARCH_API_KEY="your_actual_api_key_here"' >> ~/.bashrc
   source ~/.bashrc
   ```

2. Configure API key in VS Code settings:
   ```json
   {
     "mcp.webSearch.apiKey": "your_actual_api_key_here"
   }
   ```

3. Add API key to MCP server configuration:
   ```json
   {
     "mcpServers": {
       "web-search": {
         "command": "node",
         "args": ["./web-search-server.js"],
         "env": {
           "WEB_SEARCH_API_KEY": "your_actual_api_key_here"
         }
       }
     }
   }
   ```

### Prevention Tips
- Store API keys in environment variables, not in configuration files
- Use different API keys for development and production environments
- Regularly rotate API keys for security
- Test API key validity after configuration changes

## 3. Firewall Interference

### Symptoms
- Server starts but VS Code cannot connect
- Connection timeout errors
- "Network unreachable" or "Connection refused" messages
- MCP server works locally but fails with remote connections

### Diagnostic Procedures
1. Test local connectivity:
   ```bash
   # Test if server is listening on expected port
   netstat -an | findstr :3000  # Windows
   netstat -an | grep :3000     # Unix-like
   
   # Test connection to localhost
   telnet localhost 3000
   curl http://localhost:3000/health
   ```

2. Check firewall rules:
   ```bash
   # Windows
   netsh advfirewall firewall show rule name=all | findstr 3000
   
   # Unix-like systems
   sudo ufw status verbose
   sudo iptables -L -n | grep 3000
   ```

3. Test with different ports:
   ```bash
   # Try connecting on alternative ports
   telnet localhost 3001
   telnet localhost 8080
   ```

### Specific Fixes
1. Create firewall exceptions (Windows):
   ```bash
   # Add inbound rule for specific port
   netsh advfirewall firewall add rule name="MCP Server" dir=in action=allow protocol=TCP localport=3000
   
   # Add outbound rule for specific port
   netsh advfirewall firewall add rule name="MCP Server Out" dir=out action=allow protocol=TCP localport=3000
   ```

2. Configure firewall (Unix-like systems):
   ```bash
   # Ubuntu/Debian (ufw)
   sudo ufw allow 3000/tcp
   sudo ufw reload
   
   # CentOS/RHEL (firewalld)
   sudo firewall-cmd --permanent --add-port=3000/tcp
   sudo firewall-cmd --reload
   
   # Generic iptables
   sudo iptables -A INPUT -p tcp --dport 3000 -j ACCEPT
   sudo iptables -A OUTPUT -p tcp --sport 3000 -j ACCEPT
   ```

3. Configure MCP server to use different ports:
   ```json
   {
     "mcpServers": {
       "z-ai-vision": {
         "command": "node",
         "args": ["./z-ai-vision-server.js", "--port", "3001"]
       }
     }
   }
   ```

### Prevention Tips
- Document port requirements for your MCP servers
- Use consistent port numbering across development environments
- Test firewall rules after system updates
- Consider using port ranges for multiple MCP servers

## 4. Permission Errors

### Symptoms
- "Access denied" or "Permission denied" errors
- Server fails to start with insufficient privileges
- File read/write errors in server logs
- VS Code shows "Server startup failed" with permission-related messages

### Diagnostic Procedures
1. Check file and directory permissions:
   ```bash
   # Windows
   icacls "C:\path\to\mcp-server"
   dir "C:\path\to\mcp-server" /q
   
   # Unix-like systems
   ls -la /path/to/mcp-server
   stat /path/to/mcp-server
   ```

2. Test user permissions:
   ```bash
   # Windows
   whoami
   net user %username%
   
   # Unix-like systems
   whoami
   id
   groups
   ```

3. Check executable permissions:
   ```bash
   # Unix-like systems
   ls -la /usr/bin/node
   ls -la ./mcp-server.js
   ```

### Specific Fixes
1. Fix file permissions (Unix-like systems):
   ```bash
   # Make script executable
   chmod +x ./mcp-server.js
   
   # Set appropriate permissions for directories
   chmod 755 /path/to/mcp-server
   chmod 644 /path/to/mcp-server/config.json
   
   # Change ownership if needed
   sudo chown -R $USER:$USER /path/to/mcp-server
   ```

2. Fix file permissions (Windows):
   ```bash
   # Take ownership of files
   takeown /f "C:\path\to\mcp-server" /r /d y
   
   # Grant full control to current user
   icacls "C:\path\to\mcp-server" /grant %USERNAME%:(F) /t
   ```

3. Run with appropriate privileges:
   ```bash
   # Unix-like systems (if necessary)
   sudo -u $USER node ./mcp-server.js
   
   # Windows (run as administrator if required)
   # Right-click VS Code → "Run as administrator"
   ```

### Prevention Tips
- Use user-level installation for Node.js packages when possible
- Avoid running MCP servers with root/administrator privileges
- Set up proper user permissions during initial setup
- Document permission requirements for each MCP server

## 5. Node.js Version Compatibility Issues

### Symptoms
- "Module not found" errors with modern syntax
- Server crashes with syntax errors
- "Unsupported Node.js version" warnings
- Package installation failures

### Diagnostic Procedures
1. Check current Node.js version:
   ```bash
   node --version
   npm --version
   ```

2. Check required version in package.json:
   ```bash
   cat ./package.json | grep -A 5 "engines"
   ```

3. Test compatibility:
   ```bash
   # Check if current version meets requirements
   node -e "console.log(process.versions.node)"
   ```

### Specific Fixes
1. Update Node.js to required version:
   ```bash
   # Using nvm (recommended)
   nvm install 18.17.0
   nvm use 18.17.0
   nvm alias default 18.17.0
   
   # Using n (alternative)
   sudo n 18.17.0
   
   # Download and install directly
   # Visit https://nodejs.org and download the required version
   ```

2. Update package.json with version constraints:
   ```json
   {
     "engines": {
       "node": ">=16.0.0 <19.0.0",
       "npm": ">=8.0.0"
     }
   }
   ```

3. Use Node Version Manager (nvm) for multiple versions:
   ```bash
   # Install nvm (Unix-like systems)
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   
   # Install nvm-windows (Windows)
   # Download from https://github.com/coreybutler/nvm-windows/releases
   
   # Use project-specific Node version
   echo "18.17.0" > .nvmrc
   nvm use
   ```

### Prevention Tips
- Specify Node.js version requirements in package.json
- Use .nvmrc files for project-specific versions
- Test with multiple Node.js versions before deployment
- Keep Node.js updated but avoid breaking changes

## 6. Port Conflicts

### Symptoms
- "Port already in use" errors
- Server fails to bind to specified port
- Multiple MCP servers conflicting with each other
- Intermittent connection issues

### Diagnostic Procedures
1. Check which processes are using ports:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   tasklist | findstr "PID"
   
   # Unix-like systems
   netstat -tulpn | grep :3000
   lsof -i :3000
   ```

2. Test port availability:
   ```bash
   # Windows
   telnet localhost 3000
   
   # Unix-like systems
   nc -zv localhost 3000
   ```

### Specific Fixes
1. Kill conflicting processes:
   ```bash
   # Windows
   taskkill /PID <PID_NUMBER> /F
   
   # Unix-like systems
   kill -9 <PID_NUMBER>
   sudo kill -9 <PID_NUMBER>  # if needed
   ```

2. Configure different ports for each server:
   ```json
   {
     "mcpServers": {
       "z-ai-vision": {
         "command": "node",
         "args": ["./z-ai-vision-server.js", "--port", "3001"]
       },
       "web-search": {
         "command": "node",
         "args": ["./web-search-server.js", "--port", "3002"]
       }
     }
   }
   ```

3. Use dynamic port allocation:
   ```bash
   # Start server with port 0 to let OS assign available port
   node ./mcp-server.js --port 0
   ```

### Prevention Tips
- Document port assignments for each MCP server
- Use port ranges (3000-3010) for development
- Implement port discovery in server startup scripts
- Check port availability before starting servers

## 7. Network Connectivity Problems

### Symptoms
- Server starts but cannot reach external services
- Timeout errors when making API calls
- DNS resolution failures
- Proxy-related connection issues

### Diagnostic Procedures
1. Test basic connectivity:
   ```bash
   # Test internet connectivity
   ping 8.8.8.8
   ping google.com
   
   # Test DNS resolution
   nslookup google.com
   dig google.com
   ```

2. Test specific endpoints:
   ```bash
   # Test API endpoints
   curl -I https://api.z-ai-vision.com/health
   curl -I https://api.websearch.com/v1/status
   
   # Test with verbose output
   curl -v https://example.com
   ```

3. Check proxy settings:
   ```bash
   # Windows
   echo %HTTP_PROXY%
   echo %HTTPS_PROXY%
   netsh winhttp show proxy
   
   # Unix-like systems
   echo $HTTP_PROXY
   echo $HTTPS_PROXY
   env | grep -i proxy
   ```

### Specific Fixes
1. Configure proxy settings:
   ```bash
   # Set proxy environment variables
   # Windows
   set HTTP_PROXY=http://proxy.company.com:8080
   set HTTPS_PROXY=http://proxy.company.com:8080
   set NO_PROXY=localhost,127.0.0.1
   
   # Unix-like systems
   export HTTP_PROXY="http://proxy.company.com:8080"
   export HTTPS_PROXY="http://proxy.company.com:8080"
   export NO_PROXY="localhost,127.0.0.1"
   ```

2. Configure proxy in VS Code:
   ```json
   {
     "http.proxy": "http://proxy.company.com:8080",
     "http.proxyStrictSSL": false
   }
   ```

3. Configure proxy in MCP server:
   ```json
   {
     "mcpServers": {
       "web-search": {
         "command": "node",
         "args": ["./web-search-server.js"],
         "env": {
           "HTTP_PROXY": "http://proxy.company.com:8080",
           "HTTPS_PROXY": "http://proxy.company.com:8080"
         }
       }
     }
   }
   ```

4. Fix DNS issues:
   ```bash
   # Use alternative DNS servers
   # Windows
   netsh interface ip set dns "Ethernet" static 8.8.8.8
   netsh interface ip add dns "Ethernet" 8.8.4.4 index=2
   
   # Unix-like systems
   echo "nameserver 8.8.8.8" | sudo tee /etc/resolv.conf
   echo "nameserver 8.8.4.4" | sudo tee -a /etc/resolv.conf
   ```

### Prevention Tips
- Document network requirements for each MCP server
- Test connectivity in different network environments
- Configure fallback endpoints when possible
- Monitor network status for intermittent issues

## 8. Server Startup Failures

### Symptoms
- MCP server process exits immediately after starting
- VS Code shows "Server failed to start" messages
- No response from server after connection
- Error messages in startup logs

### Diagnostic Procedures
1. Check server startup logs:
   ```bash
   # Windows
   type %TEMP%\mcp-server.log
   Get-Content $env:TEMP\mcp-server.log -Wait
   
   # Unix-like systems
   tail -f ~/.local/share/mcp/logs/server.log
   journalctl -u mcp-server -f
   ```

2. Test server manually:
   ```bash
   # Run server directly to see errors
   node ./mcp-server.js
   
   # Run with debugging enabled
   node --inspect ./mcp-server.js
   DEBUG=* node ./mcp-server.js
   ```

3. Check dependencies:
   ```bash
   # Verify all dependencies are installed
   npm list
   npm ls --depth=0
   
   # Check for missing modules
   node -e "require('./dependency-name')"
   ```

### Specific Fixes
1. Fix missing dependencies:
   ```bash
   # Install missing packages
   npm install missing-package-name
   
   # Reinstall all dependencies
   rm -rf node_modules package-lock.json
   npm install
   
   # Install globally if required
   npm install -g @z-ai/vision-server
   ```

2. Fix configuration issues:
   ```json
   {
     "mcpServers": {
       "z-ai-vision": {
         "command": "node",
         "args": ["./z-ai-vision-server.js"],
         "cwd": "${workspaceFolder}",
         "env": {
           "NODE_ENV": "production"
         }
       }
     }
   }
   ```

3. Add error handling and logging:
   ```javascript
   // Add to server startup script
   process.on('uncaughtException', (error) => {
     console.error('Uncaught Exception:', error);
     process.exit(1);
   });
   
   process.on('unhandledRejection', (reason, promise) => {
     console.error('Unhandled Rejection at:', promise, 'reason:', reason);
     process.exit(1);
   });
   ```

4. Fix memory issues:
   ```bash
   # Increase Node.js memory limit
   node --max-old-space-size=4096 ./mcp-server.js
   
   # Add to package.json scripts
   "start": "node --max-old-space-size=4096 ./mcp-server.js"
   ```

### Prevention Tips
- Implement comprehensive error handling in server code
- Add health check endpoints for monitoring
- Use process managers (PM2, systemd) for automatic restarts
- Monitor server resources and performance

---

This troubleshooting guide covers the most common issues encountered when working with z.ai-vision and Web Search MCP servers in VS Code. For issues not covered here, refer to the server-specific documentation or community support channels.