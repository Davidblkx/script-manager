# For release 1.0

## Basic features
-
- [X] Logger
  - [X] Has levels
  - [X] Support collored output
- [ ] Add core actions
  - [ ] Get/Set folder (with move option)
  - [ ] Get/Set editor (multiple args split by comma)
  - [ ] Create/Delete Targets
  - [ ] Get/Set default Targets
  - [ ] Edit target configs
- [ ] Add UNIT config support
  - [ ] List available UNITS
  - [ ] Add from a list of core UNITS
  - [ ] Get description, name, status, all
  - [ ] Enable/Disable UNIT
  - [ ] Set/Delete UNIT settings
  - [ ] Add help support
  - [ ] Add command hooks
- [ ] UNITS
  - [ ] BIN
    - [ ] INIT: Create BIN folder, add to PATH
    - [ ] SYNC: Set top files as executable and add to PATH
    - [ ] NEW: Create new file in BIN folder
  - [ ] GIT
    - [ ] INIT: Create git repo, add readme me, set remote repository
    - [ ] UPDATE: pull rebase from remote
    - [ ] UPLOAD: push to remote (allow to force)
    - [ ] SYNC: pull rebase from remote, push force to remote
    - [ ] CLEAN: remove all untracked files
    - [ ] SAVE: commit all changes
    - [ ] STATUS: show status

# Improvements

- [X] Add support for multiple config files
- [X] Add support for GLOBAL option
- [ ] Remove dependency on `tty`
- [X] Add settings manager to easly add new settings
