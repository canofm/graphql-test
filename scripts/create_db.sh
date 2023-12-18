#!/bin/sh -e

function pg_run_command() {
    db_name="postgres"
    if [ ! -z $2 ]; then
        db_name=$2
    fi

    docker exec fede_postgres /bin/sh -c "PGPASSWORD=admin echo \"$1\\gexec\" | psql -U admin -d $db_name"
}

pg_run_command "SELECT 'CREATE DATABASE fede_subscriptions_db' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'fede_subscriptions_db')"

pg_run_command "SELECT 'CREATE DATABASE fede_subscriptions_db_test' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'fede_subscriptions_db_test')"
