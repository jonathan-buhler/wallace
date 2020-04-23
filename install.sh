# Installs brew package manager
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"

# Installs JavaScript runtime, version control, and package manager
brew install node git yarn

# Downloads wallace
git clone https://github.com/jonathanBuhler/wallace

# Installs Wallace's dependencies
yarn install