import sys
from DatabaseManager import connect_to_db
from subprocess import call

if 'dev' in sys.argv:
    environment = 'development'
else:
    environment = 'production'

connect_to_db()

call(["node", "../../Client/scripts/addScotlandCouncilsToDb.js"])
call(["node", "../../Client/scripts/addScotlandWardsToDb.js"])
