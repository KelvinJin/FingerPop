require "observer"
require 'bisect/core_ext'
require 'securerandom'

class PlayerManager < Manager
  def initialize
    @player_list = []
  end

  def _add_player player
    @player_list.insort player
  end

  def add_player ip_addr
    new_player = Player.new next_player_id, ip_addr, next_player_name
    _add_player new_player
    new_player
  end

  def remove_player player_id
    @player_list.bdelete { |x| player_id <=> x.player_id }
  end

  def index player
    @player_list.bindex player
  end

  def find player_id
    @player_list.bsearch { |x| player_id <=> x.player_id }
  end

  def player_count
    @player_list.count
  end

  # Get the notification from decision maker
  def update command
    if command.is_a? PlayerNameChangeCommand
      player = @player_list.bsearch { |x| command.session_id <=> x.session_id }
      player.name = command.new_name
    end
  end

  def next_player_id
    SecureRandom.hex
  end

  def next_player_name
    "Player" + Time.now.to_i.to_s
  end

  def to_s
    @player_list.map { |p| p.name } .join ","
  end
end