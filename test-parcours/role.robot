*** Settings ***
Library    SeleniumLibrary
Resource          clinique_resource.robot

*** Variables ***
${BROWSER}        Chrome
${URL}            http://localhost:4200

*** Test Cases ***
Role
    Open Browser    ${URL}    browser=${BROWSER}
    Maximize Browser Window
    Title Should Be    Clinique
    Sleep    1s
    Click Element    //*[@id="userActions"]/div[4]/div/div/app-menu/nav/ul/li[9]/a/p/i
    Click Element    //*[@id="userActions"]/div[4]/div/div/app-menu/nav/ul/li[9]/ul/li[1]/a/p
    Execute JavaScript    window.scrollTo(0, document.body.scrollHeight);
    click Button     //*[@id="top2"]/div[2]/form/div[2]/button[2]       #verification des msg d'erreur bouton ajouter
    Sleep    5s
    #entrer des données dans l'interface creer
    Input Text  //*[@id="titre"]  maeva
    Click Element    //*[@id="etat"]
    Input Text  //*[@id="description"]    desc
    Execute JavaScript    window.scrollTo(0, document.body.scrollHeight);
    click Button     //*[@id="top2"]/div[2]/form/div[2]/button[2]   #click du bouton ajouter pour rechercher
    #verification de l'elt enregistrer dans rechercher
    Sleep    2s
    Element Text Should Be      //*[@id="tableBlock"]/div/table/tbody/tr[4]/td[1]   maeva
    Element Text Should Be      //*[@id="tableBlock"]/div/table/tbody/tr[4]/td[2]   desc
    Element Text Should Be      //*[@id="tableBlock"]/div/table/tbody/tr[4]/td[3]   false 
    Sleep    5s 
    Execute JavaScript    window.scrollTo(0, document.body.scrollHeight);
    Select itemPerPage
    Sleep    2s 
    Select itemNumberTen
    Sleep    2s 
    Select itemPerPage
    Sleep    3s
    Select itemNumberFive
    #autocomplexion pour un elt cree
    sleep     3s
    Click Element   //*[@id="mat-input-0"]  
    Input Text  //*[@id="mat-input-0"]      maeva
    Sleep    2s
    Click Element   //*[@id="mat-autocomplete-0"]
    Sleep    1s
    #verification de modifier d'un element cree
    Click Element    //*[@id="triggerId"]
    Click Element    //*[@id="actions"]/div/button/span
    Sleep    2s 
    Input Text      //*[@id="titre"]    mazz1
    Sleep    2s 
    Click Button    //*[@id="top2"]/div[2]/form/div[2]/button[2]
    Sleep    3s
    Element Text Should Be    //*[@id="tableBlock"]/div/table/tbody/tr[4]/td[1]    mazz1
    #addUser
    Click Element   //*[@id="addUserBotton"]/span/i
    Sleep    2s
    Input Text  //*[@id="titre"]    yop   
    Input Text  //*[@id="description"]    descip
    Sleep    2s 
    Execute JavaScript    window.scrollTo(0, document.body.scrollHeight);
    Click Button    //*[@id="top2"]/div[2]/form/div[2]/button[2]
    Sleep    3s
    #autocomplexion pour un elt existant
    #Sleep    2s
    #Click Element   //*[@id="mat-input-2"]
    #Input Text      //*[@id="mat-input-2"]     vendeur
    #Click Element   //*[@id="mat-autocomplete-2"]
    #verification de modifier d'un element existant
    Click Element    //*[@id="triggerId"]
    Click Element    //*[@id="actions"]/div/button/span
    Sleep    2s 
    Input Text    //*[@id="titre"]   vendeur1
    Sleep    2s 
    Click Button    //*[@id="top2"]/div[2]/form/div[2]/button[2]
    Sleep    3s 
    Element Text Should Be    //*[@id="tableBlock"]/div/table/tbody/tr[1]/td[1]    vendeur1
    Sleep    3s
    #addUser
    Click Element   //*[@id="addUserBotton"]/span/i
    Click Element   //*[@id="top2"]/div[2]/form/div[2]/button[1]
