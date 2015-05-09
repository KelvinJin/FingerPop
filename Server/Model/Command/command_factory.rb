class CommandFactory

  COMMAND_TYPE_KEY = :Type
  COMMAND_CONTENT_KEY = :Content

  def make_command message

    begin
      command_json = JSON.parse message, symbolize_names: true
    rescue
      return
    end

    puts "Message received : #{ command_json.inspect }"

    case command_json[COMMAND_TYPE_KEY]
      when Command::CommandType::SESSION_START
        return command_from_json SessionStartCommand, command_json[COMMAND_CONTENT_KEY]
      when Command::CommandType::SESSION_END
        return command_from_json SessionEndCommand, command_json[COMMAND_CONTENT_KEY]
      when Command::CommandType::PLAYER_NAME_CHANGE
        return command_from_json PlayerNameChangeCommand, command_json[COMMAND_CONTENT_KEY]
      when Command::CommandType::LETTER_INSERT
        return command_from_json LetterInsertCommand, command_json[COMMAND_CONTENT_KEY]
      else
        nil
    end
  end

  private

  def command_from_json klass, json
    new_command = klass.new
    new_command.from_json! json
    new_command
  end
end