#define _WINSOCK_DEPRECATED_NO_WARNINGS
#include <iostream>
#include <chrono>
#include "ErrorMsgText.h"

using namespace std;

int main()
{
    WSADATA wsadata;
    SOCKET s1; // servers socket

    try {
        //dll init && start work
        if (WSAStartup(MAKEWORD(2, 0), &wsadata) != 0) {
            throw SetErrorMessageText("Startip: ", WSAGetLastError());
        }

        //open socket
        if ((s1 = socket(AF_INET, SOCK_DGRAM, NULL)) == INVALID_SOCKET) {
            throw SetErrorMessageText("Socket: ", WSAGetLastError());
        }

        //conection
        ///set params
        SOCKADDR_IN serv;
        serv.sin_family = AF_INET; // it is using ip-addr
        serv.sin_port = htons(3000); // htons = u_short to net format (2b -> 2b)
        //serv.sin_port = htons(2000); // htons = u_short to net format (2b -> 2b)
        serv.sin_addr.s_addr = inet_addr("127.0.0.1"); // any individuale ip-addr

        //send
        char ibuf[50]; // input buffer
        //char obuf[50]; // output buffer
        int libuf = 0, // count recived bites
            lobuf = 0; // count sended bites

        char number[5];
        int lc = sizeof(serv);

        cout << "ClientU\n\n";
        
        string obuf = "Hello";
            if ((lobuf = sendto(s1, obuf.c_str(), strlen(obuf.c_str()) + 1, NULL, (sockaddr*)&serv, lc)) == SOCKET_ERROR) {
                throw SetErrorMessageText("Send: ", WSAGetLastError());
            }

            
            if ((lobuf = recvfrom(s1, ibuf, sizeof(ibuf), NULL, (sockaddr*)&serv, &lc)) == SOCKET_ERROR) {
                throw SetErrorMessageText("Recive: ", WSAGetLastError());
            }

            cout << ibuf << endl;
        
        //close socket
        if ((s1 = closesocket(s1)) == SOCKET_ERROR) {
            throw SetErrorMessageText("Close socket: ", WSAGetLastError());
        }
        //dll cleanup
        if (WSACleanup() == SOCKET_ERROR) {
            throw SetErrorMessageText("Cleanup: ", WSAGetLastError());
        }
    }
    catch (string messageErrorText) {
        cout << endl << messageErrorText;
    }
}
