#!/bin/sh -e

function out()
{
    local params
    local message

    params="-e"
    while [[ ${1} = -* ]]; do
        params="${params} ${1}"
        shift
    done

    message="${@}<0>"

    message=$(echo "${message}" | sed -E $'s/<([0-9;]+)>/\033\[\\1m/g')
    echo ${params} "${message}"
}

function absolute_path() {
    echo "$(cd "$(dirname "$1")"; pwd)/$(basename "$1")"
}

function flyway () {
    db_conf_path=$1
    db_migrations_path=$2
    shift;
    shift;
    out "<32;1>Running flyway $*<0>"
    docker run --rm --network host \
        -v "$(absolute_path $db_conf_path)":/flyway/conf \
        -v "$(absolute_path $db_migrations_path)":/flyway/sql \
        -e "FLYWAY_EDITION=community" \
        --entrypoint "flyway" \
        flyway/flyway:10.3.0-alpine $*
    out "<33;1>flyway finished<0>"
}

flyway db/conf db/migrations migrate

flyway db/test/conf db/migrations migrate
