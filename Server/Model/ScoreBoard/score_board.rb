class ScoreBoard
  def initialize
    @entries = []
  end

  def add_entry entry
    @entries << entry
  end

  def index_of player
    @entries.index { |x| x.player == player }
  end

  def entry_of player
    index = index_of player
    index != -1 ? @entries[index] : nil
  end

  def remove_entry entry
    @entries.delete entry
  end

  def update_score entry, score
    entry.update_score score if entry.is_a? ScoreBoardEntry
  end

  def sort
    # Sorted the list decreasing. Maybe we should let client side to do this?
    @entries.sort { |x, y| y.score <=> x.score }
  end

  def to_s
    @entries.map { |e| e.to_s } .join "\n"
  end
end