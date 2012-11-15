@echo off
IF "%1" == "test" (
	node_modules\.bin\mocha --ui bdd --reporter spec tests
	GOTO end
) 

IF "%1" == "test-and-cov" (
	node_modules\.bin\mocha --ui bdd --reporter html-cov tests > reports/coverage.html
	echo Generated test coverage report in "reports/coverage.html"
	GOTO end
)

:end
	echo Ok!