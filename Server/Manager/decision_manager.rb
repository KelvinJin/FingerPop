require "observer"

class DecisionManager
  include Observable

  # This method is called by message handler who will pass a parsed
  # command to us.
  def process_command command

    # The decision maker will validate the command
    # and get rid of the commands that is invalid
    # and make the right order of commands and notify different observers.

    # Notify the observers that a new valid command comes.
    command
  end
end