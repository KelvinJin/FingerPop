class SessionStartCommandResult < CommandResult
  def initialize session_id, player_list, new_unsorted_word
    @session_id = session_id
    @player_list = player_list
    @new_unsorted_word = new_unsorted_word
  end
end