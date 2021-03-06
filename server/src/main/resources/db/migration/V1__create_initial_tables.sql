CREATE TABLE IF NOT EXISTS `SKILL_CATEGORY` (
    `ID` INT(11) NOT NULL AUTO_INCREMENT,
    `NAME` VARCHAR(255) NOT NULL,
     PRIMARY KEY (`ID`),
     CONSTRAINT UK_NAME UNIQUE (`NAME`)
) DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `SKILL_TYPE` (
    `ID` INT(11) NOT NULL AUTO_INCREMENT,
    `NAME` VARCHAR(255) NOT NULL,
    `SKILL_CATEGORY_ID` INT(11) NOT NULL,
    CONSTRAINT `SKILL_TYPE_SKILL_CATEGORY_ID_FK`
        FOREIGN KEY (`SKILL_CATEGORY_ID`)
        REFERENCES `SKILL_CATEGORY`(`ID`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    PRIMARY KEY (`ID`),
    CONSTRAINT UK_SKILL_CATEGORY_ID_NAME UNIQUE (`SKILL_CATEGORY_ID`, `NAME`)
) DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `USER` (
    `ID` INT(11) NOT NULL AUTO_INCREMENT,
    `MANAGER_ID` INT(11),
    `FIRST_NAME` VARCHAR(255) NOT NULL,
    `LAST_NAME` VARCHAR(255) NOT NULL,
    `ADDRESS` VARCHAR(255) NOT NULL,
    `EMAIL` VARCHAR(255) NOT NULL UNIQUE,
    `PASSWORD` VARCHAR(255) NOT NULL,
    `LOCATION` VARCHAR(255) NOT NULL,
    `STATUS` VARCHAR(255) NOT NULL,
    `ENABLED` BIT(1) NOT NULL DEFAULT 1,
    CONSTRAINT `USER_MANAGER_ID_FK`
        FOREIGN KEY (`MANAGER_ID`)
        REFERENCES `USER`(`ID`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    PRIMARY KEY (`ID`)
) DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `USER_SKILL` (
    `ID` INT(11) NOT NULL AUTO_INCREMENT,
    `USER_ID` INT(11) NOT NULL,
    `SKILL_TYPE_ID` INT(11) NOT NULL,
    `COMPETENCY` INT NOT NULL DEFAULT 0,
    CONSTRAINT `USER_SKILL_USER_ID_FK`
        FOREIGN KEY (`USER_ID`)
        REFERENCES `USER`(`ID`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT `USER_SKILL_SKILL_TYPE_ID_FK`
        FOREIGN KEY (`SKILL_TYPE_ID`)
        REFERENCES `SKILL_TYPE`(`ID`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    PRIMARY KEY (`ID`),
    CONSTRAINT UK_USER_ID_SKILL_TYPE_ID UNIQUE (`USER_ID`, `SKILL_TYPE_ID`)
) DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `USER_ROLE` (
    `ID` INT(11) NOT NULL AUTO_INCREMENT,
    `USER_ID` INT(11) NOT NULL,
    `ROLE` VARCHAR(255) NOT NULL,
    CONSTRAINT `USER_ROLE_USER_ID_FK`
        FOREIGN KEY (`USER_ID`)
        REFERENCES `USER`(`ID`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    PRIMARY KEY (`ID`),
    CONSTRAINT UK_USER_ID_ROLE UNIQUE (`USER_ID`, `ROLE`)
) DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `CLASSIFICATION` (
    `ID` INT(11) NOT NULL AUTO_INCREMENT,
    `NAME` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`ID`),
    CONSTRAINT UK_NAME UNIQUE (`NAME`)
) DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `PORTFOLIO` (
    `ID` INT(11) NOT NULL AUTO_INCREMENT,
    `MANAGER_ID` INT(11),
    `CLASSIFICATION_ID` INT(11) NOT NULL,
    `NAME` VARCHAR(255) NOT NULL,
    `RAG_STATUS` VARCHAR(255) NOT NULL,     -- Red, Amber, Green
    CONSTRAINT `PORTFOLIO_MANAGER_ID_FK`
        FOREIGN KEY (`MANAGER_ID`)
        REFERENCES `USER`(`ID`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT `PORTFOLIO_CLASSIFICATION_ID_FK`
        FOREIGN KEY (`CLASSIFICATION_ID`)
        REFERENCES `CLASSIFICATION`(`ID`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    PRIMARY KEY (`ID`)
) DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `PROJECT` (
    `ID` INT(11) NOT NULL AUTO_INCREMENT,
    `PORTFOLIO_ID` INT(11) NOT NULL,
    `NAME` VARCHAR(255) NOT NULL,
    `PROJECT_STATUS` VARCHAR(255) NOT NULL,  -- Pipeline, Pre Approval, Seeking Funding, On Hold, Underway, Stopped
    `RAG_STATUS` VARCHAR(255) NOT NULL,      -- Red, Amber, Green
    `BUDGET` DECIMAL(19,2) NOT NULL,
    `SPENT_TO_DATE` DECIMAL(19,2) NOT NULL,
    `ESTIMATE_TO_COMPLETE` DECIMAL(19,2) NOT NULL,
    `MANAGER_ID` INT(11) NOT NULL,
    `COMPLETE` INT NOT NULL,
    `START_DATE` VARCHAR(255) NOT NULL,         -- Duration calculated using START_DATE and END_DATE
    `END_DATE` VARCHAR(255) NOT NULL,
    `GANTT_CHART` BLOB,
    CONSTRAINT `PROJECT_PORTFOLIO_ID_FK`
        FOREIGN KEY (`PORTFOLIO_ID`)
        REFERENCES `PORTFOLIO`(`ID`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT `PROJECT_MANAGER_ID_FK`
        FOREIGN KEY (`MANAGER_ID`)
        REFERENCES `USER`(`ID`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    PRIMARY KEY (`ID`)
) DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `PROJECT_RESOURCE` (
    `ID` INT(11) NOT NULL AUTO_INCREMENT,
    `PROJECT_ID` INT(11) NOT NULL,
    `RESOURCE_ID` INT(11) NOT NULL,
    `ASSIGNED_HOURS` INT NOT NULL,
    `STATUS` VARCHAR(255) NOT NULL,
    CONSTRAINT `PROJECT_RESOURCE_PROJECT_ID_FK`
        FOREIGN KEY (`PROJECT_ID`)
        REFERENCES `PROJECT`(`ID`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT `PROJECT_RESOURCE_RESOURCE_ID_FK`
        FOREIGN KEY (`RESOURCE_ID`)
        REFERENCES `USER`(`ID`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    PRIMARY KEY (`ID`),
    CONSTRAINT UK_PROJECT_ID_RESOURCE_ID UNIQUE (`PROJECT_ID`, `RESOURCE_ID`)
) DEFAULT CHARSET=utf8;
