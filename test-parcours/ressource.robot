*** Settings ***
Library    SeleniumLibrary
Resource          clinique_resource.robot

*** Variables ***
${BROWSER}        Chrome
${URL}            http://localhost:4200

*** Test Cases ***
Resource
    Open Browser    ${URL}    browser=${BROWSER}
    Maximize Browser Window
    sleep    2s
    #Open resource
    Click Element    //*[@id="userActions"]/div[4]/div/div/app-menu/nav/ul/li[10]
    Sleep    2s
    #Create resource
    Click Element    //*[@id="userActions"]/div[4]/div/div/app-menu/nav/ul/li[10]/ul/li[1]
    Sleep    2s 
    Execute JavaScript    window.scrollTo(0, document.body.scrollHeight);
    Click Button    //*[@id="mainSection"]/div/div[2]/form/div/div[2]/button[2]
    Sleep    2s 
    Resource Name    Paracetamol
    Sleep    1s 
    Resource state
    Sleep    1s
    Resource Quantity    100
    Sleep    1s
    #Resource Unity
    Click Element   //*[@id="mat-select-0"]/div/div[2]
    Click Element   //*[@id="mat-option-1"]/span
    Sleep    1s
    Resource Price    e100
    Sleep    1s
    Resource Category    Medecine
    Sleep    1s
    Resource Xtics
    Sleep    3s
    #verification de l'elt enregistrer dans rechercher
    Execute JavaScript    window.scrollTo(0, document.body.scrollHeight);
    Click Element    //*[@id="tableBlock"]/div/mat-paginator/div/div/div[2]/button[4]
    Sleep    2s
    Element Text Should Be      //*[@id="tableBlock"]/div/table/tbody/tr[2]/td[1]  Paracetamol
    Element Text Should Be      //*[@id="tableBlock"]/div/table/tbody/tr[2]/td[2]  false
    Element Text Should Be      //*[@id="tableBlock"]/div/table/tbody/tr[2]/td[3]  100
    Sleep    5s
    Execute JavaScript    window.scrollTo(0, document.body.scrollHeight);
    Sleep    2s 
    #Select itemPerPage
    Sleep    2s 
    Click Element       //*[@id="mat-select-2"]/div
    Sleep    2s 
    #Select itemNumberTen
    Click Element    //*[@id="mat-option-7"]/span
    Sleep    2s 
    #Select itemPerPage
    Click Element   //*[@id="mat-select-2"]/div
    Sleep    2s
    #Select itemNumberFive
    Click Element   //*[@id="mat-option-6"]/span
    sleep     2s
    Input Text    //*[@id="mat-input-1"]    Paracetamol
    Sleep    2s
    Click Element    //*[@id="mat-autocomplete-1"]
    Sleep    2s
    #add Resource
    Click Element    //*[@id="addUserBotton"]
    Sleep    2s
    #return to list
    Execute JavaScript    window.scrollTo(0, document.body.scrollHeight);
    Click Button    //*[@id="mainSection"]/div/div[2]/form/div/div[2]/button[1]
    Sleep    2s 
    #Select Action
    #verification de modifier d'un element existant
    Sleep    3s
    Click Element    //*[@id="triggerId"]
    Click Element    //*[@id="actions"]/div/button/span
    Sleep    2s 
    Input Text    //*[@id="libelle"]    transfusion1
    Sleep    2s 
    Execute JavaScript    window.scrollTo(0, document.body.scrollHeight);
    Click Button    //*[@id="top1"]/div[2]/form/div/div[2]/button[2]
    Sleep    3s 
    Element Text Should Be    //*[@id="tableBlock"]/div/table/tbody/tr[1]/td[1]    transfusion1
    Sleep    2s
    #verification de modifier d'un element cree
    Sleep    3s
    Execute JavaScript    window.scrollTo(0, document.body.scrollHeight);
    Click Element    //*[@id="tableBlock"]/div/mat-paginator/div/div/div[2]/button[4]/span[1]
    Click Element    //*[@id="triggerId"]
    Click Element    //*[@id="actions"]/div/button/span
    Sleep    2s 
    Input Text    //*[@id="libelle"]    paracetamol1
    Sleep    2s 
    Execute JavaScript    window.scrollTo(0, document.body.scrollHeight);
    Click Button    //*[@id="top1"]/div[2]/form/div/div[2]/button[2]
    Sleep    4s
    Execute JavaScript    window.scrollTo(0, document.body.scrollHeight);
    Click Element    //*[@id="tableBlock"]/div/mat-paginator/div/div/div[2]/button[4]/span[1]
    Sleep    3s 
    Element Text Should Be    //*[@id="tableBlock"]/div/table/tbody/tr/td[1]    paracetamol1
    Sleep    2s
    #addUser
    Click Element   //*[@id="addUserBotton"]/span/i
    Execute JavaScript    window.scrollTo(0, document.body.scrollHeight);
    Click Element   //*[@id="top1"]/div[2]/form/div/div[2]/button[1]
    Close Browser 