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
	@if [ `which python 2> /dev/null` ];then npm install;else echo "npm isn't in your path";fi
	@echo " done."
	@echo
