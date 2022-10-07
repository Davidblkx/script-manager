# For release 1.0

## Basic features
-
- [x] Logger
  - [x] Has levels
  - [x] Support collored output
- [x] Add core actions
  - [x] Get/Set folder (with move option)
  - [x] Get/Set editor (multiple args split by comma)
  - [x] Create/Delete Targets
  - [x] Get/Set default Targets
  - [x] Edit target configs
- [x] Add UNIT config support
  - [x] List available UNITS
  - [x] Add from a list of core UNITS
  - [x] Get description, name, status, all
  - [x] Enable/Disable UNIT
  - [x] Set/Delete UNIT settings
  - [x] Add help support
  - [x] Add command hooks
- [ ] UNITS
  - [ ] BIN
    - [ ] INIT: Create BIN folder, add to PATH
    - [ ] SYNC: Set top files as executable and add to PATH
    - [ ] NEW: Create new file in BIN folder
  - [ ] GIT
    - [ ] INIT: Create git repo, add entry to readme, set remote repository
    - [ ] DOWNLOAD: pull rebase from remote
    - [ ] UPLOAD: push to remote (allow to force)
    - [ ] SYNC: pull rebase from remote, push force to remote
    - [ ] CLEAN: remove all untracked files
    - [ ] STATUS: show status

# Improvements

- [ ] Add support for multiple config files
- [ ] Remove dependency on `tty`
- [ ] Add settings manager to easly add new settings
