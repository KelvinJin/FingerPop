class LetterInsertCommandResult < CommandResult
  attr_accessor :score_dif, :new_unsorted_word, :session_id, :complete, :letter, :slot_id, :player_id

  def initialize session_id, player_id, score_dif, slot_id, letter, complete, new_unsorted_word
    @session_id = session_id
    @player_id = player_id
    @score_dif = score_dif
    @letter = letter
    @slot_id = slot_id
    @complete = complete
    @new_unsorted_word = new_unsorted_word
  end
end