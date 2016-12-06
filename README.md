#Foliechatt
A secure end-to-end encrypted chat client and server architecture.
#Introduction
Foliechatt (Tin Foil Chat) is a three-week project resulting from a course in software security at Teknikhögskolan in Gothenburg. The purpose of the project was to create a piece of software that, to as large an extent as possible, was secure from unautorized access.

We decided to make an encypted chat system, with the goal of allowing people to communicate with absolute certainty that no one can listen in on the conversation.
#Our security implementation
##Log in, and user verification
We have chosen to implement a user database, where we store users with a unique **alias**, as well as an **e-mail address** and a **password**. The latter two are for authentication, and the former is for identification and message routing. The purpose of this system is that users can only access the services if they are logged in. This in turn should ensure that a user cannot adopt another users alias in an attempt to trick other users of a chat room. In other words: *if a user with a certain alias shows up in a chat room you can be sure that it is the account associated with this alias that messages are sent to and not another.*

The passwords are stored in salted hash values using the **SHA512** hasing algorithm.

When a user wants to create a new account or log in to an existing account the data should be sent via an **SSL-encrypted connection**. This must be configured (and prefereably certified) on the hosting server.

##Key distribution
We've opted for an implementation of **public key cryptography**, using our backend as a **public key server**. Each chat room keeps a list of the users participating in it, where each entry is the user alias and it's corresponding public key. This list is then shared with all the participants of the room.
##Message encryption
When a user wants to send a message, the text will be encrypted with **OpenPGP**, once for each recipient, and then sent to the server. The server recieves the messages and routes them to the intended reciever, using user alias as the address.

When a message is sent, the sender of the message will themselves be on the list of recipients. When the sender recieves, decrypts, and displayes the message they just sent, this is an indication that everything went all right.
#Known issues
* Nothing prevents a user from entering a weak password
* Nothing in the server-side software prevents a brute force attack or repeated failed log in attempts.
* We've implemented our own system of keeping track of logged in users sessions. This might be weak in comparison to established security solutions (although they might be more than we need).
* We have no tests. Father, forgive us.

#Future features
* Proper logging
* Using a randomised or hashed value for message addressing, so as to rely less on user defined values for routing.
* Inviting users to rooms via username
* Private rooms with user access control
* List of public rooms

#Contributors
* [Henrik Bohlin](https://gitlab.com/HenrikBohlin)
* [Marco Fält](https://gitlab.com/marco.falt)
* [Tobias Ljungström](https://github.com/tobiasljungstrom)
* [Erik Wiberg](https://gitlab.com/erik-wiberg-87)