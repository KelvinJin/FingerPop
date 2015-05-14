class LetterInsertCommandResult < CommandResult
  attr_accessor :message, :session_id, :player_id

  def initialize session_id, player_id, message
    @session_id = session_id
    @player_id = player_id
    @message = message
  end
end