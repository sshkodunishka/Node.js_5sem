#define _WINSOCK_DEPRECATED_NO_WARNINGS
#include <iostream>
#include "ErrorMsgText.h"
#include "Winsock2.h"                
#pragma comment(lib, "WS2_32.lib")   


int main()
{
    setlocale(LC_ALL, "rus");

    WSADATA wsaData;
    SOCKET  sS;
    SOCKADDR_IN serv;
    serv.sin_family = AF_INET;
    serv.sin_port = htons(40000);
    serv.sin_addr.s_addr = INADDR_ANY;

    try {
        cout << "ServerT\n\n";

        if (WSAStartup(MAKEWORD(2, 0), &wsaData) != 0) {
            throw  SetErrorMsgText("Startup: ", WSAGetLastError());
        }
        if ((sS = socket(AF_INET, SOCK_STREAM, NULL)) == INVALID_SOCKET) {
            throw  SetErrorMsgText("socket: ", WSAGetLastError());
        }
        if (bind(sS, (LPSOCKADDR)&serv, sizeof(serv)) == SOCKET_ERROR) {
            throw  SetErrorMsgText("bind: ", WSAGetLastError());
        }
        if (listen(sS, SOMAXCONN) == SOCKET_ERROR) {
            throw SetErrorMsgText("listen: ", WSAGetLastError());
        }

        SOCKET cS;
        SOCKADDR_IN clnt;
        memset(&clnt, 0, sizeof(clnt));
        int lclnt = sizeof(clnt);

        char ibuf[50], obuf[50];
        int libuf = 0, lobuf = 0;

        while (true) {
            if ((cS = accept(sS, (sockaddr*)&clnt, &lclnt)) == INVALID_SOCKET) {
                throw SetErrorMsgText("accept: ", WSAGetLastError());
            }

            /*cout << "Client's IP: " << inet_ntoa(clnt.sin_addr);
            cout << endl << "Client's port: " << clnt.sin_port << endl;*/

            while (true) {
                if ((libuf = recv(cS, ibuf, sizeof(ibuf), NULL)) == SOCKET_ERROR) {
                    SetErrorMsgText("recv serv: ", WSAGetLastError()); break;
                }

                string obuf = ibuf;
                obuf = "ECHO: " + obuf;
                if ((lobuf = send(cS, obuf.c_str(), strlen(obuf.c_str()) + 1, NULL)) == SOCKET_ERROR) {
                    throw SetErrorMsgText("send serv: ", WSAGetLastError());
                }

                cout << ibuf << endl;                

                break;
            }
        }

        if (closesocket(cS) == SOCKET_ERROR) {
            throw  SetErrorMsgText("closesocket: ", WSAGetLastError());
        }
        if (closesocket(sS) == SOCKET_ERROR) {
            throw  SetErrorMsgText("closesocket: ", WSAGetLastError());
        }
        if (WSACleanup() == SOCKET_ERROR) {
            throw  SetErrorMsgText("Cleanup: ", WSAGetLastError());
        }
    }
    catch (string errorMsgText) {
        cout << endl << errorMsgText;
    }

    system("pause");
    return 0;
}