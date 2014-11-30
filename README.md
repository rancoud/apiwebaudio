#POSTULAT
- Un son est directement encapsulé dans un TrackManager
- le SoundManager lit un ensemble de TrackManager
- les nodes sont tous branchés sur le TrackManager
- les nodes sont modifiés de manière temporel

#TODO
- [ ] utiliser le SoundManager avec un seul son
  - [ ] fonction play (play sound)
  - [ ] fonction stop (stop sound)
- [ ] creation du GainNode
  - [ ] fonction init
  - [ ] etc...
- [ ] utiliser le TrackManager pour une gestion multinode
  - [ ] fonction add (add node)
  - [ ] fonction remove (remove node)
  - [ ] fonction insert (insert node between anoters)
  - [ ] fonction compile (check node connect)
  - [ ] fonction connect (connect nodes)
  - [ ] fonction getListNode (la liste des nodes)
- [ ] le SoundManager doit lire un TrackManager
  - [ ] fonction addTrackManager (add TrackManager)
  - [ ] fonction removeTrackManager (remove TrackManager)
  - [ ] fonction playTrack (play TrackManager)
  - [ ] fonction stopTrack (stop TrackManager)
- [ ] BONUS
  - [ ] generer une phrase aléatoire musicale