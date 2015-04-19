class ScoreBoardManager < Manager
  def initialize
    @score_board = ScoreBoard.new
  end

  def add_player player
    @score_board.add_entry ScoreBoardEntry.new player
  end

  def remove_player player
    temp_entry = ScoreBoardEntry.new player
    @score_board.remove_entry temp_entry
  end

  def update_score player, d_score
    entry = @score_board.entry_of player

    @score_board.update_score entry, d_score
  end

  def to_s
    @score_board.to_s
  end
end