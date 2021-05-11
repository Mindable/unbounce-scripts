# git_commit_hash = $(shell git log -1 --pretty=%H)
# aws_account_id = $(shell aws sts get-caller-identity --query Account --output text)

Hello:
	@echo "Hello"

compile_checkout:
    @echo "Compiling Main checkout files"
