/* eslint-disable no-undef */
test.skip('Game should handle playerLeft events', () => {
  /**
   *  1) case game in running state and player has already drawn in this round
   *    it should update turn pointer (subract 1 from turn to sync with players [] shifting)
   *
   *  2) case game in running state and player is drawing
   *    it should update turn pointer (subract 1 from turn to sync with players [] shifting),
   *    clearTimer and switch turns immediately
  /**
   *  is should end game if not enough players left (2 players can still enjoy their game :))
   */
});
test.skip('Game should emit turnEnded after drawTime ends', () => {
  // it should have a timer initalized with drawTime
  /**
   * it should emit turnEnded with
   *  1) index of current player
   *  2) current score
   *  3) list of word choices for next player
   */
  // it should not repeat words choosed during the entire game
});
test.skip('Game should emit turnStarted after player chooses a word', () => {
  // it should store this word so that it won't repeat it in incoming word choices
  // it should start drawTimer
  // it should then emit turnStarted with current player index
});
test.skip('Player can send reacts (eggs, tomatoes, etc..) to other players during game', () => {});
