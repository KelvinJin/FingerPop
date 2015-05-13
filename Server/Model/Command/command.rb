class Command
  attr_accessor :session_id, :player_id
  include JSONable

  module CommandType
    ########## Session management ##########
    SESSION_START = 0
    SESSION_END = 1

    ########## Player related command ###########
    PLAYER_NAME_CHANGE = 2

    ########## Game related command ###########
    LETTER_INSERT = 3
    LETTER_REMOVE = 4
    LETTER_SWAP   = 5

    ########## Critical Section ###########
    TOKEN_REQUEST = 99
    TOKEN_RELEASE = 100
  end

  def initialize session_id = nil, player_id = nil
    @session_id = session_id
    @player_id = player_id
  end
end