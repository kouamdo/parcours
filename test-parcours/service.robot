*** Settings ***
Library    SeleniumLibrary
Resource          clinique_resource.robot

*** Variables ***
${BROWSER}        Chrome
${URL}            http://localhost:4200

*** Test Cases ***
Service
    Open Browser    ${URL}    browser=${BROWSER}
    Maximize Browser Window
    sleep     2s
    Click Element    //*[@id="userActions"]/div[4]/div/div/app-menu/nav/ul/li[3]
    sleep     2s
    Click Element    //*[@id="userActions"]/div[4]/div/div/app-menu/nav/ul/li[3]/ul/li[1]
    Sleep    2s
    Click Element    //*[@id="mainSection"]/div/div[2]/form/div[2]/button[2]
    Element Text Should Be    //*[@id="mainSection"]/div/div[2]/form/div[1]/div/div[1]/div/div[2]    Le libelle est obligatoire.
    Sleep    1s
    Click Element    //*[@id="mainSection"]/div/div[2]/form/div[2]/button[1]
    Title Should Be    Recherche de services

    Click Element    //*[@id="userActions"]/div[4]/div/div/app-menu/nav/ul/li[3]
    #Create Service    Massage
    Sleep    1s
    Input Text  //*[@id="libelle"]  Massage
    Click Element  //*[@id="etat"]   
    Input Text  //*[@id="localisation"]    dla
    Input Text  //*[@id="description"]    bien
    Execute JavaScript    window.scrollTo(0, document.body.scrollHeight);
    Click Element    //*[@id="top2"]/div[2]/form/div[2]/button[2]
    Sleep    2s
    Element Text Should Be    //*[@id="tableBlock"]/div/table/tbody/tr[4]/td[1]    Massage
    Element Text Should Be    //*[@id="tableBlock"]/div/table/tbody/tr[4]/td[2]    false
    Element Text Should Be    //*[@id="tableBlock"]/div/table/tbody/tr[4]/td[3]    dla
    Element Text Should Be    //*[@id="tableBlock"]/div/table/tbody/tr[4]/td[4]    bien
    Execute JavaScript    window.scrollTo(0, document.body.scrollHeight);
    Sleep    4s
    Click Element    //*[@id="mat-select-2"]
    sleep    1s
    Click Element    //*[@id="mat-option-3"]
    sleep    1s
    ${table} =    Get WebElement    xpath=//*[@id="tableBlock"]/div/table
    ${rows} =    Get WebElements    xpath=//*[@id="tableBlock"]/div/table/tbody/tr
    ${row_count} =    Get Length    ${rows}
    Log    Actual row count: ${row_count}
    Should Be True    ${row_count} <= 5
    Sleep    2s 
    #Select itemPerPage
    Click Element    //*[@id="mat-select-2"]
    Sleep    1s
    #Select itemNumberTen
    Click Element    //*[@id="mat-option-4"]
    sleep    1s
    ${table} =    Get WebElement    xpath=//*[@id="tableBlock"]/div/table
    ${rows} =    Get WebElements    xpath=//*[@id="tableBlock"]/div/table/tbody/tr 
    ${row_count} =    Get Length    ${rows}
    Should Be True    ${row_count} <= 10
    Sleep    1s
    #Select itemPerPage  
    Click Element    //*[@id="mat-select-2"]
    Sleep    1s
    #Select itemNumberTwenty
    Click Element    //*[@id="mat-option-5"]
    sleep    1s
    ${table} =    Get WebElement    xpath=//*[@id="tableBlock"]/div/table
    ${rows} =    Get WebElements    xpath=//*[@id="tableBlock"]/div/table/tbody/tr 
    ${row_count} =    Get Length    ${rows}
    Log    Actual row count: ${row_count}
    Should Be True    ${row_count} <= 20
    Search Service    Massag
    Sleep    2s
    Element Text Should Be    //*[@id="mat-autocomplete-1"]        Massage   
    Click Element    //*[@id="mat-autocomplete-1"]
    Sleep    2s
    #verification de modifier d'un element créé
    Sleep    3s
    Click Element    //*[@id="triggerId"]
    Click Element    //*[@id="actions"]/div/button/span
    Sleep    2s 
    Input Text    //*[@id="libelle"]    Massage1
    Sleep    2s 
    Click Button    //*[@id="top2"]/div[2]/form/div[2]/button[2]
    Sleep    2s 
    Element Text Should Be    //*[@id="tableBlock"]/div/table/tbody/tr[4]/td[1]    Massage1
    #verification de modifier d'un element existant
    Sleep    3s
    Click Element    //*[@id="triggerId"]
    Click Element    //*[@id="actions"]/div/button/span
    Sleep    2s 
    Input Text    //*[@id="libelle"]    Pharmacie1
    Sleep    2s 
    Click Button    //*[@id="top2"]/div[2]/form/div[2]/button[2]
    Sleep    2s 
    Element Text Should Be    //*[@id="tableBlock"]/div/table/tbody/tr[1]/td[1]    Pharmacie1
    Sleep    3s
    #Add User
    Goto Next Page
    Input Text    //*[@id="libelle"]    new
    #Return
    Click Button    //*[@id="mainSection"]/div/div[2]/form/div[2]/button[1]
    sleep    2s
    Execute JavaScript    window.scrollTo(0, document.body.scrollHeight);
    #Goto Last Page
    #Sleep    2s 
    #Goto First Page
    sleep    5s
    Close Browser