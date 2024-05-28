#!/usr/bin/env bash
ssh school_enrollment_frontend@papandayan.sysops.work -p 22116 'source ~/.profile && cd ~/school_enrollment_frontend/deploy/ && bash ./development_server_deploy.sh'
