#! /bin/bash

if [[ ${EUID} != 0 ]]
then
    echo "[-] This task must be run with 'sudo'."
    exit
fi

backup_date=$(date +%F_%H-%M-%S)
backup_dir="${SNAP_COMMON}/backups/${backup_date}"
backup_file="${SNAP_COMMON}/backups/rocketchat_backup_${backup_date}.tgz"

mkdir -p ${backup_dir}
mongodump -d parties -o ${backup_dir} -v > "${backup_dir}/mongodump.log"
tar zcvf ${backup_file} ${backup_dir}
rm -rf ${backup_dir}

echo "[+] A backup of your data can be found at ${backup_file}."

