#!/bin/sh
# postCreateCommand.sh

echo "START Install"

sudo chown -R vscode:vscode .


echo "First of all, please execute the following command"
echo "-----------------------------------------------"
echo "git config --global user.name \"Your Name\""
echo "git config --global user.email \"Your Email\""
echo "-----------------------------------------------"

cd remix && npm run setup && cd ../
supabase start

echo "FINISH Install"