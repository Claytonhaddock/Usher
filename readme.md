# Usher - guiding your code to correctness.

## Installation

- 'npm config set registry http://vault.cnvrmedia.net/nexus/content/groups/npm-all/'
- 'sudo npm install -g cnvr_usher'

## Features

- Linting: constant linting to ensure proper syntax and efficient code

- Minifying: minifies and exports files into ‘Bin_CT’ folder after every save.

- Junk var injection: Usher will automatically detect whether or not user is working on direct line of business and inject the junk vars contained in 'message_vars.js' into all of the files.

- Debug: the minifier exports both a minified version and a standard version of files into the ‘Bin_CT’ folder at the same level as the Bin directory.

## Running Usher 

In your Terminal, cd into the Bin directory containing your project files and run `usher`

Usher is always watching..: after being initialized, Usher continues to watch all JS files in the provided directory until the process has ended. To quit, hit `ctrl-c` in the Terminal.




