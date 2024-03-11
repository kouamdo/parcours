*** Settings ***
Library    SeleniumLibrary
Resource          clinique_resource.robot

*** Variables ***
${BROWSER}        Chrome
${URL}            http://localhost:4200

*** Test Cases ***
Famille
    Open Browser    ${URL}    browser=${BROWSER}
    Maximize Browser Window
    sleep     2s
    #Open family menu
    Click Element    //*[@id="userActions"]/div[4]/div/div/app-menu/nav/ul/li[8]
    #Create family
    Click Element    //*[@id="userActions"]/div[4]/div/div/app-menu/nav/ul/li[8]/ul/li[1]
    #Input libelle
    Input Text    //*[@id="libelle"]    Youdjeu
    #Input Description
    Input Text    //*[@id="description"]    Pere de famille avec maux de tete
    #Input Etat
    Click Element    //*[@id="etat"]    
    #button envoyer 
    Click Button    //*[@id="mainSection"]/div/div[2]/form/div[2]/button[2]
    Sleep    2s
    Execute JavaScript    window.scrollTo(0, document.body.scrollHeight);
    Sleep    2s
    Select itemPerPage
    Sleep    2s 
    Select itemNumberTwenty
    Sleep    2s 
    Element Text Should Be    //*[@id="tableBlock"]/div/table/tbody/tr[6]/td[1]    Youdjeu
    Element Text Should Be    //*[@id="tableBlock"]/div/table/tbody/tr[6]/td[2]    Pere de famille avec maux de tete
    Element Text Should Be    //*[@id="tableBlock"]/div/table/tbody/tr[6]/td[3]    false
    Select itemPerPage
    Sleep    2s 
    Select itemNumberTen
    Sleep    2s 
    Select itemPerPage
    Sleep    3s
    Select itemNumberFive
    sleep     3s
    Search Patient    Youdjeu
    Sleep    2s
    Click Element    //*[@id="mat-autocomplete-0"]
    Sleep    1s
    Element Text Should Be    //*[@id="tableBlock"]/div/table/tbody/tr[1]/td[1]    Youdjeu
    #add Family
    Click Element    //*[@id="addUserBotton"]
    Sleep    2s
    #search family
    Click Element    //*[@id="userActions"]/div[4]/div/div/app-menu/nav/ul/li[8]/ul/li[2]
    Sleep    3s
    #Select Action
    #verification de modifier d'un element existant
    Sleep    3s
    Click Element    //*[@id="triggerId"]
    Click Element    //*[@id="actions"]/div/button/span
    Sleep    2s 
    Input Text    //*[@id="libelle"]    trans1
    Sleep    2s 
    Click Button    //*[@id="top2"]/div[2]/form/div[2]/button[2]
    Sleep    3s 
    Element Text Should Be    //*[@id="tableBlock"]/div/table/tbody/tr[1]/td[1]    trans1
    Sleep    2s
    #verification de modifier d'un element cree
    Sleep    3s
    Execute JavaScript    window.scrollTo(0, document.body.scrollHeight);
    Click Element    //*[@id="tableBlock"]/div/mat-paginator/div/div/div[2]/button[4]/span[1]
    Click Element    //*[@id="triggerId"]
    Click Element    //*[@id="actions"]/div/button/span
    Sleep    2s 
    Input Text    //*[@id="libelle"]    Youdjeu1
    Sleep    2s 
    Click Button    //*[@id="top2"]/div[2]/form/div[2]/button[2]
    Sleep    4s
    Execute JavaScript    window.scrollTo(0, document.body.scrollHeight);
    Click Element    //*[@id="tableBlock"]/div/mat-paginator/div/div/div[2]/button[4]/span[1]
    Sleep    3s 
    Element Text Should Be    //*[@id="tableBlock"]/div/table/tbody/tr/td[1]    Youdjeu1
    Sleep    2s
    
    Close Browser