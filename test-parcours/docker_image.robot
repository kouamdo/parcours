*** Settings ***
Library           OperatingSystem

*** Variables ***
${DOCKERFILE_PATH}         ${CURDIR}/Dockerfile
${IMAGE_NAME}   frontapp:latest
${CONTAINER_NAME}     frontapptest
${URL_TO_TEST}    http://localhost:8080

*** Test Cases ***
Docker File should exist
        File Should Exist    ${DOCKERFILE_PATH}

Build And Run Docker Image
    ${result} =    Run And Return Rc And Output    docker build -t ${IMAGE_NAME} -f ${DOCKERFILE_PATH} .
    Should Be Equal As Integers    ${result[0]}    0
    ${result} =    Run And Return Rc And Output    docker run -d -p 8080:80 --name ${CONTAINER_NAME} ${IMAGE_NAME}
    Should Be Equal As Integers    ${result[0]}    0

Docker Image Should Be Running
    ${result} =    Run And Return Rc And Output    docker ps --filter "name=${CONTAINER_NAME}"
    Should Be Equal As Integers    ${result[0]}    0
    Should Contain    ${result[1]}    ${CONTAINER_NAME}

#Test URL Returns 200
#    ${result} =    Run And Return Rc And Output    curl -s -o /dev/null  ${URL_TO_TEST}
#    Should Be Equal As Strings    ${result[1]}    200

Cleanup Docker Image
    ${result} =    Run And Return Rc And Output    docker stop ${CONTAINER_NAME}
    Should Be Equal As Integers    ${result[0]}    0
    ${result} =    Run And Return Rc And Output    docker rm ${CONTAINER_NAME}
    Should Be Equal As Integers    ${result[0]}    0
    ${result} =    Run And Return Rc And Output    docker rmi ${IMAGE_NAME} --force
    Should Be Equal As Integers    ${result[0]}    0