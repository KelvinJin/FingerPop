class SessionStartCommandResult < CommandResult
  def initialize session_id, player_id, player_name, new_unsorted_word
    @session_id = session_id
    @player_id = player_id
    @player_name = player_name
    @new_unsorted_word = new_unsorted_word
  end
end