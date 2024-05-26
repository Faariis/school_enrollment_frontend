## Production build

#### 1. Skinuti nvm.setup.exe, onda:
- nvm install 20
- nvm use 20
- node -v
- Trenutna verzija: v20.13.1

#### 2. Napraviti direktorij
#### 3. Kopiraj package.json iz <source> (ovdje treba vidjeti treba li sta izbaciti) , i yarn.lock (ako ima) u taj direktorij
#### 4. Podesiti yarn config set cache-folder <ime_direktorija>/.yarn
#### 5. Napraviti i otic na novi folder <production/>
#### 6. Pokreni NODE_ENV=production yarn install
#### 7. Kopirati sve nase dokumente iz <souce> u <production> folder
#### 8. Pokrenuti yarn install && yarn build
#### 9. Startaj server: HOST='0.0.0.0' PORT=3535 npm start  ili yarn serve3. 

## systemd script

- First check if server is already running locally on the port 3535
```bash
$ sudo netstat -nap|grep 3535
tcp6       0      0 :::3535                 :::*                    LISTEN      505033/next-server 
# kill it
$ kill -9 505033
```
- Create `systemd` script

Add in /etc/systemd/system/myenrollment_frontend.service
```bash
[Unit]
Description=My Frontend Enrollment Application
After=network.target

[Service]
# User and group to run the service as
User=anel
Group=anel

# The working directory where your application is located
WorkingDirectory=/home/anel/GitHub/school_enrollment_frontend

# Command to start your application
ExecStart=/usr/bin/npm start

# Environment variables
Environment=HOST=0.0.0.0
Environment=PORT=3535

# Restart settings
Restart=always
RestartSec=10

# Output logs to syslog
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=myfrontend

[Install]
WantedBy=multi-user.target
```
- Execute
```bash
$ sudo systemctl daemon-reload
$ sudo systemctl enable myenrollment_frontend.service
$ sudo systemctl start myenrollment_frontend.service
$ sudo systemctl status myenrollment_frontend.service 
$ sudo systemctl status myenrollment_frontend.service
● myenrollment_frontend.service - My Frontend Enrollment Application
     Loaded: loaded (/etc/systemd/system/myenrollment_frontend.service; enabled; vendor preset: enabled)
     Active: active (running) since Sun 2024-05-26 10:12:46 UTC; 20s ago
   Main PID: 509068 (npm start)
      Tasks: 23 (limit: 1095)
     Memory: 46.8M
        CPU: 800ms
     CGroup: /system.slice/myenrollment_frontend.service
             ├─509068 "npm start" "" "" "" "" "" "" "" "" "" "" "" "" "" ""
             ├─509079 sh -c "next start"
             └─509080 "next-server (v14.2.3)" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" ">

May 26 10:12:46 scw-amazing-maxwell systemd[1]: Started My Frontend Enrollment Application.
May 26 10:12:46 scw-amazing-maxwell myfrontend[509068]: > school_enrollment_frontend@0.1.0 start
May 26 10:12:46 scw-amazing-maxwell myfrontend[509068]: > next start
May 26 10:12:46 scw-amazing-maxwell myfrontend[509080]:   ▲ Next.js 14.2.3
May 26 10:12:46 scw-amazing-maxwell myfrontend[509080]:   - Local:        http://localhost:3535
May 26 10:12:46 scw-amazing-maxwell myfrontend[509080]:  ✓ Starting...
May 26 10:12:46 scw-amazing-maxwell myfrontend[509080]:  ⚠ "next start" does not work with "output: standalone" configuration. Use "node .next/standalone/server.js" instead.
May 26 10:12:46 scw-amazing-maxwell myfrontend[509080]:  ✓ Ready in 439ms
```
- Check logs
```bash
$ sudo journalctl -u myenrollment_frontend.service
```