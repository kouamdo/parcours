*** Settings ***
Library           OperatingSystem
Library           Process
Suite Setup       Build And Run Docker Image
Suite Teardown    Cleanup Docker Image

*** Variables ***
${DOCKERFILE_PATH}    ../Dockerfile
${IMAGE_NAME}         frontApp:latest
${CONTAINER_NAME}     frontapp

*** Test Cases ***
Dockerfile Should Exist
    File Should Exist    ${DOCKERFILE_PATH}

Docker Image Should Be Running
    ${result} =    Run And Return Rc And Output    docker ps --filter "name=${CONTAINER_NAME}"
    Should Be Equal As Integers    ${result[0]}    0
    Should Contain    ${result[1]}    ${CONTAINER_NAME}

*** Keywords ***
Build And Run Docker Image
    ${result} =    Run And Return Rc And Output    docker build -t ${IMAGE_NAME} -f ${DOCKERFILE_PATH} .
    Should Be Equal As Integers    ${result[0]}    0
    ${result} =    Run And Return Rc And Output    docker run -d --name ${CONTAINER_NAME} ${IMAGE_NAME}
    Should Be Equal As Integers    ${result[0]}    0

Cleanup Docker Image
    ${result} =    Run And Return Rc And Output    docker stop ${CONTAINER_NAME}
    Should Be Equal As Integers    ${result[0]}    0
    ${result} =    Run And Return Rc And Output    docker rm ${CONTAINER_NAME}
    Should Be Equal As Integers    ${result[0]}    0
    ${result} =    Run And Return Rc And Output    docker rmi ${IMAGE_NAME}
    Should Be Equal As Integers    ${result[0]}    0