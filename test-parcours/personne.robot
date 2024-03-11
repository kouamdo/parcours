*** Settings ***
Library    SeleniumLibrary
Resource          clinique_resource.robot

*** Variables ***
${BROWSER}        Chrome
${URL}            http://localhost:4200

*** Test Cases ***
Persone
    Open Browser    ${URL}    browser=${BROWSER}
    Maximize Browser Window
    Title Should Be    Clinique 
    #Click Element    /html/body/app-root/div/nav/ul[2]/li[4]
    #sleep    2s
    Sleep    1s
    Click Element    //*[@id="userActions"]/div[4]/div/div/app-menu/nav/ul/li[1]
    Click Element    //*[@id="userActions"]/div[4]/div/div/app-menu/nav/ul/li[1]/ul/li[1]
    #Click Dropdown Item
    Execute JavaScript    window.scrollTo(0, document.body.scrollHeight);
    Submit Patient
    Sleep    1s
    Input Text    //*[@id='nom']    Youdjeu
    Input prenom    Maeva
    Select Sex
    Seleck Male
    Select Dob
    Input Mail    maevaYoudjeu@gmail.com
    Input Telephone    658469598
    Input Adresse    Douala
    Submit Patient
    Sleep    2s 
    ${unique_value} =    Get Text    xpath=//*[@id="tableBlock"]/div/table/tbody/tr[1]/td[1]  # Get a unique value
    Execute JavaScript    window.scrollTo(0, document.body.scrollHeight);
    Sleep    1s
    Next
    ${new_value} =    Get Text    //*[@id="tableBlock"]/div/table/tbody/tr[1]/td[1] 
    Should Not Be Equal    ${unique_value}    ${new_value}  
    Sleep    1s
    
    Sleep    1s
    Goto Previous Page
    Sleep    1s
    Goto Last Page
    Sleep    2s 
    Element Text Should Be    //*[@id="tableBlock"]/div/table/tbody/tr[5]/td[1]    Youdjeu
    Sleep    1s
    Element Text Should Be    //*[@id="tableBlock"]/div/table/tbody/tr[5]/td[2]    Maeva
    Sleep    1s
    Element Text Should Be    //*[@id="tableBlock"]/div/table/tbody/tr[5]/td[4]    M 
    Element Text Should Be    //*[@id="tableBlock"]/div/table/tbody/tr[5]/td[5]    maevaYoudjeu@gmail.com
    Element Text Should Be    //*[@id="tableBlock"]/div/table/tbody/tr[5]/td[6]    Douala
    Element Text Should Be    //*[@id="tableBlock"]/div/table/tbody/tr[5]/td[7]    658469598
    
    #Select Action 
    Goto First Page
    sleep    1s
    Select itemPerPage
    sleep    1s
    Select itemNumberFive 
    sleep    1s
    ${table} =    Get WebElement    xpath=//*[@id="tableBlock"]/div/table
    ${rows} =    Get WebElements    xpath=//*[@id="tableBlock"]/div/table/tbody/tr
    ${row_count} =    Get Length    ${rows}
    Log    Actual row count: ${row_count}
    Should Be True    ${row_count} <= 5
    Sleep    2s 
    Select itemPerPage
    Sleep    1s
    Select itemNumberTen
    sleep    1s
    ${table} =    Get WebElement    xpath=//*[@id="tableBlock"]/div/table
    ${rows} =    Get WebElements    xpath=//*[@id="tableBlock"]/div/table/tbody/tr 
    ${row_count} =    Get Length    ${rows}
    Should Be True    ${row_count} <= 10
    Sleep    1s
    Select itemPerPage
    Sleep    1s
    Select itemNumberTwenty
    sleep    1s
    ${table} =    Get WebElement    xpath=//*[@id="tableBlock"]/div/table
    ${rows} =    Get WebElements    xpath=//*[@id="tableBlock"]/div/table/tbody/tr 
    ${row_count} =    Get Length    ${rows}
    Log    Actual row count: ${row_count}
    Should Be True    ${row_count} <= 20
    Sleep    1s
    Search Patient    Youdj
    Sleep    1s
    Element Text Should Be    //*[@id="mat-autocomplete-0"]    Youdjeu
    Click Element    //*[@id="mat-autocomplete-0"]
    Sleep    2s 
    ${fname}    Get Text    //*[@id="tableBlock"]/div/table/tbody/tr/td[1]
    Log    Text from name table is ${fname}
    Element Text Should Be    //*[@id="tableBlock"]/div/table/tbody/tr/td[1]    Youdjeu
    Element Text Should Be    //*[@id="tableBlock"]/div/table/tbody/tr/td[2]    Maeva
    Element Text Should Be    //*[@id="tableBlock"]/div/table/tbody/tr/td[4]    M
    Element Text Should Be    //*[@id="tableBlock"]/div/table/tbody/tr/td[5]    maevaYoudjeu@gmail.com
    Element Text Should Be    //*[@id="tableBlock"]/div/table/tbody/tr/td[6]    Douala
    Element Text Should Be    //*[@id="tableBlock"]/div/table/tbody/tr/td[7]    658469598
    Sleep    1s
    #Select Action
    #verification de modifier d'un element cree
    Sleep    3s
    Execute JavaScript    window.scrollTo(0, document.body.scrollHeight);
    Click Element    //*[@id="tableBlock"]/div/mat-paginator/div/div/div[2]/button[4]/span[1]
    Click Button    //*[@id="triggerId"]
    Click Button    //*[@id="actions"]/div/button[2]
    Sleep    2s 
    Input Text    //*[@id="nom"]    mae1
    Sleep    2s 
    Execute JavaScript    window.scrollTo(0, document.body.scrollHeight);
    Sleep    2s
    Click Button    //*[@id="top2"]/div[2]/form/div[2]/button[2]
    Sleep    4s
    Execute JavaScript    window.scrollTo(0, document.body.scrollHeight);
    Click Element    //*[@id="tableBlock"]/div/mat-paginator/div/div/div[2]/button[4]/span[1]
    Sleep    2s 
    Element Text Should Be    //*[@id="tableBlock"]/div/table/tbody/tr[5]/td[1]    mae1
    #verification de modifier d'un element existant
    Sleep    3s
    Click Element    //*[@id="triggerId"]
    Click Element    //*[@id="actions"]/div/button[2]
    Sleep    2s 
    Input Text    //*[@id="nom"]    trans1
    Sleep    2s 
    Execute JavaScript    window.scrollTo(0, document.body.scrollHeight);
    Click Button    //*[@id="top2"]/div[2]/form/div[2]/button[2]
    Sleep    4s
    Execute JavaScript    window.scrollTo(0, document.body.scrollHeight);
    Click Element    //*[@id="tableBlock"]/div/mat-paginator/div/div/div[2]/button[4]/span[1]
    Sleep    2s 
    Element Text Should Be    //*[@id="tableBlock"]/div/table/tbody/tr[1]/td[1]    trans1

    Click Element    //*[@id="triggerId"]
    Click Element    //*[@id="actions"]/div/button[2]
    Sleep    2s
    Execute JavaScript    window.scrollTo(0, document.body.scrollHeight);
    Click Element    //*[@id="top2"]/div[2]/form/div[2]/button[1]
    Sleep    3s
    Scroll Element Into View    //*[@id="addUserBotton"]/span    
    #Execute JavaScript    window.scrollTo(0, document.body.scrollHeight);
    Click Element    //*[@id="addUserBotton"]/span
    Title Should Be    Enregistrer un nouveau patient
    Sleep    1s
    Execute JavaScript    window.scrollTo(0, document.body.scrollHeight);
    Click Element    //*[@id="top2"]/div[2]/form/div[2]/button[1]
    Sleep    2s 


    Goto Next Page
    Sleep    2s
    Execute JavaScript    window.scrollTo(0, document.body.scrollHeight);
    Return To List
    Sleep    3s 
    #Input Text    //*[@id="mat-input-0"]    Mougoue
    #Sleep    2s 
    #Click Element    //*[@id="mat-autocomplete-0"]
    Sleep    2s 
    Select Action 
    Sleep    3s
    Action Orienter
    Sleep    2s
    Cancel Ticket
    Select Action
    Action Orienter 
    Sleep    5s
    #Scroll Element Into View    //*[@id="top2"]/div/label[2] 
    #Execute JavaScript    window.scrollTo(0, document.body.scrollHeight);
    #Click Element    //*[@value="Laboratoire"]/div/label[2]   #bouton laboratoire
    Click Button    //*[@id="mat-dialog-1"]/app-new-ticket/div/form/div[2]/div/button[2]    #bouton enregistrer 
    Click Button    //*[@id="mat-dialog-1"]/app-new-ticket/div/form/div[2]/div/button[1]    #bouton precedent
    #Click Element   //*[@value="Laboratoire"]/div/label[2]     #bouton laboratoire
    Click Button    //*[@id="mat-dialog-1"]/app-new-ticket/div/form/div[2]/div/button[2]    #bouton enregistrer 
    Click Button    //*[@id="mat-dialog-1"]/app-new-ticket/div/form/div[2]/div/button[2]    #bouton imprimer
    Sleep    3s
    Scroll Element Into View    //*[@id="sidebar"]/div[3]/div/button[1]  
    Execute JavaScript    window.scrollTo(0, document.body.scrollHeight);
    #Click Button    //*[@id="sidebar"]/div[3]/div/button[2]    #bouton Cancel
    Click Button    //*[@id="sidebar"]/div[3]/div/button[1]    #bouton print

    
    Close Browser



