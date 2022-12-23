#define _CRT_SECURE_NO_WARNINGS
#define _WINSOCK_DEPRECATED_NO_WARNINGS
#define _CRT_SECURE_NO_WARNINGS

#include <iostream>
#include "ErrorMsgText.h"
#pragma comment(lib, "WS2_32.lib")

using namespace std;


int main()
{
    WSADATA wsadata;
    SOCKET s1; // servers socket

    try {
        while (true) {
            //dll init && start work
            if (WSAStartup(MAKEWORD(2, 0), &wsadata) != 0) {
                throw SetErrorMessageText("Startip: ", WSAGetLastError());
            }

            //create socket
            if ((s1 = socket(AF_INET, SOCK_DGRAM, NULL)) == INVALID_SOCKET) {
                throw SetErrorMessageText("Socket: ", WSAGetLastError());
            }

            //Set sockets parameters
            SOCKADDR_IN serv;
            serv.sin_family = AF_INET; // it is using ip-addr
            serv.sin_port = htons(3000); // htons = u_short to net format (2b -> 2b)
            serv.sin_addr.s_addr = INADDR_ANY; // any individuale ip-addr

            if (bind(s1, (LPSOCKADDR)&serv, sizeof(serv)) == SOCKET_ERROR) {
                throw SetErrorMessageText("Bind: ", WSAGetLastError());
            }

            SOCKADDR_IN clnt; //clients socket params
            memset(&clnt, 0, sizeof(clnt)); //set memmory in empty
            int lc = sizeof(clnt); //size of SOCKAADDR_IN

            char ibuf[50]; // input buffer
            int lb = 0; //count recive's bites

            cout << "ServerU\n\n";

            int i = 0;

            while (true) {
                if ((lb = recvfrom(s1, ibuf, sizeof(ibuf), NULL, (sockaddr*)&clnt, &lc)) == SOCKET_ERROR)
                    throw  SetErrorMessageText("recv:", WSAGetLastError());
                cout << ibuf << endl;

                string obuf = ibuf;
                obuf = "ECHO: " + obuf;
                if ((lb = sendto(s1, obuf.c_str(), strlen(obuf.c_str()) + 1, NULL, (sockaddr*)&clnt, lc)) == SOCKET_ERROR) {
                    throw SetErrorMessageText("Send: ", WSAGetLastError());
                }
                ++i;
            } 

            //close socket
            if ((s1 = closesocket(s1)) == SOCKET_ERROR) {
                throw SetErrorMessageText("Close socket: ", WSAGetLastError());
            }
            //dll cleanup
            if (WSACleanup() == SOCKET_ERROR) {
                throw SetErrorMessageText("Cleanup: ", WSAGetLastError());
            }
        }
    }
    catch (string messageErrorText) {
        cout << endl << messageErrorText;
    }
}

