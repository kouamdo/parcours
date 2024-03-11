*** Settings ***
Library           SeleniumLibrary
Library           OperatingSystem
Resource          clinique_resource.robot

*** Variables ***
${BROWSER}        Chrome
${URL}            http://localhost:4200/list-patients

*** Test Cases ***
Open Patient Page
    Open Browser    ${URL}    browser=${BROWSER}
    Maximize Browser Window
    Title Should Be    Recherche de patients
    Sleep    3s
    Click Element    /html/body/app-root/div/div[2]/div/div/div/div[2]/ol/li[1]/a