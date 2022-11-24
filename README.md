<img src="https://millo-l.github.io/static/017a91d3df72ed6117dcdb47fab3c810/21b4d/webrtc-server.png" width="80%">

[사진 출처](https://millo-l.github.io/WebRTC-%EA%B5%AC%ED%98%84-%EB%B0%A9%EC%8B%9D-Mesh-SFU-MCU)

## Signaling 서버 (Mesh)
- peer간의 session signal(offer, answer)만을 중계
- 처음에 pper간의 정보 중계할 때만 서버 과부화, peer 간 연결 완료 후에는 서버에 별도 부하 없음
- 1:1 연결에 적합
- 서버 자원이 적게들고, peer간의 직접 연결로 데이터 송수신하므로 실시간 성 보장
- N:N / N:M에서 클라이언트의 과부하 급격히 증가 (만약 5명이 WebRCT 연결 시, 한 명당 총 8개의 link(총 4명과 데이터를 주고 받으므로) 유지하며 데이터 송수신)
- [1:1 P2P](https://github.com/DeveloperHailie/practiceRTC/tree/main/1vs1_P2P)
- [1:N P2P](https://github.com/DeveloperHailie/practiceRTC/tree/main/1vsN_P2P), RTCPeerConnection을 화상 회의에 참여하는 수만큼 가지고 있어야 함



## SFU 서버 (Selective Forwarding Unit)
- 종단 간 미디어 트래픽 중계하는 중앙 서버 방식
- 클라이언트는 서버에게만 자신의 영상 데이터 보내면 된다. (upLink : 1) 
- BUT 상대방의 수만큼 데이터 받는 peer 유지해야 한다. (서버로부터 상대방의 수만큼 데이터 받음 _ downLink : 상대방의 수)
- Signaling 서버보다 서버 비용 증가
- 대규모 N:M 구조에서는 여전히 클라이언트가 많은 부하 담당

## MCU 서버 (Multi-point Control Unit)
- 다수의 송출 미디어를 중앙 서버에서 혼합/가공하여 수신측으로 전달하는 중앙 서버 방식
- 5인이 WebRTC 연결 시, A를 제외한 다른 4인의 영상/음성 데이터를 하나의 영상/음성 데이터로 편집하여 A에게 보낸다.
- 클라이언트는 서버에게만 자신의 데이터를 보내면 된다. (upLink : 1) 
- 상대방의 수와 상관 없이, 서버에게서 하나의 peer로 데이터를 받으면 된다. (서버가 하나로 데이터 편집하였기 때문에 _ downLink : 1)
- 클라이언트의 부하가 현저히 줄어들지만, 서버의 높은 컴퓨팅 파워가 요구된다.
- WebRTC의 최대 장점인 실시간성이 저해되며, 데이터를 결합하는 과정에서 비용이 많이 든다.

<br>
[참고1](https://millo-l.github.io/WebRTC-%EA%B5%AC%ED%98%84-%EB%B0%A9%EC%8B%9D-Mesh-SFU-MCU/) <br/>
[참고2](https://surprisecomputer.tistory.com/14)
