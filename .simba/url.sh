parse_url() {
    # Shamelessly copied over from: https://gist.github.com/joshisa/297b0bc1ec0dcdda0d1625029711fa24
    # With some own additions
    declare -n url="$1"
    local prefix="$1"
    local _port="$2"

    local protocol=$(echo "$url" | grep "://" | sed -e's,^\(.*://\).*,\1,g')
    # Remove the protocol
    local url_no_protocol=$(echo "${url/$protocol/}")
    # Use tr: Make the protocol lower-case for easy string compare
    protocol=$(echo "$protocol" | tr '[:upper:]' '[:lower:]')

    # Extract the user and password (if any)
    # cut 1: Remove the path part to prevent @ in the querystring from breaking the next cut
    # rev: Reverse string so cut -f1 takes the (reversed) rightmost field, and -f2- is what we want
    # cut 2: Remove the host:port
    # rev: Undo the first rev above
    local userpass=$(echo "$url_no_protocol" | grep "@" | cut -d"/" -f1 | rev | cut -d"@" -f2- | rev)
    local pass=$(echo "$userpass" | grep ":" | cut -d":" -f2)
    if [ -n "$pass" ]; then
        user=$(echo "$userpass" | grep ":" | cut -d":" -f1)
    else
        user="$userpass"
    fi

    # Extract the host
    local hostport=$(echo "${url_no_protocol/$userpass@/}" | cut -d"/" -f1)
    local host=$(echo "$hostport" | cut -d":" -f1)
    port=$(echo "$hostport" | grep ":" | cut -d":" -f2)
    port=${port:-$_port}
    local path="/"$(echo "$url_no_protocol" | grep "/" | cut -d"/" -f2-)

    # origin
    local origin="${protocol:-http}"
    [[ "$user" != "" ]] && origin="${origin}${user}"
    [[ "$pass" != "" ]] && origin="${origin}:${pass}"
    [[ "$userpass" != "" ]] && oriign="${origin}@"
    origin="${origin}${host}:${port}"

    declare -gx ${prefix}_PROTOCOL="${protocol:-http}"
    declare -gx ${prefix}_USERNAME="$user"
    declare -gx ${prefix}_PASSWORD="$pass"
    declare -gx ${prefix}_DOMAIN="$host"
    declare -gx ${prefix}_PORT="${port:-$PORT}"
    declare -gx ${prefix}_PATH="${path:-/}"

    if [[ "$path" == "" ]]; then
        url="${origin}"
    else
        url="${origin}${path}"
    fi
}
