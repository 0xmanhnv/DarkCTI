connectors-up:
	docker-compose -f alienvault/docker-compose.yml up -d
	docker-compose -f amitt/docker-compose.yml up -d
#	docker-compose -f crowdstrike/docker-compose.yml up -d
	docker-compose -f cryptolaemus/docker-compose.yml up -d
	docker-compose -f cve/docker-compose.yml up -d
	docker-compose -f cyber-threat-coalition/docker-compose.yml up -d
	docker-compose -f export-file-csv/docker-compose.yml up -d
	docker-compose -f export-file-stix/docker-compose.yml up -d
	docker-compose -f import-file-pdf-observables/docker-compose.yml up -d
	docker-compose -f import-file-stix/docker-compose.yml up -d
	docker-compose -f ipinfo/docker-compose.yml up -d
#	docker-compose -f malpedia/docker-compose.yml up -d
#	docker-compose -f misp/docker-compose.yml down
	docker-compose -f mitre/docker-compose.yml up -d
	docker-compose -f opencti/docker-compose.yml up -d
	docker-compose -f virustotal/docker-compose.yml up -d

connectors-down:
	docker-compose -f alienvault/docker-compose.yml down
	docker-compose -f amitt/docker-compose.yml down
#	docker-compose -f crowdstrike/docker-compose.yml down
	docker-compose -f cryptolaemus/docker-compose.yml down
	docker-compose -f cve/docker-compose.yml down
	docker-compose -f cyber-threat-coalition/docker-compose.yml down
	docker-compose -f export-file-csv/docker-compose.yml down
	docker-compose -f export-file-stix/docker-compose.yml down
	docker-compose -f import-file-pdf-observables/docker-compose.yml down
	docker-compose -f import-file-stix/docker-compose.yml down
	docker-compose -f ipinfo/docker-compose.yml down
#	docker-compose -f malpedia/docker-compose.yml down
#	docker-compose -f misp/docker-compose.yml down
	docker-compose -f mitre/docker-compose.yml down
	docker-compose -f opencti/docker-compose.yml down
	docker-compose -f virustotal/docker-compose.yml down

connectors-stop:
	docker-compose -f alienvault/docker-compose.yml stop
	docker-compose -f amitt/docker-compose.yml stop
#	docker-compose -f crowdstrike/docker-compose.yml stop
	docker-compose -f cryptolaemus/docker-compose.yml stop
	docker-compose -f cve/docker-compose.yml stop
	docker-compose -f cyber-threat-coalition/docker-compose.yml stop
	docker-compose -f export-file-csv/docker-compose.yml stop
	docker-compose -f export-file-stix/docker-compose.yml stop
	docker-compose -f import-file-pdf-observables/docker-compose.yml stop
	docker-compose -f import-file-stix/docker-compose.yml stop
	docker-compose -f ipinfo/docker-compose.yml stop
#	docker-compose -f malpedia/docker-compose.yml stop
#	docker-compose -f misp/docker-compose.yml stop
	docker-compose -f mitre/docker-compose.yml stop
	docker-compose -f opencti/docker-compose.yml stop
	docker-compose -f virustotal/docker-compose.yml stop

connectors-env:
	cp .env alienvault
	cp .env amitt
#	cp .env crowdstrike
	cp .env cryptolaemus
	cp .env cve
	cp .env cyber-threat-coalition
	cp .env export-file-csv
	cp .env export-file-stix
	cp .env import-file-pdf-observables
	cp .env import-file-stix
	cp .env ipinfo
#	cp .env malpedia
#	cp .env misp
	cp .env mitre
	cp .env opencti
	cp .env virustotal