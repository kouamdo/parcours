*** Settings ***
Library    SeleniumLibrary
Resource          clinique_resource.robot

*** Variables ***
${BROWSER}        Chrome
${URL}            http://localhost:4200

*** Test Cases ***
Distributor
    Open Browser    ${URL}    browser=${BROWSER}
    Maximize Browser Window
    sleep    1s
    #menu distributeur
    Click Element    //*[@id="userActions"]/div[4]/div/div/app-menu/nav/ul/li[12]
    #create description
    Sleep    2s 
    Execute JavaScript    window.scrollBy(0, 1000);
    Click Element    //*[@id="userActions"]/div[4]/div/div/app-menu/nav/ul/li[12]/ul/li[1]
    Sleep    2s 
    Click Button    //*[@id="mainSection"]/div/div[2]/form/div[2]/button[2]
    Input Text    //*[@id="raisonSocial"]    Distributeur de Paracetamol
    Input Text    //*[@id="adresse"]    Logbessou-Douala
    Input Text    //*[@id="telephone"]    658469897
    Input Text    //*[@id="mail"]    maeva@gmail.com
    Sleep    2s 
    Click Button    //*[@id="mainSection"]/div/div[2]/form/div[2]/button[2]
    Sleep    2s 
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
    Input Text    //*[@id="mat-input-0"]    Distributeur de Para
    Sleep    3s
    Click Element    //*[@id="mat-autocomplete-0"]
    Sleep    2s
    #add Resource
    Click Element    //*[@id="addUserBotton"]
    Sleep    2s 
    Input Text    //*[@id="raisonSocial"]    Distributeur de Metronidazole
    Input Text    //*[@id="adresse"]    Yaounde
    Input Text    //*[@id="telephone"]    658469897
    Input Text    //*[@id="mail"]    maevaYoudjeu@gmail.com 
    Click Button    //*[@id="mainSection"]/div/div[2]/form/div[2]/button[2]
    Sleep    2s
    Click Element    //*[@id="addUserBotton"] 
    Click Button    //*[@id="mainSection"]/div/div[2]/form/div[2]/button[1]
    Execute JavaScript    window.scrollTo(0, document.body.scrollHeight);
    Sleep    3s
    Click Button    //*[@id="triggerId"]
    Click Button    //*[@id="actions"]/div/button[1]
    Sleep    2s 
    Input Text    //*[@id="adresse"]    Logbessousou
    Sleep    2s 
    Click Button    //*[@id="mainSection"]/div/div[2]/form/div[2]/button[2]
    Sleep    2s 
    Element Text Should Be    //*[@id="tableBlock"]/div/table/tbody/tr[1]/td[3]    Logbessousou
    Execute JavaScript    window.scrollTo(0, document.body.scrollHeight);