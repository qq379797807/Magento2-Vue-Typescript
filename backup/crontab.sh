crontab -e

#输入一下信息“：
00 01 * * * /DATA/bakdata/bakdata.sh#每天凌晨1点，以oracle用户执行ordatabak.sh备份文件

:wq! #保存退出

#重启crontab
service crond restart