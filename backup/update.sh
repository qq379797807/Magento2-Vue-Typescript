#!/bin/bash

# FileName:update.sh

# This is a ShellScript For Auto DB Backup and Delete old Backup

#

backupdir=/root/backupDir           #测试服务器B数据库备份文件路径

mysql_bin_dir=/usr/sbin            #测试服务器B的mysql的安装路径

databaseName=database              #数据库名字

bakdatabaseName=database_bak_      #备份的数据库的文件名

mysqluser=user                     #测试服务器B的mysql用户名

mysqlpwd=passwd                    #测试服务器B的mysql密码

time=` date +%Y%m%d `              #当天的日期:年月日

#先删除前一天的数据库

$mysql_bin_dir/mysql -u $mysqluser -p$mysqlpwd -e "drop database $databaseName;"

#创建新的数据库

$mysql_bin_dir/mysql -u $mysqluser -p$mysqlpwd -e "create database $databaseName;"

#将备份的数据库文件导入到mysql中

gzip -dc $backupdir/$bakdatabaseName$time.sql.gz | $mysql_bin_dir/mysql -u $mysqluser -p$mysqlpwd $databaseName

#保留3天内的备份文件，时间可通过-mtime 后的 +2 修改

find $backupdir -name "*.sql.gz" -type f -mtime +2 -exec rm -f {} \; > /dev/null 2>&1