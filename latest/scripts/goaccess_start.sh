goaccess /home/superlogin/AsTeRICS-Grid/superlogin/access.log -o /var/www/html/report.html --log-format=COMBINED --ws-url=couchdb.asterics-foundation.org --port=7890 --real-time-html --ssl-cert=/opt/couchdb/letsencrypt/live/couchdb.asterics-foundation.org/fullchain.pem --ssl-key=/opt/couchdb/letsencrypt/live/couchdb.asterics-foundation.org/privkey.pem --geoip-database=/home/superlogin/geolite/GeoLite2-City.mmdb &