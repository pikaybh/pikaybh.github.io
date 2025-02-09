---
title: "Understanding TCP Sessions: How Connections Are Established, Maintained, and Terminated"
categories:
  - Notes
tags:
  - TCP/UDP
  - IPv4
  - IPv6
gallery:
  - url: /assets/images/headers/CN-2.png
    image_path: assets/images/headers/CN-2.png
    alt: placeholder assets/images/headers/CN-2.png
  - url: /assets/images/headers/CN-1.png
    image_path: assets/images/headers/CN-1.png
    alt: placeholder assets/images/headers/CN-1.png
author_profile: false
toc: true
toc_sticky: true
header:
  overlay_image: assets/images/headers/DALL·E 2025-02-10 01.47.53 - A wide-angle realistic illustration of two hands shaking in a professional handshake. The handshake symbolizes agreement, connection, and trust. The b.webp
  teaser: assets/images/headers/DALL·E 2025-02-10 01.47.53 - A wide-angle realistic illustration of two hands shaking in a professional handshake. The handshake symbolizes agreement, connection, and trust. The b.webp
  caption: 
---

In the realm of computer networking, the **Transmission Control Protocol (TCP)** plays a pivotal role in ensuring reliable communication between devices. A fundamental concept within TCP is the **TCP session**, which facilitates structured and dependable data exchange.


## What is a TCP Session?


A **TCP session**, also known as a TCP connection, is a communication link established between two devices (commonly referred to as hosts) over a network. This session ensures that data transmitted between the devices is delivered accurately and in sequence, providing a reliable stream of information. The session is maintained from the initiation of the connection until its termination.


## Establishing a TCP Session: The Three-Way Handshake


The initiation of a TCP session involves a process called the **three-way handshake**, which sets up the connection parameters and ensures both parties are ready for data transmission. This handshake comprises three steps:

1. **SYN (Synchronize):** The initiating device (Client) sends a SYN packet to the receiving device (Server), indicating a request to establish a connection.
2. **SYN-ACK (Synchronize-Acknowledge):** Upon receiving the SYN packet, the Server responds with a SYN-ACK packet, acknowledging the receipt of the SYN and expressing its readiness to establish the connection.
3. **ACK (Acknowledge):** The Client sends an ACK packet back to the Server, confirming the successful receipt of the SYN-ACK. With this exchange, the connection is established, and the TCP session begins.

This handshake ensures that both devices are synchronized and agree upon the initial sequence numbers, laying the groundwork for reliable communication.


{% include gallery caption=’TCP states visited by a client TCP [Source: [**GeeksforGeeks**](https://www.geeksforgeeks.org/tcp-connection-termination/){:target="_blank"}]’ %}


## Data Transmission Within a TCP Session


Once the session is established, data transmission can commence. TCP manages this process by segmenting large data streams into smaller packets, each assigned with sequence numbers. These sequence numbers allow the receiving device to reassemble the packets in the correct order, even if they arrive out of sequence.


Additionally, TCP employs acknowledgment packets (ACKs) to confirm the successful receipt of data. If a packet is lost or corrupted during transmission, the lack of an acknowledgment prompts the sender to retransmit the affected packet, ensuring data integrity.


## Terminating a TCP Session: The Four-Way Handshake


The conclusion of a TCP session is managed through a process known as the **four-way handshake**, which gracefully terminates the connection:

1. **FIN (Finish):** The device wishing to terminate the connection (e.g., the Client) sends a FIN packet to the other device (e.g., the Server), indicating that it has finished sending data.
2. **ACK:** The receiving device acknowledges the FIN packet with an ACK, confirming receipt.
3. **FIN:** The receiving device then sends its own FIN packet, indicating that it has also finished sending data.
4. **ACK:** The initiating device responds with an ACK, acknowledging the receipt of the FIN packet. With this final exchange, the TCP session is fully terminated.

This orderly termination ensures that both devices are aware that the connection has ended and that all transmitted data has been received.


## Key Characteristics of TCP Sessions

- **Connection-Oriented:** TCP sessions require an established connection between two devices before data transmission can occur, ensuring a dedicated path for communication.
- **Reliable Data Transfer:** Through sequence numbers and acknowledgments, TCP guarantees that data is delivered accurately and in the correct order.
- **Flow Control:** TCP manages the rate of data transmission based on the receiver's capacity, preventing overwhelming the receiving device.
- **Error Detection and Recovery:** TCP detects errors in data transmission and facilitates the retransmission of lost or corrupted packets.

## Conclusion


A **TCP session** is a cornerstone of reliable network communication, providing a structured method for devices to exchange data accurately and efficiently. Understanding the mechanics of TCP sessions, from the initial handshake to data transmission and termination, is essential for comprehending how modern networks maintain robust and error-free communication channels.


## Visual Explanation


For a visual explanation of TCP sessions, you might find this video helpful:


{% include video id="K4BE4Qf2Uf8" provider="youtube" %}


You can see the short version as well (funny version):


[video](https://www.youtube.com/shorts/R6WN4_bBB1Q){:target="_blank"}


## References

- [Transmission Control Protocol - Wikipedia](https://en.wikipedia.org/wiki/Transmission_Control_Protocol){:target="_blank"}
- [Handshake (computing) - Wikipedia](https://en.wikipedia.org/wiki/Handshake_%28computing%29){:target="_blank"}
- [Session (computer science) - Wikipedia](https://en.wikipedia.org/wiki/Session_%28computer_science%29){:target="_blank"}
- [https://www.geeksforgeeks.org/tcp-connection-termination/](https://www.geeksforgeeks.org/tcp-connection-termination/){:target="_blank"}
- [https://www.youtube.com/watch?v=K4BE4Qf2Uf8](https://www.youtube.com/watch?v=K4BE4Qf2Uf8){:target="_blank"}
- [https://www.youtube.com/shorts/R6WN4_bBB1Q](https://www.youtube.com/shorts/R6WN4_bBB1Q){:target="_blank"}
