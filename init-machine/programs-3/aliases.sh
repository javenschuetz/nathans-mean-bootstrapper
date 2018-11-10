# aliases for root user

# .bashrc
if ! grep -q '# my aliases' ~/.bashrc; then
	echo; echo "adding aliases to .bashrc"

cat <<EOF >> ~/.bashrc

# my aliases
alias cls='clear; ls'
EOF
fi
