/**
 * 

Endpoint: temporaldatabase.ceewmm2srats.ap-south-1.rds.amazonaws.com
Port: 5432
DB Name: temporaldatabase
Username: postgress
Password: postgress

psql -h temporaldatabase.ceewmm2srats.ap-south-1.rds.amazonaws.com -U postgress -d postgres



temporal-sql-tool \
  --plugin postgres12 \
  --ep temporaldatabase.ceewmm2srats.ap-south-1.rds.amazonaws.com \
  --port 5432 \
  --user postgress \
  --password postgress \
  --database temporal \
  --tls \
  --tls-disable-host-verification \
  setup-schema -v 0.0


temporal-sql-tool \
  --plugin postgres12 \
  --ep temporaldatabase.ceewmm2srats.ap-south-1.rds.amazonaws.com \
  --port 5432 \
  --user postgress \
  --password postgress \
  --database temporal \
  --tls \
  --tls-disable-host-verification \
  update-schema -d schema/postgresql/v12/temporal/versioned

 */
