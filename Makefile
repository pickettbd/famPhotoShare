# MAKEFILE

# ------ VARIABLES ------------------- ||
mongodb_loc=/var/lib/mongodb

# ------ TARGETS --------------------- ||
all: clean main 
	@echo "make completed."
	@echo

clean:
	@echo
	@echo "clean:"
	@rm -rf node_modules &> /dev/null || true
	@unlink ./data/db > /dev/null 2>&1 || true
	@echo " done."
	@echo

realclean: clean
	@rm -rf data > /dev/null 2>&1 || true

main:
	@echo "main:"
	@if [ `which gm 2> /dev/null` ];then echo "" || true;else echo "gm (graphicsmagick) isn't in your path";exit 1;fi
	@if [ `which mongo 2> /dev/null` ];then echo "" || true;else echo "mongo isn't in your path";exit 1;fi
	@if [ `which mongod 2> /dev/null` ];then mkdir -p ./data/photos; ln -s $(mongodb_loc) ./data/db;else echo "mongod isn't in your path";exit 1;fi
	@if [ `which npm 2> /dev/null` ];then sudo npm install;else echo "npm isn't in your path";exit 1;fi
	@echo " done."
	@echo
