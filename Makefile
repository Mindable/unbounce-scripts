# git_commit_hash = $(shell git log -1 --pretty=%H)
# aws_account_id = $(shell aws sts get-caller-identity --query Account --output text)

CHECKOUT_DIR = 'checkout'
COMPONENT_DIR = '$(CHECKOUT_DIR)/components'
COMPONENT_FILES = $(shell find $(COMPONENT_DIR) -name '*.js')
CHECKOUT_DIST_FOLDER = 'dist/checkout'
CHECKOUT_DIST_FILE = '$(CHECKOUT_DIST_FOLDER)/checkout.js'

default:
	@echo "Hi, please read README.md before using Make utility"

compile_checkout:
	cat $(CHECKOUT_DIR)/main.js $(COMPONENT_FILES) $(CHECKOUT_DIR)/autoload-checkout.js > $(CHECKOUT_DIST_FILE)
	cp $(CHECKOUT_DIR)/default.css $(CHECKOUT_DIST_FOLDER)/default.css
	@echo "Compilation complete, Please review file at $(CHECKOUT_DIST_FOLDER)"