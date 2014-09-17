NPM_BIN=./node_modules/.bin

.PHONY: lint

lint:
	@$(NPM_BIN)/jscs schwartz.js