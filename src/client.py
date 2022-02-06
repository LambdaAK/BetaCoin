import requests
url = 'http://localhost:3000'
privateKey = input("Enter your private key: ")


while True:
    command = input("Enter command: ")
    if command == "exit":
        break
    elif command == 'send':
        recipient = input("Recipient: ")
        amount = input("Amount: ")
        requests.get(url + '/send', params={'privateKey': privateKey, 'recipient': recipient, 'amount': amount})
    elif command == 'balance':
        address = input("Address: ")
        print(requests.get(url + '/balance', params={'address': address}).text)
    else :
        print("Invalid command")