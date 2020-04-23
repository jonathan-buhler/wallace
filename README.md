# Wallace

Wallace is a script to help find you a Tesco delivery slot

## Installation

Wallace likes being on your Desktop so that it's easier to find him

Once this folder has been moved to the Desktop, open up the Terminal (should be in your Applications folder) and enter the following lines one at a time

```bash
cd Desktop/wallace  # Navigates to folder
bash install.sh     # Runs installation script (takes a couple minutes)
```

**`install.sh`** will ask for your computer's password but it's just to install a package manager, nothing nefarious!

Also don't worry if no characters show up while typing, that's just how passwords are inputted in the Terminal

**These commands only need to be run the first time you use Wallace**

## Usage

To start Wallace, while inside the **`wallace`** folder type

```bash
yarn spin
```

Wallace will now check for slots once every minute until you tell him not to

To stop Wallace, type press the `control` key and the `c` key concurrently

If you've closed the Terminal and need to get back to the **`wallace`** folder simply type

```bash
cd Desktop/wallace
```

If you've inputted the wrong email or password you can reset Wallace by typing

```bash
yarn reset
```

## Disclaimers

There was not an exorbitant amount of research nor time put into the security of Wallace, so please do be reasonable when using the poor fellow

## License

[GPL-3.0](https://choosealicense.com/licenses/gpl-3.0/)
