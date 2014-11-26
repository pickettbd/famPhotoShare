# MAKEFILE

# ------ VARIABLES ------------------- ||

# ------ TARGETS --------------------- ||
all: clean main 
	@echo "make completed."
	@echo

clean:
	@echo
	@echo "clean:"
	@rm -rf node_modules &> /dev/null || true
	@echo " done."
	@echo

main:
	@echo "main:"
	@if [ `which mongo 2> /dev/null` ];then mkdir -p data/db || true;else echo "mongo isn't in your path";exit 1;fi
	@if [ `which mongod 2> /dev/null` ];then echo "";else echo "mongod isn't in your path";exit 1;fi
	@mongod --logpath ./data/mongodb.log --dbpath ./data/db &
	@if [ `which npm 2> /dev/null` ];then npm install;else echo "npm isn't in your path";exit 1;fi
	@echo " done."
	@echo
