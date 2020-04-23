# Installs brew package manager
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"

# Installs JavaScript runtime and package manager
brew install git node yarn

# Installs Wallace's dependencies
yarn install