*** Settings ***
Library    SeleniumLibrary
Resource          clinique_resource.robot

*** Variables ***
${BROWSER}        Chrome
${URL}            http://localhost:4200

*** Test Cases ***
Personnel
    Open Browser    ${URL}    browser=${BROWSER}
    Maximize Browser Window
    Title Should Be    Clinique
    Sleep    1s
    Click Element    //*[@id="userActions"]/div[4]/div/div/app-menu/nav/ul/li[2]/a/p/i
    Click Element    //*[@id="userActions"]/div[4]/div/div/app-menu/nav/ul/li[2]/ul/li[1]/a/p
    Execute JavaScript    window.scrollTo(0, document.body.scrollHeight);
    click Button     //*[@id="top2"]/div[2]/form/div[2]/button[2]       #verification des msg d'erreur bouton ajouter
    Sleep    5s
    #entrer des données dans l'interface creer
    Input Text  //*[@id="nom"]  maeva
    Input Text  //*[@id="prenom"]  mae
    Select From List by Value    //*[@id="sexe"]    F 
    Input Text  //*[@id="email"]  maeva@yahoo.fr
    Input Text  //*[@id="telephone"]  600000000
    Execute JavaScript    window.scrollTo(0, document.body.scrollHeight);
    click Button     //*[@id="top2"]/div[2]/form/div[2]/button[2]   #click du bouton ajouter pour rechercher 
    #verification de l'elt enregistrer dans rechercher 
    Sleep    2s
    Element Text Should Be      //*[@id="tableBlock"]/div/table/tbody/tr[2]/td[1]   maeva
    Element Text Should Be      //*[@id="tableBlock"]/div/table/tbody/tr[2]/td[2]   mae
    Sleep    5s 
    Execute JavaScript    window.scrollTo(0, document.body.scrollHeight);
    Sleep    3s
    Select itemPerPage
    Sleep    2s 
    Select itemNumberTwenty
    Sleep    2s 
    Select itemPerPage
    Sleep    2s 
    Select itemNumberTen
    Sleep    2s 
    Select itemPerPage
    Sleep    2s
    Select itemNumberFive
    #autocomplexion pour un elt cree
    Click Element   //*[@id="mat-input-0"]  
    Input Text  //*[@id="mat-input-0"]     maeva
    Sleep    2s
    Click Element   //*[@id="mat-autocomplete-0"]
    Sleep    2s
    #verification de modifier d'un element cree
    Click Button    //*[@id="triggerId"]
    Click Button    //*[@id="actions"]/div/button[1]
    Sleep    2s 
    Input Text    //*[@id="prenom"]    mae1
    Sleep    2s 
    Execute JavaScript    window.scrollTo(0, document.body.scrollHeight);
    Sleep    2s
    Click Button    //*[@id="top2"]/div[2]/form/div[2]/button[2]
    Sleep    2s 
    Element Text Should Be    //*[@id="tableBlock"]/div/table/tbody/tr[2]/td[2]    mae1
    Sleep    3s
    #addUser
    Click Element    //*[@id="addUserBotton"]/span/i
    Sleep    2s 
    Input Text    //*[@id="nom"]    maeva
    Input Text    //*[@id="prenom"]    mae
    Select From List by Value    //*[@id="sexe"]    F
    Input Text  //*[@id="email"]  maeva@yahoo.fr
    Input Text  //*[@id="telephone"]  600000000
    Execute JavaScript    window.scrollTo(0, document.body.scrollHeight);
    Click Button    //*[@id="top2"]/div[2]/form/div[2]/button[2]
    Sleep    3s
    #autocomplexion pour un elt existant
    #Sleep    2s
    #Click Element   //*[@id="mat-input-2"]
    #Input Text      //*[@id="mat-input-2"]     Tagne
    #Click Element   //*[@id="mat-autocomplete-0"]
    #verification de modifier d'un element existant
    Click Element    //*[@id="triggerId"]
    Click Element    //*[@id="actions"]/div/button/span
    Sleep    2s 
    Input Text    //*[@id="nom"]   Tagne1
    Sleep    2s 
    Execute JavaScript    window.scrollTo(0, document.body.scrollHeight);
    Click Button    //*[@id="top2"]/div[2]/form/div[2]/button[2]
    Sleep    3s 
    Element Text Should Be    //*[@id="tableBlock"]/div/table/tbody/tr[1]/td[1]    Tagne1
    #addUser
    Click Element   //*[@id="addUserBotton"]/span/i
    Execute JavaScript    window.scrollTo(0, document.body.scrollHeight);
    Click Element   //*[@id="top2"]/div[2]/form/div[2]/button[1]
    
    

