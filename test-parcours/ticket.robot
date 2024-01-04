*** Settings ***
Library    SeleniumLibrary
Resource          clinique_resource.robot

*** Variables ***
${BROWSER}        Chrome
${URL}            http://localhost:4200

*** Test Cases ***
Ticket
    Open Browser    ${URL}    browser=${BROWSER}
    Maximize Browser Window
    sleep     2s
    Open Ticket Menu
    sleep     1s
    Search
    Sleep    5s
    Execute JavaScript    window.scrollTo(0, document.body.scrollHeight);
    Sleep    3s
    Select itemPerPage
    Sleep    2s 
    Select itemNumberTwenty
    Sleep    2s 
    ${table} =    Get WebElement    xpath=//*[@id="tableBlock"]/div/table
    ${rows} =    Get WebElements    xpath=//*[@id="tableBlock"]/div/table/tbody/tr 
    ${row_count} =    Get Length    ${rows}
    Should Be True    ${row_count} <= 20
    Select itemPerPage
    Sleep    2s 
    Select itemNumberTen
    Sleep    2s 
    ${table} =    Get WebElement    xpath=//*[@id="tableBlock"]/div/table
    ${rows} =    Get WebElements    xpath=//*[@id="tableBlock"]/div/table/tbody/tr 
    ${row_count} =    Get Length    ${rows}
    Should Be True    ${row_count} <= 10
    Select itemPerPage
    Sleep    3s
    Select itemNumberFive
    sleep     3s
    ${table} =    Get WebElement    xpath=//*[@id="tableBlock"]/div/table
    ${rows} =    Get WebElements    xpath=//*[@id="tableBlock"]/div/table/tbody/tr 
    ${row_count} =    Get Length    ${rows}
    Should Be True    ${row_count} <= 5
    Next
    Sleep    3s
    Goto Previous Page
    Sleep    3s
    Goto Last Page
    sleep    3s
    Goto First Page
    Sleep    3s
    Search Ticket    20221206S1A01
    sleep     3s
    Select 
    Sleep	1s
    Element Text Should Be    //*[@id="tableBlock"]/div/table/tbody/tr[1]/td[2]    20221206S1A01
    Sleep    3s
    Ticket Actions
    Sleep    2s
    Ticket Print
    Sleep    5s
    #${handles}=  Get Window Handles
    #Switch Window  ${handles}[0]
    Sleep    2s
    Show Panel
    Sleep    3s
    Expand Panel
    Sleep    3s
    Expand Panel
    Sleep    3s
    Search
    Sleep    2s
    Close Browser