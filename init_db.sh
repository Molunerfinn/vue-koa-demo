#!/bin/bash
mysql -u$MYSQL_USER -p$MYSQL_ROOT_PASSWORD <<EOF
source $WORK_PATH/$FILE_0;
source $WORK_PATH/$FILE_1;
