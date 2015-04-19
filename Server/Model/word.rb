class Word
  def initialize word
    @word = word
    @index = 0
    @unsorted_letters = []
    word.each_char do |x|
      @unsorted_letters << x
    end
  end

  def unsorted
    @unsorted_letters.shuffle.join ""
  end

  def insert_letter slot_id, letter
    # Return if the current index is already over the length which
    # means that the word is done.
    return if complete?

    if slot_id == @index and @word[@index] == letter
      @index += 1
      return letter, complete?
    end
  end

  def complete?
    @index >= @word.length
  end
end