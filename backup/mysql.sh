#!/bin/bash

# FileName:mysql.sh

# This is a ShellScript For Auto DB Backup and Delete old Backup

#

backupdir=/root/backupDir             #测试服务器数据库备份文件路径

mysql_bin_dir=/usr/sbin            #测试服务器的mysql的安装路径

databaseName=database              #数据库名字

bakdatabaseName=database_bak_      #备份的数据库的文件名

mysqluser=user                     #测试服务器的mysql用户名

mysqlpwd=passwd                    #测试服务器的mysql密码

targetServerUser=root              #目标服务器的用户名

targetServerIP=172.16.3.35         #目标服务器的IP地址

targetpath=/home/backup            #目标服务器备份路径

time=` date +%Y%m%d `              #当天的日期:年月日

#从数据库导出数据库备份文件

$mysql_bin_dir/mysqldump -u$mysqluser -p$mysqlpwd $databaseName | gzip > $backupdir/$bakdatabaseName$time.sql.gz

#保留3天内的备份文件，时间可通过-mtime 后的 +2 修改

find $backupdir -name "$bakdatabaseName*.sql.gz" -type f -mtime +2 -exec rm -f {} \; > /dev/null 2>&1

#将备份文件发送到测试服务器B

/home/backup/scp.exp $backupdir/$bakdatabaseName$time.sql.gz $targetServerUser@$targetServerIP:$targetpath/$bakdatabaseName$time.sql.gz