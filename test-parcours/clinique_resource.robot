*** keywords ***


Input Prenom
    [Arguments]    ${prenom}
    Input Text    prenom     ${prenom}

Select Sex
    Click Element    sexe

Seleck Male
    Click Element    //*[@id="sexe"]/option[1]

Select Dob
    Click Element    dateNaissance

Input Mail
    [Arguments]    ${email}  
    Input Text    mail    ${email}

Input Telephone
    [Arguments]    ${phoneNumber} 
    Input Text    telephone    ${phoneNumber} 

Input Adresse
    [Arguments]    ${adresse} 
    Input Text    adresse    ${adresse} 

Submit Patient
    Click Button    //*[@id="mainSection"]/div/div[2]/form/div[2]/button[2]


Select itemNumberFive
    Click Element    //*[@id="mat-option-0"]/span
    

Select itemNumberTen
    Click Element    //*[@id="mat-option-1"]/span 
    

Select itemNumberTwenty
    Click Element    //*[@id="mat-option-2"]/span

Next
    Click Element    //*[@id="tableBlock"]/div/mat-paginator/div/div/div[2]/button[3]

Goto Next Page
    Click Element    //*[@id="addUserBotton"]/span/i

Goto Last Page
    Click Element    //*[@id="tableBlock"]/div/mat-paginator/div/div/div[2]/button[4]

Goto Previous Page
    Click Element    //*[@id="tableBlock"]/div/mat-paginator/div/div/div[2]/button[2]

Goto First Page
    Click Element    //*[@id="tableBlock"]/div/mat-paginator/div/div/div[2]/button[1]

Select itemPerPage
    Click Element    //*[@id="mat-select-0"]/div
    
    
Return To List
    Click Element    //*[@id="mainSection"]/div/div[2]/form/div[2]/button[1]

Search Patient
    [Arguments]    ${patientName}
    Input Text    //*[@id="mat-input-0"]    ${patientName}   

Select Action 
    Click Element    //*[@id="triggerId"]

Action Orienter
    Click Button    //*[@id="actions"]/div/button[1]
Cancel Ticket
    Click Button    //*[@id="mat-dialog-0"]/app-new-ticket/div/form/div[2]/div/button[1]
Select Ticket
    Click Element    //*[@id="mainSection"]/div/div[2]/div/label[1]
Save Ticket
    Click Button    //*[@id="mat-dialog-1"]/app-new-ticket/div/form/div[2]/div/button[2]
Previous
    Click Button    //*[@id="mat-dialog-1"]/app-new-ticket/div/form/div[2]/div/button[1]
Print Ticket
    Click Button    //*[@id="modelTicket"]/app-new-ticket/div/form/div[2]/div/button[2]
Print
    Click Button    //*[@id="modelTicket"]/app-new-ticket/div/form/div[2]/div/button[2]
Cancel
    Click Button    //*[@id="mainSection"]/div/div[1]/button

Action View
    Click Button    //*[@id="actions"]/div/button[2]
Research
    Click Element    //*[@id="userActions"]/div[4]/div/div/app-menu/nav/ul/li[1]/ul/li[2]/a

Action Update
    Click Button    //*[@id="actions"]/div/button[3]
Update
    Click Button    //*[@id="mainSection"]/div/div[2]/form/div[2]/button[2]

Action Delete
    Click Button    //*[@id="actions"]/div/button[4]
Return
    Click Button    //*[@id="mainSection"]/div/div[2]/form/div[2]/button[1]


Create Service
    [Arguments]    ${service} 
    Input Text    libelle    ${service}  

Search Service
    [Arguments]    ${serviceName} 
    Input Text    //*[@id="mat-input-1"]    ${serviceName}


Open Ticket Menu
    Click Element    //*[@id="userActions"]/div[4]/div/div/app-menu/nav/ul/li[4]
Search
    Click Element    //*[@id="userActions"]/div[4]/div/div/app-menu/nav/ul/li[4]/ul/li[1]

Search Ticket
    [Arguments]    ${ticket}
    Input Text    //*[@id="mat-input-0"]    ${ticket}
Select
    Click Element    //*[@id="mat-autocomplete-0"]
Ticket Actions
    Click Button    triggerId
Ticket Print
    Click Button    //*[@id="actions"]/div/div/button
#Print Selected Ticket
#   Click Button    //*[@id="sidebar"]//print-preview-button-strip//div/cr-button[1]
Show Panel
    Click Element    //*[@id="userActions"]/div[4]/div/div/app-menu/nav/ul/li[4]/ul/li[2]
Expand Panel
    Click Button    //*[@id="mainSection"]/div[1]/button 

Resource Name    
    [Arguments]    ${Resource}
    Input Text    //*[@id="libelle"]    ${Resource}

Resource state
    Click Element    //*[@id="etat"]
Resource Quantity
    [Arguments]    ${RQuantity}
    Input Text    //*[@id="quantite"]    ${RQuantity}
Resource Unity
    Click Element    //*[@id="unite"]
    Click Element    //*[@id="unite"]/option[3]
Resource Price
    [Arguments]    ${RPrice}
    Input Text    //*[@id="prix"]    ${RPrice}
Resource Category
    [Arguments]    ${RCategory}
    Input Text    //*[@id="famille"]    ${RCategory}
Resource Xtics
    Click Element    //*[@id="caracteristique"]
    Click Element    //*[@id="caracteristique"]/option[3]
    Sleep    3s
    Click Button    //*[@id="mainSection"]/div/div[2]/form/div/div[2]/button[2]