NUMBER_OF_WORDS_PER_GAME = 100

class WordManager
  def initialize
    prepare_words

    # Reset the index to 0
    @current_word_index = 0
  end

  def prepare_words
    # Generate the candidate word list for the game session
    @current_word_list = WordListManager.instance.random_words(NUMBER_OF_WORDS_PER_GAME)
                             .map { |w| Word.new w }
  end

  def current_unsorted_word
    @current_word_list[@current_word_index].unsorted
  end

  def insert_letter letter

    is_first, slot_ids, complete = @current_word_list[@current_word_index]
                                    .insert_letter letter

    is_correct = !slot_ids.nil?
    is_last = complete

    increase_word_index if complete

    # Return how many scores this action will gain
    LetterInsertCommandResult.new nil, nil,
                                  score_for_letter(is_correct, is_first, is_last),
                                  slot_ids.nil? ? [] : slot_ids, letter, complete,
                                  complete ? current_unsorted_word : nil
  end

  private

  def increase_word_index
    # Reset the word list when the current list is used out of.
    if @current_word_index >= @current_word_list.count
      prepare_words
      @current_word_index = 0
    else
      @current_word_index += 1
    end
  end

  def score_for_letter is_correct, is_first, is_last
    return -5 unless is_correct

    return 10 if is_first

    return 20 if is_last

    5
  end
end